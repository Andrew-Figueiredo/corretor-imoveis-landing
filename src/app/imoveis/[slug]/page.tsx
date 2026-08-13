import { notFound } from "next/navigation";
import { FichaTecnica } from "@/components/FichaTecnica";
import { GaleriaFotos } from "@/components/GaleriaFotos";
import { MapaAproximado } from "@/components/MapaAproximado";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { imoveis } from "@/data/imoveis";
import { CIDADE } from "@/lib/constantes";
import { gerarLinkWhatsApp } from "@/lib/whatsapp";

export const dynamicParams = false;

export function generateStaticParams() {
  return imoveis.map((imovel) => ({ slug: imovel.slug }));
}

export async function generateMetadata(props: PageProps<"/imoveis/[slug]">) {
  const { slug } = await props.params;
  const imovel = imoveis.find((item) => item.slug === slug);
  return {
    title: imovel ? `${imovel.titulo} — Meu Cantinho Imóveis` : "Imóvel não encontrado",
  };
}

export default async function ImovelDetalhePage(props: PageProps<"/imoveis/[slug]">) {
  const { slug } = await props.params;
  const imovel = imoveis.find((item) => item.slug === slug);

  if (!imovel) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold">{imovel.titulo}</h1>
      <p className="mt-1 text-foreground/70">{imovel.bairro}</p>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <GaleriaFotos fotos={imovel.fotos} titulo={imovel.titulo} />
          <p className="mt-6 text-foreground/80">{imovel.descricao}</p>
          <div className="mt-6">
            <MapaAproximado bairro={imovel.bairro} cidade={CIDADE} />
          </div>
        </div>
        <div className="space-y-6">
          <FichaTecnica imovel={imovel} />
          <WhatsAppCTA href={gerarLinkWhatsApp(imovel)} label="Agendar visita no WhatsApp" />
        </div>
      </div>
    </div>
  );
}
