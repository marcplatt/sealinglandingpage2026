import type { ComponentPropsWithoutRef } from "react";

type MarketingVideoProps = {
  src: string;
  poster?: string;
  title: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  playsInline?: boolean;
  ariaLabel?: string;
  preload?: ComponentPropsWithoutRef<"video">["preload"];
  aspectRatio?: string;
};

function joinClassNames(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function MarketingVideo({
  src,
  poster,
  title,
  className,
  autoPlay = false,
  muted,
  loop,
  controls,
  playsInline = true,
  ariaLabel,
  preload,
  aspectRatio = "16 / 9"
}: MarketingVideoProps) {
  const resolvedMuted = autoPlay ? muted ?? true : muted ?? false;
  const resolvedLoop = autoPlay ? loop ?? true : loop ?? false;
  const resolvedControls = controls ?? !autoPlay;
  const resolvedPreload = preload ?? (autoPlay ? "metadata" : "none");

  return (
    <div
      className={joinClassNames("marketing-video", className)}
      style={{ aspectRatio }}
      aria-label={ariaLabel ?? title}
    >
      <video
        className="marketing-video__media"
        src={src}
        poster={poster}
        title={title}
        autoPlay={autoPlay}
        muted={resolvedMuted}
        loop={resolvedLoop}
        controls={resolvedControls}
        playsInline={playsInline}
        preload={resolvedPreload}
      >
        Your browser does not support embedded videos. Please contact Rocket Wash
        for details and quotes.
      </video>
    </div>
  );
}
