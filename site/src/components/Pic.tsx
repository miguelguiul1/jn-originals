export interface Variant {
  base: string; // ex.: /img/brand/hero-rua
  widths: number[];
  w: number; // dimensões reais do arquivo mais largo
  h: number;
}
const set = (v: Variant) => v.widths.map((w) => `${v.base}-${w}.webp ${w}w`).join(", ");

/** Foto de campanha: versão larga a partir de 768 px, versão retrato abaixo disso. */
export function Pic({ wide, tall, alt, priority = false, className }: { wide: Variant; tall: Variant; alt: string; priority?: boolean; className?: string }) {
  const last = tall.widths[tall.widths.length - 1];
  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={set(wide)} sizes="100vw" width={wide.w} height={wide.h} />
      <img
        src={`${tall.base}-${last}.webp`}
        srcSet={set(tall)}
        sizes="100vw"
        width={tall.w}
        height={tall.h}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        {...(priority ? { fetchPriority: "high" as const } : {})}
        className={className}
      />
    </picture>
  );
}

export const HERO = {
  wide: { base: "/img/brand/hero-rua", widths: [960, 1280, 1920], w: 1920, h: 830 },
  tall: { base: "/img/brand/hero-rua-tall", widths: [480, 720], w: 720, h: 854 },
};
export const MOTOR = {
  wide: { base: "/img/brand/motorsport", widths: [960, 1600], w: 1600, h: 667 },
  tall: { base: "/img/brand/motorsport-tall", widths: [480, 720], w: 720, h: 765 },
};
