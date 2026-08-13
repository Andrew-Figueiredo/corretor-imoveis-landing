import { describe, expect, it } from "vitest";
import type { Imovel } from "@/data/imoveis";
import { filtrarImoveis } from "./filtros";

const IMOVEIS_TESTE: Imovel[] = [
  {
    slug: "casa-a",
    titulo: "Casa A",
    tipo: "casa",
    precoCentavos: 20000000,
    quartos: 2,
    bairro: "Centro",
    areaM2: 80,
    banheiros: 1,
    vagas: 1,
    caracteristicas: [],
    descricao: "",
    fotos: [],
    destaque: false,
  },
  {
    slug: "casa-b",
    titulo: "Casa B",
    tipo: "casa",
    precoCentavos: 40000000,
    quartos: 4,
    bairro: "Jardim Primavera",
    areaM2: 150,
    banheiros: 2,
    vagas: 2,
    caracteristicas: [],
    descricao: "",
    fotos: [],
    destaque: false,
  },
  {
    slug: "apartamento-a",
    titulo: "Apartamento A",
    tipo: "apartamento",
    precoCentavos: 15000000,
    quartos: 1,
    bairro: "Centro",
    areaM2: 40,
    banheiros: 1,
    vagas: 0,
    caracteristicas: [],
    descricao: "",
    fotos: [],
    destaque: false,
  },
  {
    slug: "terreno-a",
    titulo: "Terreno A",
    tipo: "terreno",
    precoCentavos: 8000000,
    quartos: 0,
    bairro: "Chácara dos Ipês",
    areaM2: 400,
    banheiros: 0,
    vagas: 0,
    caracteristicas: [],
    descricao: "",
    fotos: [],
    destaque: false,
  },
];

describe("filtrarImoveis", () => {
  it("sem critérios retorna todos os imóveis", () => {
    expect(filtrarImoveis(IMOVEIS_TESTE, {})).toHaveLength(4);
  });

  it("filtra por tipo", () => {
    const resultado = filtrarImoveis(IMOVEIS_TESTE, { tipo: "casa" });
    expect(resultado.map((i) => i.slug)).toEqual(["casa-a", "casa-b"]);
  });

  it("filtra por faixa de preço", () => {
    const resultado = filtrarImoveis(IMOVEIS_TESTE, {
      precoMinCentavos: 10000000,
      precoMaxCentavos: 20000000,
    });
    expect(resultado.map((i) => i.slug)).toEqual(["casa-a", "apartamento-a"]);
  });

  it("filtra por quartos mínimos", () => {
    const resultado = filtrarImoveis(IMOVEIS_TESTE, { quartosMin: 2 });
    expect(resultado.map((i) => i.slug)).toEqual(["casa-a", "casa-b"]);
  });

  it("filtra por bairro", () => {
    const resultado = filtrarImoveis(IMOVEIS_TESTE, { bairro: "Centro" });
    expect(resultado.map((i) => i.slug)).toEqual(["casa-a", "apartamento-a"]);
  });

  it("combina tipo, preço, quartos e bairro", () => {
    const resultado = filtrarImoveis(IMOVEIS_TESTE, {
      tipo: "casa",
      precoMinCentavos: 30000000,
      quartosMin: 3,
      bairro: "Jardim Primavera",
    });
    expect(resultado.map((i) => i.slug)).toEqual(["casa-b"]);
  });

  it("combinação sem resultados retorna array vazio", () => {
    const resultado = filtrarImoveis(IMOVEIS_TESTE, { tipo: "terreno", quartosMin: 1 });
    expect(resultado).toEqual([]);
  });
});
