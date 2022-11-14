import type { ComponentType } from "react";

declare global {
  type HTMLProps<Tag extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[Tag];

  type IconComponent = ComponentType<HTMLProps<"svg"> & { className?: string }>;
}

export {};
