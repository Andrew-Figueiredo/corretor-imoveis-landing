import { CIDADE, NOME_IMOBILIARIA } from "@/lib/constantes";
import { gerarLinkWhatsAppGeral } from "@/lib/whatsapp";

export function Footer() {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="border-t border-primary/10 bg-primary-dark text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm sm:px-6">
        <p className="font-bold">{NOME_IMOBILIARIA}</p>
        <p className="mt-1 text-white/80">Imóveis em {CIDADE}</p>
        <a
          href={gerarLinkWhatsAppGeral()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block font-semibold text-accent hover:text-accent-dark"
        >
          Fale conosco no WhatsApp
        </a>
        <p className="mt-6 text-xs text-white/60">
          © {anoAtual} {NOME_IMOBILIARIA}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
