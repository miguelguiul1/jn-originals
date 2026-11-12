import { imgUrl, type Product } from "../lib/catalog";

type Src = Pick<Product, "slug" | "name" | "brand" | "imgs">;

/** Imagem do produto com srcset do manifesto. Sem foto: placeholder tipográfico, nunca imagem quebrada. */
export function Photo({
  p,
  index = 0,
  sizes,
  priority = false,
  className,
}: {
  p: Src;
  index?: number;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const im = p.imgs[index];
  if (!im) return <div className="ph" role="img" aria-label={p.name}>{p.brand || p.name}</div>;
  const srcSet = im.widths.map((w) => `${imgUrl(p.slug, im.n, w)} ${w}w`).join(", ");
  return (
    <img
      src={imgUrl(p.slug, im.n, im.widths[im.widths.length - 1])}
      srcSet={srcSet}
      sizes={sizes}
      width={im.w}
      height={im.h}
      alt={p.name}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      {...(priority ? { fetchPriority: "high" as const } : {})}
      className={className}
    />
  );
}
