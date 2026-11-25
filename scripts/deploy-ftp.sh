#!/usr/bin/env bash
# Upload the static build to a Hostinger website over FTPS, sending only what changed.
#
#   FTP_HOST=… FTP_USER=… FTP_PASSWORD=… scripts/deploy-ftp.sh [out]
#
# Every deploy fingerprints each file (sha1) and compares the list with the one the previous
# deploy left on the server (.deploy-manifest). Only new or changed files are uploaded and files
# the build no longer has are deleted. A CMS publish rebuilds the same code, and the build ID is the
# git commit (next.config.mjs), so only the pages whose content changed differ.
# No manifest on the server (first deploy, or the previous one was cut short) → full mirror.
set -euo pipefail
export LC_ALL=C # one byte order for sort and comm

OUT=${1:-out}
MANIFEST=.deploy-manifest
PARALLEL=8
: "${FTP_HOST:?}" "${FTP_USER:?}" "${FTP_PASSWORD:?}"
export LFTP_PASSWORD="$FTP_PASSWORD" # read by --env-password: any character is safe, and it stays off the command line
SETTINGS="set ftp:ssl-force true; set ftp:ssl-protect-data true; set ssl:verify-certificate no; set net:max-retries 3; set net:timeout 30"
ftp() { lftp --env-password -u "$FTP_USER" -e "$SETTINGS; $1; quit" "$FTP_HOST"; }
# lftp double-quoted argument
q() { local s=${1//\\/\\\\}; printf '"%s"' "${s//\"/\\\"}"; }
# Run an lftp command file in its own session; `strict` stops at the first failed command (exit 1)
ftp_script() {
  { echo "$SETTINGS"; if [ "${2:-}" = strict ]; then echo "set cmd:fail-exit true"; fi
    echo "open --env-password -u $(q "$FTP_USER") $(q "$FTP_HOST")"; cat "$1"; } > "$1.run"
  lftp -f "$1.run"
}

# Hostinger FTP accounts open in the website's folder (next to public_html) or inside public_html.
# `cls -1 /` prints entries with their path ("/public_html/"), hence the loose match.
listing=$(ftp "cls -1 /") || { echo "::error::FTP login failed – check the FTP_USER variable and FTP_PASSWORD secret"; exit 1; }
if echo "$listing" | grep -Eq '(^|/)public_html/?$'; then dir=/public_html
elif echo "$listing" | grep -Eq '(^|/)DO_NOT_UPLOAD_HERE$'; then echo "::error::In the domain folder but no public_html – refusing to upload"; exit 1
else dir=; fi
# Never delete inside a folder that holds the website's own folders
[ "$(ftp "cls -1 ${dir:-/}" | grep -Ec '(^|/)(public_html/?|DO_NOT_UPLOAD_HERE)$')" = 0 ] || { echo "::error::${dir:-/} is not a web root – refusing to upload"; exit 1; }
echo "Uploading to ${dir:-/}"

work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT
# "<sha1>  <path>" for every file, paths relative to $OUT; .well-known (SSL checks) is the host's
(cd "$OUT" && find . -type f ! -path './.well-known/*' -printf '%P\0' | sort -z | xargs -0 sha1sum | sed -E 's/^([0-9a-f]{40}) [ *]/\1  /') > "$work/new"

if ! ftp "get $(q "$dir/$MANIFEST") -o $(q "$work/old")" > /dev/null 2>&1 || [ ! -s "$work/old" ]; then
  echo "No manifest from a complete deploy on the server: uploading everything"
  keep="--exclude-glob .well-known/ --exclude-glob .well-known/*"
  # 1. new/resized files (fresh builds touch every file, so compare sizes, not times) – old pages keep working
  ftp "mirror -R --ignore-time --parallel=$PARALLEL $keep $OUT/ ${dir:-/}"
  # 2. every page/data file, whatever its size (a text edit can keep the size)
  ftp "mirror -R --parallel=$PARALLEL --include-glob *.html --include-glob *.txt --include-glob .htaccess $keep $OUT/ ${dir:-/}"
  # 3. remove what the new build no longer has
  ftp "mirror -R --ignore-time --delete --parallel=$PARALLEL $keep $OUT/ ${dir:-/}"
else
  path_of() { cut -c43-; } # sha1 (40) + two spaces
  sort "$work/old" > "$work/old.s"; sort "$work/new" > "$work/new.s"
  comm -13 "$work/old.s" "$work/new.s" | path_of | sort > "$work/changed"
  comm -23 <(path_of < "$work/old.s" | sort) <(path_of < "$work/new.s" | sort) > "$work/removed"
  # Pages last, so a page is never live before the scripts and images it uses
  grep -Ev '(\.html|\.txt|(^|/)\.htaccess)$' "$work/changed" > "$work/assets" || true
  grep -E '(\.html|\.txt|(^|/)\.htaccess)$' "$work/changed" > "$work/pages" || true
  echo "Changed: $(wc -l < "$work/assets") assets, $(wc -l < "$work/pages") page files · removed: $(wc -l < "$work/removed") · unchanged: $(( $(wc -l < "$work/new") - $(wc -l < "$work/changed") ))"

  # Until this deploy completes, the server has no manifest: a deploy cut short is followed by a full one
  ftp "rm -f $(q "$dir/$MANIFEST")" > /dev/null 2>&1 || true

  upload() { # $1 = file listing paths to upload
    [ -s "$1" ] || return 0
    # Folders first (one session), then the files over $PARALLEL sessions
    { while IFS= read -r d; do [ "$d" = . ] || echo "mkdir -p -f $(q "$dir/$d")"; done < <(while IFS= read -r f; do dirname "$f"; done < "$1" | sort -u); } > "$work/mkdir.lftp"
    # (no strict mode: mkdir reports folders that already exist as errors)
    if [ -s "$work/mkdir.lftp" ]; then ftp_script "$work/mkdir.lftp" > /dev/null 2>&1 || true; fi
    split -n "r/$PARALLEL" "$1" "$work/part."
    local pids=() p
    for p in "$work"/part.??; do
      [ -s "$p" ] || continue
      while IFS= read -r f; do echo "put $(q "$OUT/$f") -o $(q "$dir/$f")"; done < "$p" > "$p.lftp"
      ftp_script "$p.lftp" strict > /dev/null & pids+=($!)
    done
    for p in "${pids[@]}"; do wait "$p"; done
    rm -f "$work"/part.*
  }
  upload "$work/assets"
  upload "$work/pages"
  if [ -s "$work/removed" ]; then
    { while IFS= read -r f; do echo "rm -f $(q "$dir/$f")"; done < "$work/removed"; } > "$work/rm.lftp"
    ftp_script "$work/rm.lftp" > /dev/null 2>&1 || true # a file already gone is fine
  fi
fi

ftp "put $(q "$work/new") -o $(q "$dir/$MANIFEST")" > /dev/null
echo "Deploy complete; manifest saved"
