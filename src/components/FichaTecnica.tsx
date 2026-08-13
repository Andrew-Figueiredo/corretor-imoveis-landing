import type { Imovel } from "@/data/imoveis";
import { formatarPreco } from "@/lib/formatacao";

const ROTULO_TIPO: Record<Imovel["tipo"], string> = {
  casa: "Casa",
  apartamento: "Apartamento",
  terreno: "Terreno",
};

type FichaTecnicaProps = {
  imovel: Imovel;
};

export function FichaTecnica({ imovel }: FichaTecnicaProps) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-white p-6">
      <p className="text-2xl font-extrabold text-primary-dark">
        {formatarPreco(imovel.precoCentavos)}
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-foreground/60">Tipo</dt>
          <dd className="font-semibold">{ROTULO_TIPO[imovel.tipo]}</dd>
        </div>
        <div>
          <dt className="text-foreground/60">Área</dt>
          <dd className="font-semibold">{imovel.areaM2} m²</dd>
        </div>
        {imovel.tipo !== "terreno" && (
          <>
            <div>
              <dt className="text-foreground/60">Quartos</dt>
              <dd className="font-semibold">{imovel.quartos}</dd>
            </div>
            <div>
              <dt className="text-foreground/60">Banheiros</dt>
              <dd className="font-semibold">{imovel.banheiros}</dd>
            </div>
            <div>
              <dt className="text-foreground/60">Vagas</dt>
              <dd className="font-semibold">{imovel.vagas}</dd>
            </div>
          </>
        )}
      </dl>
      {imovel.caracteristicas.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {imovel.caracteristicas.map((caracteristica) => (
            <span
              key={caracteristica}
              className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-dark"
            >
              {caracteristica}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
