import { describe, expect, it } from "vitest";
import { imoveis, type TipoImovel } from "./imoveis";

const TIPOS_VALIDOS: TipoImovel[] = ["casa", "apartamento", "terreno"];

describe("seed de imoveis", () => {
  it("tem entre 15 e 20 registros", () => {
    expect(imoveis.length).toBeGreaterThanOrEqual(15);
    expect(imoveis.length).toBeLessThanOrEqual(20);
  });

  it("todo slug é único", () => {
    const slugs = imoveis.map((imovel) => imovel.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("todo tipo está dentro do union válido", () => {
    for (const imovel of imoveis) {
      expect(TIPOS_VALIDOS).toContain(imovel.tipo);
    }
  });

  it("tem pelo menos 1 destaque por tipo", () => {
    for (const tipo of TIPOS_VALIDOS) {
      const destaques = imoveis.filter((imovel) => imovel.tipo === tipo && imovel.destaque);
      expect(destaques.length).toBeGreaterThanOrEqual(1);
    }
  });
});
