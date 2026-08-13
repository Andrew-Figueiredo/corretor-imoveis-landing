import Image from "next/image";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { CIDADE, NOME_CORRETOR, NOME_IMOBILIARIA } from "@/lib/constantes";
import { gerarLinkWhatsAppGeral } from "@/lib/whatsapp";

export const metadata = {
  title: `Sobre — ${NOME_IMOBILIARIA}`,
};

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold">Sobre a {NOME_IMOBILIARIA}</h1>

      <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-full">
          <Image
            src="/fotos/sobre/corretor.jpg"
            alt={NOME_CORRETOR}
            fill
            className="object-cover"
            sizes="160px"
          />
        </div>
        <div>
          <p className="text-xl font-bold">{NOME_CORRETOR}</p>
          <p className="mt-2 text-foreground/80">
            Corretor autônomo em {CIDADE} há mais de 10 anos. Conhece cada bairro da região e
            acompanha pessoalmente cada cliente, da primeira visita até a assinatura do
            contrato — sem formulário, sem burocracia e sem intermediários.
          </p>
          <div className="mt-6">
            <WhatsAppCTA href={gerarLinkWhatsAppGeral()} label="Falar com o corretor" />
          </div>
        </div>
      </div>
    </div>
  );
}
