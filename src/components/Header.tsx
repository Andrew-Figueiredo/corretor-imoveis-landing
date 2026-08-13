import Link from "next/link";
import { NOME_IMOBILIARIA } from "@/lib/constantes";

const links = [
  { href: "/", label: "Início" },
  { href: "/imoveis/", label: "Imóveis" },
  { href: "/sobre/", label: "Sobre" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-primary/10 bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-extrabold text-primary-dark">
          {NOME_IMOBILIARIA}
        </Link>
        <nav className="flex gap-6 text-sm font-semibold">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-primary-dark">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
