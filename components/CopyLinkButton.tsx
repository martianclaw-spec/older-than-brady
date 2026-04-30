"use client";

import { useState } from "react";

type Props = {
  seed: string;
  className?: string;
  label?: string;
};

export default function CopyLinkButton({ seed, className, label }: Props) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    if (!seed) return;
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/challenge?seed=${seed}`
        : `/challenge?seed=${seed}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // older browsers / insecure contexts
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        // give up
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!seed}
      className={
        className ??
        "btn-base w-full rounded-2xl py-3 text-base font-semibold border border-white/15 text-white/85 hover:bg-white/5 disabled:opacity-50"
      }
    >
      {copied ? "Link copied!" : label ?? "Copy challenge link"}
    </button>
  );
}
