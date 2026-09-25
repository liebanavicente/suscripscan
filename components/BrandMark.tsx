interface BrandMarkProps {
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  className?: string;
}

const sizes = {
  sm: { box: 30, text: "text-lg" },
  md: { box: 38, text: "text-xl" },
  lg: { box: 52, text: "text-3xl" },
};

export function BrandGlyph({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="shrink-0">
      <rect width="64" height="64" rx="12" fill="var(--color-ink)" />
      <path
        d="M18 12h28v36l-3.5-3-3.5 3-3.5-3-3.5 3-3.5-3-3.5 3-3.5-3-3.5 3z"
        fill="var(--color-paper-2)"
      />
      <rect x="23" y="19" width="18" height="3" fill="var(--color-ink)" />
      <rect x="23" y="26" width="12" height="3" fill="var(--color-ink)" />
      <rect x="23" y="33" width="15" height="3" fill="var(--color-ink)" />
      <rect x="10" y="29" width="44" height="3" rx="1.5" fill="var(--color-stamp)" />
    </svg>
  );
}

export default function BrandMark({
  size = "md",
  showName = true,
  className = "",
}: BrandMarkProps) {
  const selected = sizes[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <BrandGlyph size={selected.box} />
      {showName && (
        <span
          className={`font-display font-extrabold leading-none tracking-tight text-ink ${selected.text}`}
          style={{ fontVariationSettings: '"wdth" 88' }}
        >
          suscrip
          <span className="relative text-stamp">
            scan
            <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-stamp/70" />
          </span>
        </span>
      )}
    </div>
  );
}
