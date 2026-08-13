"use client";

import { useState } from "react";
import Image from "next/image";

type GaleriaFotosProps = {
  fotos: string[];
  titulo: string;
};

export function GaleriaFotos({ fotos, titulo }: GaleriaFotosProps) {
  const [indiceAtivo, setIndiceAtivo] = useState(0);

  return (
    <div>
      <div className="relative h-72 w-full overflow-hidden rounded-2xl sm:h-96">
        <Image
          src={fotos[indiceAtivo]}
          alt={titulo}
          fill
          className="object-cover"
          sizes="(min-width: 768px) 66vw, 100vw"
          priority
        />
      </div>
      {fotos.length > 1 && (
        <div className="mt-3 flex gap-2">
          {fotos.map((foto, indice) => (
            <button
              key={foto}
              type="button"
              onClick={() => setIndiceAtivo(indice)}
              className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 ${
                indice === indiceAtivo ? "border-accent" : "border-transparent"
              }`}
            >
              <Image src={foto} alt="" fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
