import { Link } from "react-router-dom";

export function Logo() {
  return (
    <Link to="/" aria-label="JN Originals, início" className="font-display text-xl italic leading-none text-ink no-underline" style={{ fontWeight: 700 }}>
      JN Originals
    </Link>
  );
}
