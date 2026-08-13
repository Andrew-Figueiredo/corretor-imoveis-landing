type MapaAproximadoProps = {
  bairro: string;
  cidade: string;
};

export function MapaAproximado({ bairro, cidade }: MapaAproximadoProps) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-primary/5 p-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary-dark">
        Localização aproximada
      </p>
      <p className="mt-2 text-lg font-bold">
        {bairro}, {cidade}
      </p>
      <p className="mt-2 text-sm text-foreground/60">
        Endereço exato disponível na visita — fale com o corretor pelo WhatsApp.
      </p>
    </div>
  );
}
