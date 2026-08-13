import { CIDADE } from "@/lib/constantes";
import { gerarLinkWhatsAppGeral } from "@/lib/whatsapp";
import { WhatsAppCTA } from "./WhatsAppCTA";

export function Hero() {
  return (
    <section className="bg-primary/10 px-4 py-16 text-center sm:px-6">
      <h1 className="mx-auto max-w-2xl text-4xl font-extrabold text-primary-dark sm:text-5xl">
        Encontre seu novo lar em {CIDADE}
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-foreground/70">
        Catálogo de casas, apartamentos e terrenos com preços justos. Fale direto com o
        corretor pelo WhatsApp, sem formulário e sem burocracia.
      </p>
      <div className="mt-8">
        <WhatsAppCTA href={gerarLinkWhatsAppGeral()} label="Falar no WhatsApp" />
      </div>
    </section>
  );
}
