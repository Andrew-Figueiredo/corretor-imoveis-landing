# Meu Cantinho Imóveis Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir a landing de imobiliária fictícia "Meu Cantinho Imóveis" (Next.js
export estático, PT-BR, sem backend) com catálogo filtrável de imóveis e CTA de WhatsApp,
pronta pra deploy na Vercel.

**Architecture:** App Router com 4 rotas estáticas (`/`, `/imoveis`, `/imoveis/[slug]`,
`/sobre`), dados em array TypeScript estático (`src/data/imoveis.ts`), lógica de
filtro/WhatsApp isolada em funções puras testadas com Vitest, e apenas 2 client components
com estado (`FiltroImoveis`, `GaleriaFotos`) — todo o resto é server component.

**Tech Stack:** Next.js 16 (App Router, `output: 'export'`), TypeScript, Tailwind CSS v4,
Vitest.

**Spec:** `docs/superpowers/specs/2026-08-13-corretor-imoveis-landing-design.md`

## Global Constraints

- Next.js App Router com `output: 'export'`, `trailingSlash: true`,
  `images.unoptimized: true` no `next.config.ts`.
- Rota `/imoveis/[slug]` usa `generateStaticParams` + `export const dynamicParams = false`.
- Idioma: PT-BR apenas — `<html lang="pt-BR">`, sem i18n, sem inglês.
- Sem CMS, sem backend, sem formulário com submit — todo contato é link
  `https://wa.me/<numero>?text=<mensagem>` puro (`<a href>`, sem JS de submit).
- Seed de imóveis: array estático tipado em `src/data/imoveis.ts`, 15–20 registros, preço em
  `precoCentavos: number` (nunca float), pelo menos 1 `destaque: true` por `tipo`.
- Fotos: stock reais baixadas do Unsplash e commitadas no repo — nunca placeholder cinza.
- Testes: Vitest, escopo limitado a invariantes do seed + `filtrarImoveis` +
  `gerarLinkWhatsApp` (conforme spec — sem E2E, sem testes de componente).
- Fora de escopo (não implementar): paginação, seção "imóveis semelhantes", mapa
  interativo real, bilíngue PT/EN, formulário com submit simulado.
- Next.js 16 App Router: `params` de páginas dinâmicas é `Promise` — usar
  `PageProps<"/rota/[slug]">` e `await props.params` (confirmado via build local nesta
  sessão de planejamento).

---

## Task 1: Setup base — config, tema visual e constantes

**Files:**
- Modify: `next.config.ts`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `src/lib/constantes.ts`

**Interfaces:**
- Produces: `NOME_IMOBILIARIA`, `CIDADE`, `NUMERO_WHATSAPP`, `NOME_CORRETOR` (todas
  `string`, exportadas de `src/lib/constantes.ts`) — consumidas por praticamente todas as
  tasks seguintes.
- Produces: tokens Tailwind `bg-primary`, `text-primary-dark`, `bg-accent`,
  `text-accent-dark`, `bg-background`, `text-foreground` (e variantes com opacidade, ex.
  `border-primary/10`) disponíveis em qualquer className do projeto a partir desta task.
- Produces: alias `@` resolvido tanto pelo TypeScript (`tsconfig.json`, já configurado)
  quanto pelo Vitest (`vitest.config.ts`, criado nesta task) — necessário pra todo `import
  from "@/..."` dentro de arquivos `*.test.ts`.

- [ ] **Step 1: Instalar o Vitest**

Rodar:
```bash
npm install -D vitest
```

- [ ] **Step 2: Criar `vitest.config.ts`**

```ts
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Step 3: Adicionar script de teste em `package.json`**

No bloco `"scripts"`, adicionar a chave `"test"`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest run"
  }
}
```

- [ ] **Step 4: Configurar `next.config.ts` pro export estático**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

- [ ] **Step 5: Criar `src/lib/constantes.ts`**

```ts
export const NOME_IMOBILIARIA = "Meu Cantinho Imóveis";
export const CIDADE = "Vale das Acácias";
export const NUMERO_WHATSAPP = "5511999999999";
export const NOME_CORRETOR = "Carlos Andrade";
```

- [ ] **Step 6: Atualizar `src/app/globals.css` com a paleta vibrante (verde + laranja)**

```css
@import "tailwindcss";

:root {
  --background: #fffdf9;
  --foreground: #1f2933;
  --primary: #1fa34c;
  --primary-dark: #167a39;
  --accent: #f97316;
  --accent-dark: #db5a0c;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-dark: var(--primary-dark);
  --color-accent: var(--accent);
  --color-accent-dark: var(--accent-dark);
  --font-sans: var(--font-nunito);
}

body {
  background: var(--color-background);
  color: var(--color-foreground);
}
```

Isso substitui o `@theme inline` e o bloco `@media (prefers-color-scheme: dark)` que vêm no
scaffold padrão — a landing usa tema único (claro), sem modo escuro.

- [ ] **Step 7: Atualizar `src/app/layout.tsx` (fonte arredondada + `lang="pt-BR"`)**

```tsx
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { CIDADE, NOME_IMOBILIARIA } from "@/lib/constantes";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${NOME_IMOBILIARIA} — Seu novo lar em ${CIDADE}`,
  description:
    "Catálogo de imóveis populares e de classe média, com contato direto pelo WhatsApp — sem formulário, sem burocracia.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
```

(Header/Footer entram na Task 4 — por enquanto o `body` só envolve `{children}`.)

- [ ] **Step 8: Verificar que o projeto builda**

Rodar:
```bash
npm run build
```
Esperado: build conclui sem erro (a página ainda é o boilerplate padrão do
`create-next-app`, isso é esperado nesta task — será substituída na Task 6). Verificar que
a pasta `out/` foi gerada.

- [ ] **Step 9: Commit**

```bash
git add next.config.ts src/app/globals.css src/app/layout.tsx package.json package-lock.json vitest.config.ts src/lib/constantes.ts
git commit -m "chore: setup export estatico, tema visual e vitest"
```

---

## Task 2: Modelo de dados e fotos dos imóveis

**Files:**
- Create: `public/fotos/imoveis/casa-01-exterior-noite.jpg` … `casa-07-banheiro.jpg` (7 fotos)
- Create: `public/fotos/imoveis/apto-01-cozinha-sala.jpg` … `apto-07-sala-estilo.jpg` (7 fotos)
- Create: `public/fotos/imoveis/terreno-01-campo.jpg` … `terreno-03-flores.jpg` (3 fotos)
- Create: `public/fotos/sobre/corretor.jpg`
- Create: `src/data/imoveis.ts`
- Test: `src/data/imoveis.test.ts`

**Interfaces:**
- Consumes: nenhuma (base de dados do projeto).
- Produces: `type TipoImovel = "casa" | "apartamento" | "terreno"`, `type Imovel` (todos os
  campos abaixo) e `const imoveis: Imovel[]`, todos exportados de `src/data/imoveis.ts` —
  consumidos por praticamente todas as tasks seguintes.

```ts
type Imovel = {
  slug: string;
  titulo: string;
  tipo: TipoImovel;
  precoCentavos: number;
  quartos: number;
  bairro: string;
  areaM2: number;
  banheiros: number;
  vagas: number;
  caracteristicas: string[];
  descricao: string;
  fotos: string[];
  destaque: boolean;
};
```

- [ ] **Step 1: Baixar as fotos de estoque (Unsplash, uso livre)**

Todas as URLs abaixo foram verificadas (HTTP 200 + conferidas visualmente) durante o
planejamento. Rodar da raiz do projeto:

```bash
mkdir -p public/fotos/imoveis public/fotos/sobre

curl -sL "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&h=800&fit=crop&q=80" -o public/fotos/imoveis/casa-01-exterior-noite.jpg
curl -sL "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=1200&h=800&fit=crop&q=80" -o public/fotos/imoveis/casa-02-varanda.jpg
curl -sL "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&h=800&fit=crop&q=80" -o public/fotos/imoveis/casa-03-exterior-dia.jpg
curl -sL "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1200&h=800&fit=crop&q=80" -o public/fotos/imoveis/casa-04-rua.jpg
curl -sL "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=1200&h=800&fit=crop&q=80" -o public/fotos/imoveis/casa-05-cozinha.jpg
curl -sL "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=1200&h=800&fit=crop&q=80" -o public/fotos/imoveis/casa-06-sala.jpg
curl -sL "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&h=800&fit=crop&q=80" -o public/fotos/imoveis/casa-07-banheiro.jpg

curl -sL "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop&q=80" -o public/fotos/imoveis/apto-01-cozinha-sala.jpg
curl -sL "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop&q=80" -o public/fotos/imoveis/apto-02-sala.jpg
curl -sL "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&h=800&fit=crop&q=80" -o public/fotos/imoveis/apto-03-sala-sofa.jpg
curl -sL "https://images.unsplash.com/photo-1571508601891-ca5e7a713859?w=1200&h=800&fit=crop&q=80" -o public/fotos/imoveis/apto-04-quarto.jpg
curl -sL "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&h=800&fit=crop&q=80" -o public/fotos/imoveis/apto-05-sala-moderna.jpg
curl -sL "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1200&h=800&fit=crop&q=80" -o public/fotos/imoveis/apto-06-banheiro.jpg
curl -sL "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&h=800&fit=crop&q=80" -o public/fotos/imoveis/apto-07-sala-estilo.jpg

curl -sL "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=800&fit=crop&q=80" -o public/fotos/imoveis/terreno-01-campo.jpg
curl -sL "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1200&h=800&fit=crop&q=80" -o public/fotos/imoveis/terreno-02-montanha.jpg
curl -sL "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=1200&h=800&fit=crop&q=80" -o public/fotos/imoveis/terreno-03-flores.jpg

curl -sL "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=1000&fit=crop&q=80" -o public/fotos/sobre/corretor.jpg
```

- [ ] **Step 2: Verificar que todos os 18 arquivos baixaram com conteúdo**

```bash
find public/fotos -type f -name "*.jpg" | wc -l
```
Esperado: `18`. Se algum arquivo tiver poucos bytes (download falhou), repetir o `curl`
correspondente.

- [ ] **Step 3: Escrever o teste de invariantes do seed (falhando)**

Criar `src/data/imoveis.test.ts`:

```ts
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
```

- [ ] **Step 4: Rodar o teste e confirmar que falha**

```bash
npm test -- imoveis.test.ts
```
Esperado: FAIL — `src/data/imoveis.ts` ainda não existe (`Cannot find module './imoveis'`).

- [ ] **Step 5: Criar `src/data/imoveis.ts` com os 18 registros**

```ts
export type TipoImovel = "casa" | "apartamento" | "terreno";

export type Imovel = {
  slug: string;
  titulo: string;
  tipo: TipoImovel;
  precoCentavos: number;
  quartos: number;
  bairro: string;
  areaM2: number;
  banheiros: number;
  vagas: number;
  caracteristicas: string[];
  descricao: string;
  fotos: string[];
  destaque: boolean;
};

const F = "/fotos/imoveis";

export const imoveis: Imovel[] = [
  {
    slug: "casa-jardim-primavera-1",
    titulo: "Casa com quintal no Jardim Primavera",
    tipo: "casa",
    precoCentavos: 32000000,
    quartos: 3,
    bairro: "Jardim Primavera",
    areaM2: 120,
    banheiros: 2,
    vagas: 2,
    caracteristicas: ["quintal", "churrasqueira", "garagem coberta", "próximo a escola"],
    descricao:
      "Casa térrea bem cuidada, com quintal grande para as crianças brincarem e churrasqueira pronta pra receber a família nos fins de semana.",
    fotos: [`${F}/casa-01-exterior-noite.jpg`, `${F}/casa-05-cozinha.jpg`, `${F}/casa-06-sala.jpg`],
    destaque: true,
  },
  {
    slug: "casa-vila-esperanca-1",
    titulo: "Casa aconchegante na Vila Nova Esperança",
    tipo: "casa",
    precoCentavos: 21000000,
    quartos: 2,
    bairro: "Vila Nova Esperança",
    areaM2: 85,
    banheiros: 1,
    vagas: 1,
    caracteristicas: ["varanda", "portão eletrônico", "aceita financiamento"],
    descricao:
      "Casa compacta e prática, ideal pra quem tá começando: varanda pra tomar um café de manhã e portão eletrônico pra mais segurança.",
    fotos: [`${F}/casa-02-varanda.jpg`, `${F}/casa-05-cozinha.jpg`, `${F}/casa-07-banheiro.jpg`],
    destaque: false,
  },
  {
    slug: "casa-bela-vista-1",
    titulo: "Casa espaçosa no Setor Bela Vista",
    tipo: "casa",
    precoCentavos: 38000000,
    quartos: 3,
    bairro: "Setor Bela Vista",
    areaM2: 140,
    banheiros: 2,
    vagas: 2,
    caracteristicas: ["área de serviço", "garagem coberta", "sol da manhã", "próximo ao comércio"],
    descricao:
      "Casa ampla com bastante luz natural, área de serviço separada e a dois passos do comércio do bairro.",
    fotos: [`${F}/casa-03-exterior-dia.jpg`, `${F}/casa-06-sala.jpg`, `${F}/casa-07-banheiro.jpg`],
    destaque: false,
  },
  {
    slug: "casa-recanto-sol-1",
    titulo: "Casa grande no Recanto do Sol",
    tipo: "casa",
    precoCentavos: 45000000,
    quartos: 4,
    bairro: "Recanto do Sol",
    areaM2: 180,
    banheiros: 3,
    vagas: 3,
    caracteristicas: ["quintal", "churrasqueira", "garagem coberta", "reformada"],
    descricao:
      "Casa recém-reformada, com espaço de sobra pra família grande, quintal amplo e churrasqueira nova.",
    fotos: [`${F}/casa-04-rua.jpg`, `${F}/casa-05-cozinha.jpg`, `${F}/casa-06-sala.jpg`],
    destaque: false,
  },
  {
    slug: "casa-vila-industrial-1",
    titulo: "Casa simples na Vila Industrial",
    tipo: "casa",
    precoCentavos: 16500000,
    quartos: 2,
    bairro: "Vila Industrial",
    areaM2: 70,
    banheiros: 1,
    vagas: 1,
    caracteristicas: ["aceita financiamento", "próximo ao comércio"],
    descricao:
      "Opção econômica pra sair do aluguel: casa simples, bem localizada e com facilidade de financiamento.",
    fotos: [`${F}/casa-02-varanda.jpg`, `${F}/casa-06-sala.jpg`, `${F}/casa-07-banheiro.jpg`],
    destaque: false,
  },
  {
    slug: "casa-parque-palmeiras-1",
    titulo: "Casa com varanda no Parque das Palmeiras",
    tipo: "casa",
    precoCentavos: 29500000,
    quartos: 3,
    bairro: "Parque das Palmeiras",
    areaM2: 110,
    banheiros: 2,
    vagas: 2,
    caracteristicas: ["varanda", "quintal", "garagem coberta", "próximo a escola"],
    descricao:
      "Casa bem distribuída, com varanda de frente pra rua e quintal nos fundos — perfeita pra quem tem filhos pequenos.",
    fotos: [`${F}/casa-01-exterior-noite.jpg`, `${F}/casa-03-exterior-dia.jpg`, `${F}/casa-05-cozinha.jpg`],
    destaque: true,
  },
  {
    slug: "casa-centro-1",
    titulo: "Casa central e prática no Centro",
    tipo: "casa",
    precoCentavos: 23000000,
    quartos: 2,
    bairro: "Centro",
    areaM2: 90,
    banheiros: 1,
    vagas: 1,
    caracteristicas: ["próximo ao comércio", "portão eletrônico"],
    descricao:
      "Casa bem localizada no Centro, pertinho de tudo: mercado, farmácia e ponto de ônibus na porta.",
    fotos: [`${F}/casa-04-rua.jpg`, `${F}/casa-06-sala.jpg`, `${F}/casa-07-banheiro.jpg`],
    destaque: false,
  },
  {
    slug: "casa-jardim-primavera-2",
    titulo: "Casa reformada no Jardim Primavera",
    tipo: "casa",
    precoCentavos: 34000000,
    quartos: 3,
    bairro: "Jardim Primavera",
    areaM2: 130,
    banheiros: 2,
    vagas: 2,
    caracteristicas: ["reformada", "quintal", "garagem coberta"],
    descricao:
      "Casa recém-reformada em rua tranquila do Jardim Primavera, pronta pra morar sem gastar nada a mais.",
    fotos: [`${F}/casa-03-exterior-dia.jpg`, `${F}/casa-05-cozinha.jpg`, `${F}/casa-06-sala.jpg`],
    destaque: false,
  },
  {
    slug: "apartamento-centro-1",
    titulo: "Apartamento compacto no Centro",
    tipo: "apartamento",
    precoCentavos: 19000000,
    quartos: 2,
    bairro: "Centro",
    areaM2: 55,
    banheiros: 1,
    vagas: 1,
    caracteristicas: ["elevador", "portaria 24h", "próximo ao comércio"],
    descricao:
      "Apartamento prático no Centro, com portaria 24h e tudo perto: mercado, farmácia e transporte público.",
    fotos: [`${F}/apto-01-cozinha-sala.jpg`, `${F}/apto-04-quarto.jpg`, `${F}/apto-06-banheiro.jpg`],
    destaque: true,
  },
  {
    slug: "apartamento-bela-vista-1",
    titulo: "Apartamento com varanda no Setor Bela Vista",
    tipo: "apartamento",
    precoCentavos: 22000000,
    quartos: 2,
    bairro: "Setor Bela Vista",
    areaM2: 62,
    banheiros: 1,
    vagas: 1,
    caracteristicas: ["varanda", "elevador", "vaga de garagem"],
    descricao:
      "Apartamento claro e arejado, com varanda e vaga de garagem — ótimo custo-benefício no Bela Vista.",
    fotos: [`${F}/apto-02-sala.jpg`, `${F}/apto-04-quarto.jpg`, `${F}/apto-06-banheiro.jpg`],
    destaque: false,
  },
  {
    slug: "apartamento-vila-esperanca-1",
    titulo: "Apartamento de 1 quarto na Vila Nova Esperança",
    tipo: "apartamento",
    precoCentavos: 13500000,
    quartos: 1,
    bairro: "Vila Nova Esperança",
    areaM2: 40,
    banheiros: 1,
    vagas: 0,
    caracteristicas: ["aceita financiamento", "próximo ao comércio"],
    descricao:
      "Apartamento compacto, ideal pra quem mora sozinho ou tá começando a vida — preço acessível e bem localizado.",
    fotos: [`${F}/apto-03-sala-sofa.jpg`, `${F}/apto-04-quarto.jpg`, `${F}/apto-06-banheiro.jpg`],
    destaque: false,
  },
  {
    slug: "apartamento-parque-palmeiras-1",
    titulo: "Apartamento amplo no Parque das Palmeiras",
    tipo: "apartamento",
    precoCentavos: 27500000,
    quartos: 3,
    bairro: "Parque das Palmeiras",
    areaM2: 78,
    banheiros: 2,
    vagas: 1,
    caracteristicas: ["área de lazer", "vaga de garagem", "elevador"],
    descricao:
      "Apartamento de 3 quartos com área de lazer completa no condomínio — espaço de sobra pra família.",
    fotos: [`${F}/apto-05-sala-moderna.jpg`, `${F}/apto-04-quarto.jpg`, `${F}/apto-07-sala-estilo.jpg`],
    destaque: false,
  },
  {
    slug: "apartamento-centro-2",
    titulo: "Apartamento reformado no Centro",
    tipo: "apartamento",
    precoCentavos: 20500000,
    quartos: 2,
    bairro: "Centro",
    areaM2: 58,
    banheiros: 1,
    vagas: 1,
    caracteristicas: ["reformado", "portaria 24h", "elevador"],
    descricao: "Apartamento recém-reformado, pronto pra morar, no coração do Centro.",
    fotos: [`${F}/apto-01-cozinha-sala.jpg`, `${F}/apto-02-sala.jpg`, `${F}/apto-06-banheiro.jpg`],
    destaque: false,
  },
  {
    slug: "apartamento-jardim-primavera-1",
    titulo: "Apartamento moderno no Jardim Primavera",
    tipo: "apartamento",
    precoCentavos: 23000000,
    quartos: 2,
    bairro: "Jardim Primavera",
    areaM2: 65,
    banheiros: 1,
    vagas: 1,
    caracteristicas: ["sacada gourmet", "elevador", "aceita pet"],
    descricao:
      "Apartamento moderno com sacada gourmet, em condomínio que aceita pet — pertinho de tudo no Jardim Primavera.",
    fotos: [`${F}/apto-05-sala-moderna.jpg`, `${F}/apto-07-sala-estilo.jpg`, `${F}/apto-04-quarto.jpg`],
    destaque: false,
  },
  {
    slug: "terreno-chacara-ipes-1",
    titulo: "Terreno plano na Chácara dos Ipês",
    tipo: "terreno",
    precoCentavos: 9500000,
    quartos: 0,
    bairro: "Chácara dos Ipês",
    areaM2: 500,
    banheiros: 0,
    vagas: 0,
    caracteristicas: ["documentação regularizada", "topografia plana", "água e luz disponíveis"],
    descricao: "Terreno plano e documentado, pronto pra construir, na tranquila Chácara dos Ipês.",
    fotos: [`${F}/terreno-01-campo.jpg`, `${F}/terreno-03-flores.jpg`],
    destaque: true,
  },
  {
    slug: "terreno-recanto-sol-1",
    titulo: "Terreno no Recanto do Sol",
    tipo: "terreno",
    precoCentavos: 7800000,
    quartos: 0,
    bairro: "Recanto do Sol",
    areaM2: 360,
    banheiros: 0,
    vagas: 0,
    caracteristicas: ["aceita financiamento", "murado"],
    descricao: "Terreno murado, com ótimo preço, em bairro que só cresce.",
    fotos: [`${F}/terreno-02-montanha.jpg`, `${F}/terreno-01-campo.jpg`],
    destaque: false,
  },
  {
    slug: "terreno-chacara-ipes-2",
    titulo: "Terreno amplo na Chácara dos Ipês",
    tipo: "terreno",
    precoCentavos: 13000000,
    quartos: 0,
    bairro: "Chácara dos Ipês",
    areaM2: 700,
    banheiros: 0,
    vagas: 0,
    caracteristicas: ["documentação regularizada", "topografia plana", "próximo à rodovia"],
    descricao: "Terreno amplo, ideal pra quem quer construir a casa dos sonhos com espaço de sobra.",
    fotos: [`${F}/terreno-03-flores.jpg`, `${F}/terreno-02-montanha.jpg`],
    destaque: false,
  },
  {
    slug: "terreno-vila-industrial-1",
    titulo: "Terreno econômico na Vila Industrial",
    tipo: "terreno",
    precoCentavos: 6000000,
    quartos: 0,
    bairro: "Vila Industrial",
    areaM2: 300,
    banheiros: 0,
    vagas: 0,
    caracteristicas: ["aceita financiamento", "água e luz disponíveis"],
    descricao: "Terreno com o menor preço do catálogo — ótima oportunidade pra investir ou começar a construir.",
    fotos: [`${F}/terreno-01-campo.jpg`, `${F}/terreno-02-montanha.jpg`],
    destaque: false,
  },
];
```

- [ ] **Step 6: Rodar o teste e confirmar que passa**

```bash
npm test -- imoveis.test.ts
```
Esperado: PASS — 4 testes passando (15–20 registros, slugs únicos, tipos válidos, destaque
por tipo).

- [ ] **Step 7: Commit**

```bash
git add public/fotos src/data/imoveis.ts src/data/imoveis.test.ts
git commit -m "feat: adiciona seed de imoveis e fotos de estoque"
```

---

## Task 3: Funções puras — filtro de imóveis e link do WhatsApp

**Files:**
- Create: `src/lib/filtros.ts`
- Test: `src/lib/filtros.test.ts`
- Create: `src/lib/whatsapp.ts`
- Test: `src/lib/whatsapp.test.ts`

**Interfaces:**
- Consumes: `type Imovel`, `type TipoImovel` de `@/data/imoveis` (Task 2); `NUMERO_WHATSAPP`
  de `@/lib/constantes` (Task 1).
- Produces: `type FiltroCriterios`, `function filtrarImoveis(imoveis: Imovel[], criterios:
  FiltroCriterios): Imovel[]` de `src/lib/filtros.ts` — consumido pelo `FiltroImoveis`
  (Task 7).
- Produces: `function gerarLinkWhatsApp(imovel: Imovel): string` e `function
  gerarLinkWhatsAppGeral(): string` de `src/lib/whatsapp.ts` — consumidos por `Hero`,
  `Footer` e páginas de detalhe (Tasks 4, 5, 8, 9).

- [ ] **Step 1: Escrever o teste de `filtrarImoveis` (falhando)**

Criar `src/lib/filtros.test.ts`:

```ts
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
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

```bash
npm test -- filtros.test.ts
```
Esperado: FAIL — `Cannot find module './filtros'`.

- [ ] **Step 3: Implementar `src/lib/filtros.ts`**

```ts
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
```

- [ ] **Step 4: Rodar o teste e confirmar que passa**

```bash
npm test -- filtros.test.ts
```
Esperado: PASS — 7 testes passando.

- [ ] **Step 5: Escrever o teste de `gerarLinkWhatsApp` (falhando)**

Criar `src/lib/whatsapp.test.ts`:

```ts
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
```

- [ ] **Step 6: Rodar o teste e confirmar que falha**

```bash
npm test -- whatsapp.test.ts
```
Esperado: FAIL — `Cannot find module './whatsapp'`.

- [ ] **Step 7: Implementar `src/lib/whatsapp.ts`**

```ts
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
```

- [ ] **Step 8: Rodar o teste e confirmar que passa**

```bash
npm test -- whatsapp.test.ts
```
Esperado: PASS — 3 testes passando.

- [ ] **Step 9: Rodar a suíte completa**

```bash
npm test
```
Esperado: PASS — todos os testes das Tasks 2 e 3 passando (14 testes no total).

- [ ] **Step 10: Commit**

```bash
git add src/lib/filtros.ts src/lib/filtros.test.ts src/lib/whatsapp.ts src/lib/whatsapp.test.ts
git commit -m "feat: adiciona filtrarImoveis e gerarLinkWhatsApp"
```

---

## Task 4: Navegação global — Header e Footer

**Files:**
- Create: `src/components/Header.tsx`
- Create: `src/components/Footer.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `NOME_IMOBILIARIA`, `CIDADE` de `@/lib/constantes` (Task 1);
  `gerarLinkWhatsAppGeral` de `@/lib/whatsapp` (Task 3).
- Produces: `<Header />`, `<Footer />` (sem props) — usados em `src/app/layout.tsx` a partir
  desta task e em nenhum outro lugar.

- [ ] **Step 1: Criar `src/components/Header.tsx`**

```tsx
import Link from "next/link";
import { NOME_IMOBILIARIA } from "@/lib/constantes";

const links = [
  { href: "/", label: "Início" },
  { href: "/imoveis/", label: "Imóveis" },
  { href: "/sobre/", label: "Sobre" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-primary/10 bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-extrabold text-primary-dark">
          {NOME_IMOBILIARIA}
        </Link>
        <nav className="flex gap-6 text-sm font-semibold">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-primary-dark">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Criar `src/components/Footer.tsx`**

```tsx
import { CIDADE, NOME_IMOBILIARIA } from "@/lib/constantes";
import { gerarLinkWhatsAppGeral } from "@/lib/whatsapp";

export function Footer() {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="border-t border-primary/10 bg-primary-dark text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm sm:px-6">
        <p className="font-bold">{NOME_IMOBILIARIA}</p>
        <p className="mt-1 text-white/80">Imóveis em {CIDADE}</p>
        <a
          href={gerarLinkWhatsAppGeral()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block font-semibold text-accent hover:text-accent-dark"
        >
          Fale conosco no WhatsApp
        </a>
        <p className="mt-6 text-xs text-white/60">
          © {anoAtual} {NOME_IMOBILIARIA}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Atualizar `src/app/layout.tsx` pra usar Header e Footer**

```tsx
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CIDADE, NOME_IMOBILIARIA } from "@/lib/constantes";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${NOME_IMOBILIARIA} — Seu novo lar em ${CIDADE}`,
  description:
    "Catálogo de imóveis populares e de classe média, com contato direto pelo WhatsApp — sem formulário, sem burocracia.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verificar visualmente**

```bash
npm run dev
```
Abrir `http://localhost:3000` e conferir: header fixo com nome da imobiliária e 3 links de
navegação, footer verde com link do WhatsApp funcionando (abre `wa.me` numa nova aba).
Parar o servidor depois (Ctrl+C).

- [ ] **Step 5: Rodar build e lint**

```bash
npm run build
npm run lint
```
Esperado: ambos sem erro.

- [ ] **Step 6: Commit**

```bash
git add src/components/Header.tsx src/components/Footer.tsx src/app/layout.tsx
git commit -m "feat: adiciona header e footer com navegacao global"
```

---

## Task 5: Componentes de exibição de imóvel

**Files:**
- Create: `src/lib/formatacao.ts`
- Create: `src/components/ImovelCard.tsx`
- Create: `src/components/WhatsAppCTA.tsx`
- Create: `src/components/FichaTecnica.tsx`
- Create: `src/components/MapaAproximado.tsx`
- Create: `src/components/GaleriaFotos.tsx`
- Create: `src/components/Hero.tsx`

**Interfaces:**
- Consumes: `type Imovel` de `@/data/imoveis` (Task 2); `gerarLinkWhatsAppGeral` de
  `@/lib/whatsapp` (Task 3); `CIDADE` de `@/lib/constantes` (Task 1).
- Produces: `formatarPreco(precoCentavos: number): string`.
- Produces: `<ImovelCard imovel={Imovel} />`, `<WhatsAppCTA href={string} label={string}
  />`, `<FichaTecnica imovel={Imovel} />`, `<MapaAproximado bairro={string} cidade={string}
  />`, `<GaleriaFotos fotos={string[]} titulo={string} />` (client), `<Hero />` (sem props)
  — usados pelas páginas nas Tasks 6, 7 e 8.

- [ ] **Step 1: Criar `src/lib/formatacao.ts`**

```ts
export function formatarPreco(precoCentavos: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(precoCentavos / 100);
}
```

- [ ] **Step 2: Criar `src/components/WhatsAppCTA.tsx`**

```tsx
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
```

- [ ] **Step 3: Criar `src/components/ImovelCard.tsx`**

```tsx
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
```

- [ ] **Step 4: Criar `src/components/FichaTecnica.tsx`**

```tsx
import type { Imovel } from "@/data/imoveis";
import { formatarPreco } from "@/lib/formatacao";

const ROTULO_TIPO: Record<Imovel["tipo"], string> = {
  casa: "Casa",
  apartamento: "Apartamento",
  terreno: "Terreno",
};

type FichaTecnicaProps = {
  imovel: Imovel;
};

export function FichaTecnica({ imovel }: FichaTecnicaProps) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-white p-6">
      <p className="text-2xl font-extrabold text-primary-dark">
        {formatarPreco(imovel.precoCentavos)}
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-foreground/60">Tipo</dt>
          <dd className="font-semibold">{ROTULO_TIPO[imovel.tipo]}</dd>
        </div>
        <div>
          <dt className="text-foreground/60">Área</dt>
          <dd className="font-semibold">{imovel.areaM2} m²</dd>
        </div>
        {imovel.tipo !== "terreno" && (
          <>
            <div>
              <dt className="text-foreground/60">Quartos</dt>
              <dd className="font-semibold">{imovel.quartos}</dd>
            </div>
            <div>
              <dt className="text-foreground/60">Banheiros</dt>
              <dd className="font-semibold">{imovel.banheiros}</dd>
            </div>
            <div>
              <dt className="text-foreground/60">Vagas</dt>
              <dd className="font-semibold">{imovel.vagas}</dd>
            </div>
          </>
        )}
      </dl>
      {imovel.caracteristicas.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {imovel.caracteristicas.map((caracteristica) => (
            <span
              key={caracteristica}
              className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-dark"
            >
              {caracteristica}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Criar `src/components/MapaAproximado.tsx`**

```tsx
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
```

- [ ] **Step 6: Criar `src/components/GaleriaFotos.tsx`**

```tsx
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
```

- [ ] **Step 7: Criar `src/components/Hero.tsx`**

```tsx
import { CIDADE } from "@/lib/constantes";
import { gerarLinkWhatsAppGeral } from "@/lib/whatsapp";
import { WhatsAppCTA } from "./WhatsAppCTA";

export function Hero() {
  return (
    <section className="bg-primary/10 px-4 py-16 text-center sm:px-6">
      <h1 className="mx-auto max-w-2xl text-4xl font-extrabold text-primary-dark sm:text-5xl">
        Encontre seu novo lar em {CIDADE}
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-foreground/70">
        Catálogo de casas, apartamentos e terrenos com preços justos. Fale direto com o
        corretor pelo WhatsApp, sem formulário e sem burocracia.
      </p>
      <div className="mt-8">
        <WhatsAppCTA href={gerarLinkWhatsAppGeral()} label="Falar no WhatsApp" />
      </div>
    </section>
  );
}
```

- [ ] **Step 8: Rodar build e lint**

```bash
npm run build
npm run lint
npm test
```
Esperado: build e lint sem erro. Nenhum desses componentes é importado por nenhuma página
ainda, então o build só confirma que compilam — a integração visual acontece nas Tasks 6–8.

- [ ] **Step 9: Commit**

```bash
git add src/lib/formatacao.ts src/components/ImovelCard.tsx src/components/WhatsAppCTA.tsx src/components/FichaTecnica.tsx src/components/MapaAproximado.tsx src/components/GaleriaFotos.tsx src/components/Hero.tsx
git commit -m "feat: adiciona componentes de exibicao de imovel"
```

---

## Task 6: Página inicial (`/`)

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `imoveis` de `@/data/imoveis` (Task 2); `Hero`, `ImovelCard`, `WhatsAppCTA` de
  `@/components/*` (Task 5); `gerarLinkWhatsAppGeral` de `@/lib/whatsapp` (Task 3); `CIDADE`
  de `@/lib/constantes` (Task 1).

- [ ] **Step 1: Substituir `src/app/page.tsx` pelo conteúdo da home**

```tsx
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ImovelCard } from "@/components/ImovelCard";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { imoveis } from "@/data/imoveis";
import { CIDADE } from "@/lib/constantes";
import { gerarLinkWhatsAppGeral } from "@/lib/whatsapp";

const DIFERENCIAIS = [
  {
    titulo: "Atendimento direto no WhatsApp",
    descricao: "Sem formulário, sem espera: você fala direto com o corretor.",
  },
  {
    titulo: "Imóveis verificados",
    descricao: "Cada imóvel do catálogo é visitado e conferido antes de anunciar.",
  },
  {
    titulo: "Sem burocracia",
    descricao: "Ajudamos você em cada etapa, da visita à documentação.",
  },
  {
    titulo: "Corretor local",
    descricao: `Quem conhece ${CIDADE} de verdade, bairro por bairro.`,
  },
];

export default function Home() {
  const destaques = imoveis.filter((imovel) => imovel.destaque);

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-extrabold">Imóveis em destaque</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {destaques.map((imovel) => (
            <ImovelCard key={imovel.slug} imovel={imovel} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/imoveis/" className="font-bold text-primary-dark hover:underline">
            Ver todos os imóveis →
          </Link>
        </div>
      </section>

      <section className="bg-primary/5 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-extrabold">Por que a Meu Cantinho Imóveis</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {DIFERENCIAIS.map((diferencial) => (
              <div key={diferencial.titulo} className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="font-bold text-primary-dark">{diferencial.titulo}</p>
                <p className="mt-2 text-sm text-foreground/70">{diferencial.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 text-center sm:px-6">
        <h2 className="text-2xl font-extrabold">Pronto pra encontrar seu imóvel?</h2>
        <p className="mx-auto mt-2 max-w-xl text-foreground/70">
          Fale agora com o corretor pelo WhatsApp e receba atendimento personalizado.
        </p>
        <div className="mt-6">
          <WhatsAppCTA href={gerarLinkWhatsAppGeral()} label="Falar no WhatsApp" />
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Verificar visualmente**

```bash
npm run dev
```
Abrir `http://localhost:3000` e conferir: hero com CTA WhatsApp, grid de 4 imóveis em
destaque (2 casas, 1 apartamento, 1 terreno) cada um linkando pra `/imoveis/<slug>/`,
seção de diferenciais e CTA final. Parar o servidor.

- [ ] **Step 3: Rodar build**

```bash
npm run build
```
Esperado: build sem erro, rota `/` gerada como estática.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: implementa pagina inicial"
```

---

## Task 7: Listagem de imóveis (`/imoveis`) com filtro

**Files:**
- Create: `src/components/FiltroImoveis.tsx`
- Create: `src/app/imoveis/page.tsx`

**Interfaces:**
- Consumes: `type Imovel`, `type TipoImovel`, `imoveis` de `@/data/imoveis` (Task 2);
  `filtrarImoveis` de `@/lib/filtros` (Task 3); `ImovelCard` de `@/components/ImovelCard`
  (Task 5).
- Produces: `<FiltroImoveis imoveis={Imovel[]} />` (client) — usado só nesta rota.

- [ ] **Step 1: Criar `src/components/FiltroImoveis.tsx`**

```tsx
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
```

- [ ] **Step 2: Criar `src/app/imoveis/page.tsx`**

```tsx
import { FiltroImoveis } from "@/components/FiltroImoveis";
import { imoveis } from "@/data/imoveis";

export const metadata = {
  title: "Imóveis disponíveis — Meu Cantinho Imóveis",
};

export default function ImoveisPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold">Imóveis disponíveis</h1>
      <p className="mt-2 text-foreground/70">Use os filtros abaixo pra encontrar o imóvel ideal.</p>
      <div className="mt-8">
        <FiltroImoveis imoveis={imoveis} />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verificar visualmente**

```bash
npm run dev
```
Abrir `http://localhost:3000/imoveis/` e conferir: 18 imóveis listados, filtro por tipo
reduz a lista corretamente, filtro por bairro popula com os bairros reais do seed,
combinação de filtros funciona (ex.: tipo "casa" + preço máximo baixo retorna só as casas
mais baratas). Parar o servidor.

- [ ] **Step 4: Rodar build**

```bash
npm run build
```
Esperado: build sem erro, rota `/imoveis` gerada como estática (o filtro roda no cliente
sobre o array já embutido no HTML).

- [ ] **Step 5: Commit**

```bash
git add src/components/FiltroImoveis.tsx src/app/imoveis/page.tsx
git commit -m "feat: implementa listagem de imoveis com filtro"
```

---

## Task 8: Detalhe do imóvel (`/imoveis/[slug]`)

**Files:**
- Create: `src/app/imoveis/[slug]/page.tsx`

**Interfaces:**
- Consumes: `imoveis` de `@/data/imoveis` (Task 2); `GaleriaFotos`, `FichaTecnica`,
  `MapaAproximado`, `WhatsAppCTA` de `@/components/*` (Task 5); `gerarLinkWhatsApp` de
  `@/lib/whatsapp` (Task 3); `CIDADE` de `@/lib/constantes` (Task 1).

- [ ] **Step 1: Criar `src/app/imoveis/[slug]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { FichaTecnica } from "@/components/FichaTecnica";
import { GaleriaFotos } from "@/components/GaleriaFotos";
import { MapaAproximado } from "@/components/MapaAproximado";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { imoveis } from "@/data/imoveis";
import { CIDADE } from "@/lib/constantes";
import { gerarLinkWhatsApp } from "@/lib/whatsapp";

export const dynamicParams = false;

export function generateStaticParams() {
  return imoveis.map((imovel) => ({ slug: imovel.slug }));
}

export async function generateMetadata(props: PageProps<"/imoveis/[slug]">) {
  const { slug } = await props.params;
  const imovel = imoveis.find((item) => item.slug === slug);
  return {
    title: imovel ? `${imovel.titulo} — Meu Cantinho Imóveis` : "Imóvel não encontrado",
  };
}

export default async function ImovelDetalhePage(props: PageProps<"/imoveis/[slug]">) {
  const { slug } = await props.params;
  const imovel = imoveis.find((item) => item.slug === slug);

  if (!imovel) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold">{imovel.titulo}</h1>
      <p className="mt-1 text-foreground/70">{imovel.bairro}</p>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <GaleriaFotos fotos={imovel.fotos} titulo={imovel.titulo} />
          <p className="mt-6 text-foreground/80">{imovel.descricao}</p>
          <div className="mt-6">
            <MapaAproximado bairro={imovel.bairro} cidade={CIDADE} />
          </div>
        </div>
        <div className="space-y-6">
          <FichaTecnica imovel={imovel} />
          <WhatsAppCTA href={gerarLinkWhatsApp(imovel)} label="Agendar visita no WhatsApp" />
        </div>
      </div>
    </div>
  );
}
```

Nota: `PageProps<"/imoveis/[slug]">` é um tipo global gerado pelo Next.js a partir da rota
(`.next/types/routes.d.ts`) — só existe depois de `npm run dev` ou `npm run build` terem
rodado ao menos uma vez com o arquivo já no lugar. Se o editor reclamar do tipo antes
disso, rodar `npm run build` resolve.

- [ ] **Step 2: Rodar build**

```bash
npm run build
```
Esperado: build sem erro, 18 rotas estáticas geradas sob `/imoveis/<slug>/` (uma por
imóvel do seed).

- [ ] **Step 3: Verificar visualmente**

```bash
npm run dev
```
Abrir `http://localhost:3000/imoveis/casa-jardim-primavera-1/` e conferir: galeria com 3
fotos clicáveis trocando a foto principal, ficha técnica com preço/tipo/área/quartos
formatados, card "Localização aproximada" com bairro e cidade, botão "Agendar visita no
WhatsApp" abrindo `wa.me` com a mensagem pré-preenchida contendo o título e o bairro do
imóvel. Repetir rapidamente pra um imóvel do tipo `terreno` (ex.
`/imoveis/terreno-chacara-ipes-1/`) e confirmar que quartos/banheiros/vagas não aparecem na
ficha técnica. Parar o servidor.

- [ ] **Step 4: Commit**

```bash
git add "src/app/imoveis/[slug]/page.tsx"
git commit -m "feat: implementa pagina de detalhe do imovel"
```

---

## Task 9: Página Sobre (`/sobre`)

**Files:**
- Create: `src/app/sobre/page.tsx`

**Interfaces:**
- Consumes: `CIDADE`, `NOME_CORRETOR`, `NOME_IMOBILIARIA` de `@/lib/constantes` (Task 1);
  `gerarLinkWhatsAppGeral` de `@/lib/whatsapp` (Task 3); `WhatsAppCTA` de
  `@/components/WhatsAppCTA` (Task 5); foto `public/fotos/sobre/corretor.jpg` (Task 2).

- [ ] **Step 1: Criar `src/app/sobre/page.tsx`**

```tsx
import Image from "next/image";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { CIDADE, NOME_CORRETOR, NOME_IMOBILIARIA } from "@/lib/constantes";
import { gerarLinkWhatsAppGeral } from "@/lib/whatsapp";

export const metadata = {
  title: `Sobre — ${NOME_IMOBILIARIA}`,
};

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold">Sobre a {NOME_IMOBILIARIA}</h1>

      <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-full">
          <Image
            src="/fotos/sobre/corretor.jpg"
            alt={NOME_CORRETOR}
            fill
            className="object-cover"
            sizes="160px"
          />
        </div>
        <div>
          <p className="text-xl font-bold">{NOME_CORRETOR}</p>
          <p className="mt-2 text-foreground/80">
            Corretor autônomo em {CIDADE} há mais de 10 anos. Conhece cada bairro da região e
            acompanha pessoalmente cada cliente, da primeira visita até a assinatura do
            contrato — sem formulário, sem burocracia e sem intermediários.
          </p>
          <div className="mt-6">
            <WhatsAppCTA href={gerarLinkWhatsAppGeral()} label="Falar com o corretor" />
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verificar visualmente**

```bash
npm run dev
```
Abrir `http://localhost:3000/sobre/` e conferir: foto redonda do corretor carregando,
texto de apresentação, botão de WhatsApp funcionando. Parar o servidor.

- [ ] **Step 3: Rodar build, lint e testes completos**

```bash
npm run build
npm run lint
npm test
```
Esperado: os três sem erro — build gera todas as rotas (`/`, `/imoveis`, 18 rotas de
`/imoveis/<slug>`, `/sobre`), lint limpo, 14 testes passando.

- [ ] **Step 4: Commit**

```bash
git add src/app/sobre/page.tsx
git commit -m "feat: implementa pagina sobre"
```

---

## Task 10: README e verificação final

**Files:**
- Modify: `README.md`
- Create: `docs/screenshots/home.png`
- Create: `docs/screenshots/imoveis.png`
- Create: `docs/screenshots/detalhe.png`

**Interfaces:**
- Consumes: nada de código — task de documentação e verificação final do build.

- [ ] **Step 1: Capturar screenshots das 3 páginas principais**

Rodar `npm run dev` e, usando a ferramenta de automação de navegador disponível no seu
ambiente (Playwright MCP ou Chrome extension), navegar e capturar em viewport 1280×800:

- `http://localhost:3000/` → salvar em `docs/screenshots/home.png`
- `http://localhost:3000/imoveis/` → salvar em `docs/screenshots/imoveis.png`
- `http://localhost:3000/imoveis/casa-jardim-primavera-1/` → salvar em
  `docs/screenshots/detalhe.png`

Parar o servidor depois.

- [ ] **Step 2: Reescrever `README.md`**

```markdown
# Meu Cantinho Imóveis

Imobiliária fictícia de porte pequeno/médio, criada como projeto de portfólio.

## O problema

Corretores autônomos e imobiliárias pequenas que atuam com imóveis populares e de classe
média costumam perder clientes para concorrentes que já têm um catálogo pesquisável
online. Sem um site, o contato depende de indicação boca a boca ou de anúncios avulsos em
redes sociais — o cliente não consegue comparar opções nem entrar em contato rapidamente.

A **Meu Cantinho Imóveis** resolve isso com um catálogo filtrável (tipo, preço, quartos,
bairro) e contato direto por WhatsApp em cada imóvel, sem formulário e sem fricção.

## Demo

https://corretor-imoveis-landing.vercel.app (preencher/atualizar após o deploy)

## Screenshots

![Home](docs/screenshots/home.png)
![Listagem de imóveis](docs/screenshots/imoveis.png)
![Detalhe do imóvel](docs/screenshots/detalhe.png)

## Stack

Next.js (App Router, export estático) + TypeScript + Tailwind CSS. Sem backend, sem CMS —
o catálogo de imóveis é um array estático tipado em `src/data/imoveis.ts`. Testes com
Vitest cobrindo o seed de dados e as funções puras de filtro e geração de link do
WhatsApp.

## Rodando localmente

\`\`\`bash
npm install
npm run dev
\`\`\`

\`\`\`bash
npm test          # roda os testes
npm run build     # gera o export estático em out/
\`\`\`
```

- [ ] **Step 3: Verificação final completa**

```bash
npm run lint
npm test
npm run build
```
Esperado: os três comandos passam sem erro. Conferir manualmente a pasta `out/` gerada —
deve conter `index.html`, `imoveis/index.html`, um diretório por slug sob `imoveis/`,
`sobre/index.html` e os arquivos de `public/fotos/`.

- [ ] **Step 4: Commit**

```bash
git add README.md docs/screenshots
git commit -m "docs: atualiza readme com problema resolvido e screenshots"
```

- [ ] **Step 5: Deploy na Vercel (passo manual, fora do fluxo de commits)**

Conectar o repositório `Andrew-Figueiredo/corretor-imoveis-landing` a um novo projeto na
Vercel (dashboard ou `vercel` CLI), sem configuração adicional — o `next.config.ts` já
gera export estático e a Vercel detecta Next.js automaticamente. Confirmar que o deploy
automático dispara a cada push na branch `main`. Atualizar a URL do deploy no `README.md`
(Step 2) e no `projects.ts` do repo `andrew-landing`, conforme descrito no Contexto da
spec.

---
