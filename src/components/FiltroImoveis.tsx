"use client";

import { useMemo, useState } from "react";
import type { Imovel, TipoImovel } from "@/data/imoveis";
import { filtrarImoveis } from "@/lib/filtros";
import { ImovelCard } from "./ImovelCard";

type FiltroImoveisProps = {
  imoveis: Imovel[];
};

const TIPOS: { valor: TipoImovel; rotulo: string }[] = [
  { valor: "casa", rotulo: "Casa" },
  { valor: "apartamento", rotulo: "Apartamento" },
  { valor: "terreno", rotulo: "Terreno" },
];

export function FiltroImoveis({ imoveis }: FiltroImoveisProps) {
  const [tipo, setTipo] = useState<TipoImovel | "">("");
  const [precoMax, setPrecoMax] = useState("");
  const [quartosMin, setQuartosMin] = useState("");
  const [bairro, setBairro] = useState("");

  const bairros = useMemo(
    () => Array.from(new Set(imoveis.map((imovel) => imovel.bairro))).sort(),
    [imoveis]
  );

  const resultado = useMemo(
    () =>
      filtrarImoveis(imoveis, {
        tipo: tipo || undefined,
        precoMaxCentavos: precoMax ? Number(precoMax) * 100 : undefined,
        quartosMin: quartosMin ? Number(quartosMin) : undefined,
        bairro: bairro || undefined,
      }),
    [imoveis, tipo, precoMax, quartosMin, bairro]
  );

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 rounded-2xl border border-primary/10 bg-white p-4 sm:grid-cols-4">
        <select
          value={tipo}
          onChange={(evento) => setTipo(evento.target.value as TipoImovel | "")}
          className="rounded-lg border border-primary/20 px-3 py-2 text-sm"
        >
          <option value="">Todos os tipos</option>
          {TIPOS.map((item) => (
            <option key={item.valor} value={item.valor}>
              {item.rotulo}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Preço máximo (R$)"
          value={precoMax}
          onChange={(evento) => setPrecoMax(evento.target.value)}
          className="rounded-lg border border-primary/20 px-3 py-2 text-sm"
        />

        <input
          type="number"
          placeholder="Quartos (mín.)"
          value={quartosMin}
          onChange={(evento) => setQuartosMin(evento.target.value)}
          className="rounded-lg border border-primary/20 px-3 py-2 text-sm"
        />

        <select
          value={bairro}
          onChange={(evento) => setBairro(evento.target.value)}
          className="rounded-lg border border-primary/20 px-3 py-2 text-sm"
        >
          <option value="">Todos os bairros</option>
          {bairros.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-4 text-sm text-foreground/60">
        {resultado.length} {resultado.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}
      </p>

      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {resultado.map((imovel) => (
          <ImovelCard key={imovel.slug} imovel={imovel} />
        ))}
      </div>
    </div>
  );
}
