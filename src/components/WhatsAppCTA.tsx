type WhatsAppCTAProps = {
  href: string;
  label: string;
};

export function WhatsAppCTA({ href, label }: WhatsAppCTAProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 font-bold text-white transition hover:bg-accent-dark"
    >
      {label}
    </a>
  );
}
