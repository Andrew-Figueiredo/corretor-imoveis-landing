import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ImovelCard } from "@/components/ImovelCard";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { imoveis } from "@/data/imoveis";
import { CIDADE } from "@/lib/constantes";
import { gerarLinkWhatsAppGeral } from "@/lib/whatsapp";

const DIFERENCIAIS = [
  {
    titulo: "Atendimento direto no WhatsApp",
    descricao: "Sem formulário, sem espera: você fala direto com o corretor.",
  },
  {
    titulo: "Imóveis verificados",
    descricao: "Cada imóvel do catálogo é visitado e conferido antes de anunciar.",
  },
  {
    titulo: "Sem burocracia",
    descricao: "Ajudamos você em cada etapa, da visita à documentação.",
  },
  {
    titulo: "Corretor local",
    descricao: `Quem conhece ${CIDADE} de verdade, bairro por bairro.`,
  },
];

export default function Home() {
  const destaques = imoveis.filter((imovel) => imovel.destaque);

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-extrabold">Imóveis em destaque</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {destaques.map((imovel) => (
            <ImovelCard key={imovel.slug} imovel={imovel} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/imoveis/" className="font-bold text-primary-dark hover:underline">
            Ver todos os imóveis →
          </Link>
        </div>
      </section>

      <section className="bg-primary/5 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-extrabold">Por que a Meu Cantinho Imóveis</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {DIFERENCIAIS.map((diferencial) => (
              <div key={diferencial.titulo} className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="font-bold text-primary-dark">{diferencial.titulo}</p>
                <p className="mt-2 text-sm text-foreground/70">{diferencial.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 text-center sm:px-6">
        <h2 className="text-2xl font-extrabold">Pronto pra encontrar seu imóvel?</h2>
        <p className="mx-auto mt-2 max-w-xl text-foreground/70">
          Fale agora com o corretor pelo WhatsApp e receba atendimento personalizado.
        </p>
        <div className="mt-6">
          <WhatsAppCTA href={gerarLinkWhatsAppGeral()} label="Falar no WhatsApp" />
        </div>
      </section>
    </>
  );
}
