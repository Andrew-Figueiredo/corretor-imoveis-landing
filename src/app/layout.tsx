import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { CIDADE, NOME_IMOBILIARIA } from "@/lib/constantes";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${NOME_IMOBILIARIA} — Seu novo lar em ${CIDADE}`,
  description:
    "Catálogo de imóveis populares e de classe média, com contato direto pelo WhatsApp — sem formulário, sem burocracia.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
