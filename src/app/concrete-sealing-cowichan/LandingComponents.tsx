import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Image from "next/image";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  children: ReactNode;
};

type PanelProps = ComponentPropsWithoutRef<"div"> & {
  children: ReactNode;
};

type TopBarProps = {
  phoneDisplay: string;
  phoneHref: string;
  logoSrc?: string;
  logoAlt?: string;
};

function joinClassNames(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function LandingTopBar({
  phoneDisplay,
  phoneHref,
  logoSrc,
  logoAlt = "Rocket Wash logo"
}: TopBarProps) {
  return (
    <header className="lp-topbar" aria-label="Rocket Wash header">
      <div className="lp-container lp-topbar-inner">
        <a className="lp-brand" href="#top" aria-label="Rocket Wash">
          {logoSrc ? (
            <Image
              className="lp-brand-logo"
              src={logoSrc}
              alt={logoAlt}
              width={120}
              height={36}
              priority
            />
          ) : null}
          <span>Rocket Wash</span>
        </a>
        <div className="lp-topbar-actions">
          <a className="btn btn-outline" href="#quote-form">
            Jump to Quote Form
          </a>
          <a className="btn btn-solid" href={phoneHref}>
            Call {phoneDisplay}
          </a>
        </div>
      </div>
    </header>
  );
}

export function LandingSection({ children, className, ...props }: SectionProps) {
  return (
    <section className={joinClassNames("lp-section", className)} {...props}>
      <div className="lp-container">{children}</div>
    </section>
  );
}

export function LandingPanel({ children, className, ...props }: PanelProps) {
  return (
    <div className={joinClassNames("lp-panel", className)} {...props}>
      {children}
    </div>
  );
}