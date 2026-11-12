# REVISAO.md (ciclo 2, final) — fidelidade (check 5) fica com o orquestrador (10/10, DECISOES.md)

## Falhas, da mais grave para a menos (nenhuma bloqueia o deploy)
1. **Média** — Card esgotado não sinaliza nada na loja: 69 produtos `inStock:false` aparecem iguais aos disponíveis e o cliente só descobre na página (`site/src/components/ProductCard.tsx`, sem leitura de `inStock`). Correção: selo "Esgotado" no card (texto, sem cor nova) ou `aria-label` equivalente.
2. **Baixa** — Produto esgotado ainda mostra tamanhos clicáveis e "Pedir pelo WhatsApp" (ex.: `tenis-nike-court-vision-branco-2023-11-09-14-05-09`, 2 de 5 tamanhos habilitados), `site/src/pages/Product.tsx` (~l.145-185). Correção: com `soldOut`, desabilitar o grupo de tamanhos e trocar o rótulo do link por "Perguntar sobre reposição".
3. **Baixa** — Nome na mensagem de WhatsApp sai em Title Case ("Tênis Tommy Hilfiger Dino- Branco") e o catálogo guarda caixa alta; só diferença de caixa, nome e código corretos. Registrar como decisão ou ignorar.
4. **Informativa** — Lighthouse depende de compressão: sem brotli/gzip o desempenho cai a 72-75. A Vercel comprime, então ok; não servir o `dist` por outro host sem compressão.
(Falhas do ciclo 1: itens de desempenho/CLS, trilha Tênis, hierarquia de títulos e sacola vazia não reapareceram; ver tabela.)

## Passou
| Check | Resultado |
|---|---|
| build, tsc, `npm audit --omit=dev` | ok, 0 vulnerabilidades |
| Produto com tamanhos (`tenis-tommy-hilfiger-branco`) | sem tamanho: aviso "Escolha um tamanho" e sacola fica (0); 38/39 `aria-disabled` + `line-through`, clique forçado não seleciona; 3 fotos, setas do teclado e Tab+Enter nas miniaturas navegam |
| Mensagem WhatsApp | contém nome, "Código: THYM0FM02576" e "Tamanho: 40" + URL do produto; sem tamanho o link não abre e avisa |
| Produto `inStock:false` | sem botão "Adicionar à sacola"; texto "Indisponível no momento" |
| Fluxo Início → Loja → marca Tommy Hilfiger + tamanho 40 (2 de 2) → Produto → tamanho → Sacola (Tamanho 40) → Finalizar | ok; nome obrigatório com erro; href `api.whatsapp.com/send/?phone=5511984276643&text=...`; 0 campos de cartão; sacola não ficou vazia |
| Como comprar | as 2 seções de `policies.json` (títulos e corpo) aparecem literais |
| Parcela | "12x de R$ 51,95"; "sem juros" não aparece |
| 320 e 1920 px (loja + 3x "Ver mais" = 192 fotos, 2 produtos, home) | sem rolagem horizontal, 0 imagens quebradas, 0 pageerror/console.error |

## Lighthouse mobile (mediana de 3; `dist` servido com rewrite do vercel.json + brotli, script em /tmp/claude-0/rv/srv.mjs)
| Página | Desemp. | Acess. | Boas prát. | LCP / CLS / TBT |
|---|---|---|---|---|
| / | 95 | 100 | 100 | 2,7 s / 0 / 0 ms |
| /loja | 91 | 100 | 100 | 3,4 s / 0 / 39 ms |
| /produto/tenis-tommy-hilfiger-branco | 91 | 100 | 100 | 3,2 s / 0 / 12 ms |
Screenshots: /tmp/claude-0/shots2/ (produto-tamanhos-390, sacola-390, finalizar-390).
