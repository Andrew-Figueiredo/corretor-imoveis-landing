import type { Imovel, TipoImovel } from "@/data/imoveis";

export type FiltroCriterios = {
  tipo?: TipoImovel;
  precoMinCentavos?: number;
  precoMaxCentavos?: number;
  quartosMin?: number;
  bairro?: string;
};

export function filtrarImoveis(imoveis: Imovel[], criterios: FiltroCriterios): Imovel[] {
  return imoveis.filter((imovel) => {
    if (criterios.tipo && imovel.tipo !== criterios.tipo) return false;
    if (
      criterios.precoMinCentavos !== undefined &&
      imovel.precoCentavos < criterios.precoMinCentavos
    ) {
      return false;
    }
    if (
      criterios.precoMaxCentavos !== undefined &&
      imovel.precoCentavos > criterios.precoMaxCentavos
    ) {
      return false;
    }
    if (criterios.quartosMin !== undefined && imovel.quartos < criterios.quartosMin) {
      return false;
    }
    if (criterios.bairro && imovel.bairro !== criterios.bairro) return false;
    return true;
  });
}
