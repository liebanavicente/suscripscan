interface Props {
  value: string;
  height?: number;
  className?: string;
  showValue?: boolean;
}

// Código de barras decorativo y determinista a partir de un texto.
export default function Barcode({ value, height = 44, className = "", showValue = true }: Props) {
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  let seed = 7;
  for (const ch of `*${value}*`) {
    seed = (seed * 31 + ch.charCodeAt(0)) % 9973;
    for (let i = 0; i < 4; i++) {
      const bit = (seed >> (i * 2)) & 3;
      const w = bit + 1;
      if (i % 2 === 0) bars.push({ x, w });
      x += w + (i % 2 === 0 ? 0 : 1);
    }
  }

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <svg
        viewBox={`0 0 ${x} ${height}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height }}
        aria-hidden="true"
      >
        {bars.map((b, i) => (
          <rect key={i} x={b.x} y={0} width={b.w} height={height} fill="currentColor" />
        ))}
      </svg>
      {showValue && (
        <span className="font-mono text-[10px] tracking-[0.4em] text-ink-soft">{value}</span>
      )}
    </div>
  );
}
