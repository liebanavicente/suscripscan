import Image from "next/image";

interface BrandMarkProps {
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  className?: string;
}

const sizes = {
  sm: { box: "h-8 w-8", image: 22, text: "text-base" },
  md: { box: "h-10 w-10", image: 28, text: "text-lg" },
  lg: { box: "h-14 w-14", image: 40, text: "text-2xl" },
};

export default function BrandMark({
  size = "md",
  showName = true,
  className = "",
}: BrandMarkProps) {
  const selected = sizes[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`${selected.box} brand-emblem-shell flex shrink-0 items-center justify-center`}
      >
        <Image
          src="/suscripscan-emblem.avif"
          alt=""
          width={selected.image}
          height={selected.image}
          priority={size === "lg"}
          className="h-auto w-auto"
        />
      </div>
      {showName && (
        <span className={`font-semibold tracking-normal text-white ${selected.text}`}>
          Suscripscan
        </span>
      )}
    </div>
  );
}
