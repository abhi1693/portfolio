import Link from "next/link";

export function PortfolioHeader({ gadgets = false }: { gadgets?: boolean }) {
  const home = gadgets ? "/" : "";
  return (
    <header>
      <Link className="brand" href={home || "#main"} aria-label="Abhimanyu Saharan home">
        <b>as<span>.</span></b>
      </Link>
      <nav aria-label="Main">
        <Link href={home + "#projects"}>Projects</Link>
        <Link href={home + "#writing"}>Writing</Link>
        <Link href="/gadgets" aria-current={gadgets ? "page" : undefined}>Gadgets</Link>
        <Link href={home + "#contact"}>Contact</Link>
      </nav>
    </header>
  );
}
