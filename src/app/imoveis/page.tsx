import { FiltroImoveis } from "@/components/FiltroImoveis";
import { imoveis } from "@/data/imoveis";

export const metadata = {
  title: "Imóveis disponíveis — Meu Cantinho Imóveis",
};

export default function ImoveisPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold">Imóveis disponíveis</h1>
      <p className="mt-2 text-foreground/70">Use os filtros abaixo pra encontrar o imóvel ideal.</p>
      <div className="mt-8">
        <FiltroImoveis imoveis={imoveis} />
      </div>
    </div>
  );
}
