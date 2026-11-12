# JN Originals: direção visual v2 (loja de rua, Paraisópolis)

A v1 (bege, "slim") foi rejeitada pelo Miguel: genérica, sem personalidade. A v2 parte do que a marca já é:
logo de pichação com escorrido, loja física em Paraisópolis (Rua Pasquale Gallupi, 1280), 198 mil seguidores no
Instagram, feed com looks montados no chão, galera na rua e muro de concreto, banners pretos com amarelo.

## 1. Princípios
- A marca é rua: fundo preto, foto de gente de verdade, a tag "JN" como assinatura. Nada de boutique.
- Grita só onde vende: amarelo (único destaque) em compra, preço promocional, faixa de informação e foco.
- Contraste alto e tipografia pesada condensada em caixa alta nos títulos; corpo limpo e legível.
- Prova de loja real em toda página: endereço, horário, WhatsApp. É o que separa a JN de golpe de "original".
- O escorrido do logo é o único ornamento da marca. Usar com parcimônia (logo, intro, divisor do hero). Nada além.

## 2. Tokens
Cor (tema único escuro; contraste WCAG medido):
| token | hex | uso |
|---|---|---|
| `--asfalto` | `#0B0B0A` | fundo da página |
| `--muro` | `#171716` | superfícies (filtros, gaveta, cabeçalho rolado) |
| `--linha` | `#2E2D2A` | divisores (sem texto) |
| `--giz` | `#F3F1EC` | texto principal (18,0:1 sobre asfalto) e moldura das fotos de produto |
| `--cinza` | `#A6A39B` | texto secundário (8,0:1 sobre asfalto; 7,2:1 sobre muro) |
| `--amarelo` | `#FFD21F` | destaque único: botão de compra (texto asfalto 14,6:1), faixa, preço em promoção, foco |
Bordas de campos: `#6E6B64` (3,5:1). Texto sobre a moldura `--giz` sempre em `--asfalto`.

Tipografia (fontsource, subset latin, `font-display: swap`):
- Display: `@fontsource-variable/archivo` com `font-stretch: 62%` (condensado), peso 800, CAIXA ALTA, `letter-spacing: -0.01em`, `line-height: .9`. Só títulos, preço grande e faixa. Pesos usados: 800 e 500.
- Texto/UI: `@fontsource-variable/hanken-grotesk` 400 e 600. Números com `tabular-nums`.
- Escala: rótulo `.75rem` (caixa alta, `letter-spacing: .08em`, Hanken 600) / `.875` / `1` / `1.25` / título de seção `clamp(2.25rem, 1.4rem + 4vw, 4.5rem)` / hero `clamp(3.25rem, 1.6rem + 8vw, 9rem)`.
- Remover Big Shoulders.

Espaço base 4 px (4 8 12 16 24 32 48 72 112). Gutter 16 px mobile, 32 px ≥ 1024. Largura máx. 1440 px.
Raio: 0 em tudo (corte seco, como lambe-lambe); 4 px só em chip de filtro e campo. Sombra: nenhuma.
Movimento: `cubic-bezier(.2,.7,.2,1)`; 140 ms hover, 240 ms gaveta. Hover de card: foto escala 1.03 dentro da moldura.

## 3. Ativos (já em `site/public/img/brand/`)
- `logo-jn.svg` (tag completa "JN + ORIGINALS" com escorrido, `fill=currentColor`) e `mark-jn.svg` (só "JN"). Use inline (`<svg>` via import `?raw` ou componente) para herdar cor; nunca reescreva o logo em fonte.
- Hero: `hero-rua-{1920,1280,960}.webp` (largo, 1920x830: três caras de Nike/Lacoste na rua) e `hero-rua-tall-{720,480}.webp` (retrato, para mobile via `<picture>`/`media`).
- Campanha Puma Motorsport (dentro da loja física): `motorsport-{1600,960}.webp` e `motorsport-tall-{720,480}.webp`. Leva para `/loja?q=puma` filtrando BMW/Mercedes (59 produtos têm BMW/Mercedes/Ferrari/Red Bull no nome: use busca "puma").

## 4. Composição
- **Cabeçalho:** preto, `mark-jn.svg` branco 34 px à esquerda; navegação em rótulo caixa alta (Loja, Tênis, Roupas, Bonés, Como comprar, A loja); busca com ícone desenhado em CSS ou texto "Buscar"; "Sacola" com contador em quadrado amarelo. Fixo no topo, fundo `--muro` após rolar.
- **Início (6 seções):**
  1. Hero tela cheia (≥ 88svh mobile, 78vh desktop): foto da rua, degradê preto só de baixo para legibilidade (é escurecimento de foto, não enfeite), `logo-jn.svg` grande em giz alinhado à esquerda embaixo, linha "Apenas produtos originais." e UM botão amarelo "Ver a loja". Ao lado do botão, texto pequeno: "Loja física em Paraisópolis · seg a sáb, 9h às 20h".
  2. Faixa amarela correndo (marquee CSS, pausa no hover, estática com reduced-motion), texto preto em display: APENAS PRODUTOS ORIGINAIS · LOJA FÍSICA EM PARAISÓPOLIS · ATÉ 12X NO CARTÃO · MOTOBOY EM SP · ENVIO PARA TODO O BRASIL · PEDIDO PELO WHATSAPP.
  3. "Chegou agora": grade assimétrica (1 card grande 2x2 + 4 normais no desktop; carrossel com scroll-snap no mobile), título de seção à esquerda, link "Ver tudo" à direita.
  4. "Por categoria": mosaico de 6 blocos com foto do produto mais recente da categoria (Tênis, Jaquetas e blusões, Camisetas e polos, Calças e bermudas, Conjuntos/Tracksuit, Bonés e acessórios), nome em display giz sobre faixa preta na base do bloco, contagem real de itens. Alturas alternadas (não grade idêntica).
  5. Campanha Motorsport: foto larga sangrada, título "Linha Puma Motorsport" em display, 1 botão "Ver a linha".
  6. "A loja": bloco preto com endereço grande em display (RUA PASQUALE GALLUPI, 1280 / PARAISÓPOLIS · SP), horário, botão "Chamar no WhatsApp" (amarelo) e link "Como chegar" (Google Maps com a busca do endereço). `mark-jn.svg` enorme em `--linha` como marca d'água à direita.
- **Loja:** título "LOJA" display gigante + contagem; filtros em painel `--muro` (desktop à esquerda, mobile gaveta); chips de categoria rolando no topo do mobile; grade 2/3/4/4 colunas; cards com moldura giz.
- **Produto:** galeria grande na moldura giz (miniaturas abaixo no mobile, ao lado no desktop); nome em display; preço grande giz (promoção em amarelo com antigo riscado); parcela; tamanhos como quadrados (indisponível riscado); botão amarelo largo "Adicionar à sacola" + secundário com borda "Pedir pelo WhatsApp"; bloco "Retire na loja ou receba por motoboy/Correios" com endereço; "Mais da marca" em carrossel.
- **Sacola / Finalizar:** fundo muro, linhas com foto pequena na moldura giz; resumo com total em display; botão amarelo.
- **Como comprar:** 4 passos reais numerados em display gigante (escolha, tamanho, sacola, WhatsApp); depois políticas literais.
- **A loja:** foto motorsport (interior da loja), endereço, horário, CNPJ, WhatsApp, Instagram @jnoriginals01, link de mapa.
- **404:** "PERDEU O CAMINHO?" em display, busca e categorias.
- **Rodapé:** `logo-jn.svg` grande, endereço, horário, CNPJ, links, Instagram @jnoriginals01.

## 5. Card de produto
Moldura `--giz` 1:1 com a foto `contain` (fotos de origem são heterogêneas; a moldura clara unifica e lembra lambe-lambe no muro preto). Abaixo, em giz: marca em rótulo caixa alta cinza, nome em Hanken 600 (2 linhas máx.), preço em display 500. Selo "−13%" em amarelo no canto da moldura; "ESGOTADO" em faixa preta sobre a moldura.

## 6. Abertura (intro)
Overlay preto sobre a home já pintada. `logo-jn.svg` em giz aparece como spray: máscara revelando da esquerda para a direita (0–700 ms), depois os escorridos "descem" (clip-path vertical, 700–1100 ms), pausa, overlay sobe (1250–1650 ms). Total ≤ 1,7 s. "Pular", Esc e toque encerram. 1x por sessão (sessionStorage com try/catch), só em `/`, não monta com `prefers-reduced-motion`.

## 7. Continua proibido
Gradiente decorativo, glassmorphism, blobs, brilho, sombra difusa, cantos arredondados grandes, emojis, ícones de biblioteca como enfeite, contador falso, depoimento inventado, "descubra/eleve seu estilo/experiência única", trio de cards com ícone, Inter/Roboto/Poppins/Space Grotesk, mais de 1 cor de destaque, dado inventado.
