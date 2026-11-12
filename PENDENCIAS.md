# Pendências

- A origem não tem descrição de produto nem campo de marca nas páginas públicas: `description` = `null`.
- Endereço e horário vieram da bio do Instagram @jnoriginals01 (print do Miguel). Falta o CEP.
- Três números de WhatsApp na origem (98427-6643, 98659-5505, 94026-2339). Usado o do rodapé (98427-6643) como principal; confirmar.
- Só 221 de 1.283 produtos têm página de produto coletada (tamanhos, estoque por tamanho e galeria). O teto de 400 páginas com `Crawl-delay: 10` não cobre o resto. Nos outros 1.062 a tela mostra "Tamanhos: confirme pelo WhatsApp". Para completar: `python3 -I scripts/crawl.py data/raw 400` (retoma), depois `build-catalog.py` e `fetch-images.mjs`.
- 69 produtos com preço na listagem aparecem sem tamanho disponível na página do produto (`inStock: false`). Confirmar se estão esgotados.
- 231 produtos sem marca identificável no nome (`brand: null`). O filtro de marca não os alcança.
- A política de trocas e o FAQ citam o WhatsApp (11) 94026-2339, e o rodapé cita o (11) 98427-6643. Definir o número oficial.
- Parcela: a origem mostra "até 12x de R$ X" sem dizer "sem juros", e 12 × X passa do preço à vista. O site repete o texto da origem; confirmar a taxa.
- Frete: a origem calcula por CEP no checkout da plataforma. O site novo não calcula, e o pedido segue pelo WhatsApp.
- Na seção "Perguntas frequentes" da origem, o Instagram aparece escrito "@jnorigianals"; o link real do rodapé é instagram.com/jnoriginals. O texto foi copiado como está.
