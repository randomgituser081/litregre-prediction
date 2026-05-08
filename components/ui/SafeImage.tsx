"use client";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  hideOnError?: boolean;
}

export default function SafeImage({ src, alt, className, hideOnError = true }: SafeImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        if (hideOnError) {
          (e.target as HTMLImageElement).style.display = "none";
        } else {
          (e.target as HTMLImageElement).style.opacity = "0";
        }
      }}
    />
  );
}
