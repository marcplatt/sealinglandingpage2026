"use client";

import { useMemo, useState } from "react";

import styles from "./dashboard.module.css";

type SendToClaudeButtonProps = {
  recommendationTitle: string;
  campaignName: string;
  dollarsRecoverable: number;
  reason: string;
  action: string;
};

type SendState = "idle" | "copied" | "failed";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0
  }).format(value);
}

export function SendToClaudeButton({
  recommendationTitle,
  campaignName,
  dollarsRecoverable,
  reason,
  action
}: SendToClaudeButtonProps) {
  const [sendState, setSendState] = useState<SendState>("idle");

  const payload = useMemo(
    () =>
      [
        "Review this Google Ads optimization recommendation and return a concrete implementation plan:",
        `- Recommendation: ${recommendationTitle}`,
        `- Campaign: ${campaignName}`,
        `- Dollars recoverable: ${formatCurrency(dollarsRecoverable)}`,
        `- Why this matters: ${reason}`,
        `- Proposed action: ${action}`,
        "",
        "Please provide:",
        "1) exact changes to make",
        "2) expected ROAS impact",
        "3) any risk or QA checks"
      ].join("\n"),
    [action, campaignName, dollarsRecoverable, reason, recommendationTitle]
  );

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(payload);
      window.open("https://claude.ai/new", "_blank", "noopener,noreferrer");
      setSendState("copied");
      window.setTimeout(() => setSendState("idle"), 2400);
    } catch {
      setSendState("failed");
      window.setTimeout(() => setSendState("idle"), 3200);
    }
  }

  const label =
    sendState === "copied"
      ? "Copied"
      : sendState === "failed"
        ? "Copy Failed"
        : "Send to Claude";

  return (
    <button
      type="button"
      className={styles.sendButton}
      onClick={handleClick}
      aria-label={`Send recommendation ${recommendationTitle} to Claude`}
    >
      {label}
    </button>
  );
}