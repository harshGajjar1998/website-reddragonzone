import HelloBar from "./HelloBar";
import MainNav from "./MainNav";

/** Global site header: announcement bar (40px) + main navigation (72px). */
export default function Header() {
  return (
    <header className="relative z-20">
      <HelloBar />
      <MainNav />
    </header>
  );
}
