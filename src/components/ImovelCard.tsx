import Image from "next/image";
import Link from "next/link";
import type { Imovel } from "@/data/imoveis";
import { formatarPreco } from "@/lib/formatacao";

type ImovelCardProps = {
  imovel: Imovel;
};

export function ImovelCard({ imovel }: ImovelCardProps) {
  return (
    <Link
      href={`/imoveis/${imovel.slug}/`}
      className="block overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative h-48 w-full">
        <Image
          src={imovel.fotos[0]}
          alt={imovel.titulo}
          fill
          className="object-cover"
          sizes="(min-width: 768px) 33vw, 100vw"
        />
      </div>
      <div className="space-y-2 p-4">
        <p className="text-lg font-bold text-primary-dark">{formatarPreco(imovel.precoCentavos)}</p>
        <p className="font-semibold">{imovel.titulo}</p>
        <p className="text-sm text-foreground/70">{imovel.bairro}</p>
        <div className="flex gap-3 text-sm text-foreground/70">
          {imovel.tipo !== "terreno" && <span>{imovel.quartos} quartos</span>}
          <span>{imovel.areaM2} m²</span>
        </div>
      </div>
    </Link>
  );
}
