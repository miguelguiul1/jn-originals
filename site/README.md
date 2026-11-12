# JN Originals — protótipo da loja

React + TypeScript + Vite + Tailwind. Rotas com HashRouter (funciona em qualquer hospedagem estática).

```bash
npm install
npm run dev        # desenvolvimento
npm run build      # gera /dist
npx vite build -c vite.single.config.ts   # gera 1 HTML único em /dist-preview
```

## Antes de mostrar / publicar
- `src/lib/store.ts`: preencher `whatsapp` (só dígitos com DDI, ex. 5511999999999). Vazio = botões vão para o Direct do Instagram.
- `src/data/products.ts`: preços, códigos e parcelas vêm do site atual. **Tamanhos são exemplo**: trocar pelo estoque real.
- `src/assets/img/*.jpg`: recortes de vídeo do site atual (baixa resolução). Trocar pelas fotos originais da loja.
- Logo: o wordmark "JN Originals" é texto. Trocar por `Logo.tsx` com o arquivo real da marca.
- Checkout é demonstração: não processa pagamento. O pedido sai por WhatsApp/Direct.
- Há `noindex` no `index.html` e faixa "Protótipo" no rodapé. Remover só quando o dono aprovar e a loja for oficial.
- Faltam: feedbacks reais de clientes, política de troca/entrega escrita pelo dono, foto da fachada.
