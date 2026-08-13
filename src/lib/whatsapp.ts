import type { Imovel } from "@/data/imoveis";
import { NUMERO_WHATSAPP } from "./constantes";

export function gerarLinkWhatsApp(imovel: Imovel): string {
  const mensagem = `Olá! Tenho interesse no imóvel: ${imovel.titulo} (${imovel.bairro})`;
  return `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
}

export function gerarLinkWhatsAppGeral(): string {
  const mensagem =
    "Olá! Vi o site da Meu Cantinho Imóveis e quero saber mais sobre os imóveis disponíveis.";
  return `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
}
