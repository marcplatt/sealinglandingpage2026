"use client";

import { ComponentPropsWithoutRef, MouseEvent } from "react";

import { trackCallConversion } from "../lib/analytics";

type TrackedPhoneLinkProps = ComponentPropsWithoutRef<"a">;

export function TrackedPhoneLink({ href, onClick, ...props }: TrackedPhoneLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);

    if (event.defaultPrevented || !href || !href.startsWith("tel:")) {
      return;
    }

    let hasNavigated = false;
    const navigateToDialer = () => {
      if (hasNavigated) {
        return;
      }
      hasNavigated = true;
      window.location.href = href;
    };

    const tracked = trackCallConversion({
      eventCallback: navigateToDialer,
      eventTimeoutMs: 1200
    });

    if (!tracked) {
      return;
    }

    event.preventDefault();
    window.setTimeout(navigateToDialer, 1300);
  }

  return <a {...props} href={href} onClick={handleClick} />;
}
