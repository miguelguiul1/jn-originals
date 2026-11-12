// Escorrido: borda com gotas, desenhada no mesmo espírito do traço do logo (pichação). Cor = currentColor.
// [x do centro, raio, comprimento abaixo da borda] da direita para a esquerda; largura de referência 1440.
const DRIPS: [number, number, number][] = [
  [1360, 6, 26], [1275, 4, 36], [1190, 7, 20], [1090, 5, 50], [1010, 8, 28], [905, 4, 44], [818, 6, 22],
  [700, 10, 58], [610, 5, 34], [520, 8, 16], [402, 4, 40], [330, 6, 24], [215, 9, 52], [130, 5, 18], [40, 7, 30],
];
const B = 14;
const path =
  `M0 0H1440V${B}` +
  DRIPS.map(([cx, r, len]) => `L${cx + r + 8} ${B}Q${cx + r} ${B} ${cx + r} ${B + 8}L${cx + r} ${B + len - r}A${r} ${r} 0 0 1 ${cx - r} ${B + len - r}L${cx - r} ${B + 8}Q${cx - r} ${B} ${cx - r - 8} ${B}`).join("") +
  `L0 ${B}Z` +
  // gotas soltas
  [[402, 65, 3.2], [905, 66, 3]].map(([x, y, r]) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0Z`).join("");

export function Drip({ className = "" }: { className?: string }) {
  return (
    <svg className={`drip ${className}`} viewBox="0 0 1440 72" preserveAspectRatio="xMidYMin slice" aria-hidden="true" focusable="false">
      <path d={path} fill="currentColor" />
    </svg>
  );
}
