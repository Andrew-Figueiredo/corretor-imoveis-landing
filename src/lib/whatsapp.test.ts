import { describe, expect, it } from "vitest";
import type { Imovel } from "@/data/imoveis";
import { gerarLinkWhatsApp, gerarLinkWhatsAppGeral } from "./whatsapp";

const IMOVEL_TESTE: Imovel = {
  slug: "casa-teste",
  titulo: "Casa com Quintal",
  tipo: "casa",
  precoCentavos: 20000000,
  quartos: 3,
  bairro: "Jardim Primavera",
  areaM2: 100,
  banheiros: 2,
  vagas: 1,
  caracteristicas: [],
  descricao: "",
  fotos: [],
  destaque: false,
};

describe("gerarLinkWhatsApp", () => {
  it("monta a URL com o número correto", () => {
    const link = gerarLinkWhatsApp(IMOVEL_TESTE);
    expect(link.startsWith("https://wa.me/5511999999999?text=")).toBe(true);
  });

  it("codifica título e bairro na mensagem", () => {
    const link = gerarLinkWhatsApp(IMOVEL_TESTE);
    const mensagemEsperada = encodeURIComponent(
      "Olá! Tenho interesse no imóvel: Casa com Quintal (Jardim Primavera)"
    );
    expect(link).toBe(`https://wa.me/5511999999999?text=${mensagemEsperada}`);
  });
});

describe("gerarLinkWhatsAppGeral", () => {
  it("monta um link válido para o número da imobiliária", () => {
    const link = gerarLinkWhatsAppGeral();
    expect(link.startsWith("https://wa.me/5511999999999?text=")).toBe(true);
  });
});
