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

https://corretor-imoveis-landing.vercel.app

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

```bash
npm install
npm run dev
```

```bash
npm test          # roda os testes
npm run build     # gera o export estático em out/
```
