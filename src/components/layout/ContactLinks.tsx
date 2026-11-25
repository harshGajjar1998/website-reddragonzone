import type { ChromeContent } from "@/data/navigation";

/** Phone and email from the CMS, as tap-to-call and email links. Renders nothing when both are empty. */
export default function ContactLinks({ contact, className = "" }: { contact: ChromeContent["contact"]; className?: string }) {
  if (!contact.phone && !contact.email) return null;
  return (
    <ul className={`flex flex-col gap-1 ${className}`}>
      {contact.phone && (
        <li>
          <a href={`tel:${contact.phone.replace(/[^0-9+]/g, "")}`} className="hover:text-ink">{contact.phone}</a>
        </li>
      )}
      {contact.email && (
        <li>
          <a href={`mailto:${contact.email}`} className="hover:text-ink">{contact.email}</a>
        </li>
      )}
    </ul>
  );
}
