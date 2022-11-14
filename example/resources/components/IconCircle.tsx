import { hydratable } from "@microeinhundert/radonis";

import { clsx } from "../utils/string";

/*
 * Icon Circle
 */
export enum IconCircleColor {
  Emerald = "emerald",
  Red = "red",
  Indigo = "indigo",
}

interface IconCircleProps extends HTMLProps<"div"> {
  icon: IconComponent;
  color?: IconCircleColor;
  large?: boolean;
}

function IconCircle({
  icon: Icon,
  color = IconCircleColor.Emerald,
  large,
  className,
  ...restProps
}: IconCircleProps) {
  return (
    <div
      className={clsx(
        "inline-flex aspect-square items-center justify-center rounded-full",
        {
          [IconCircleColor.Emerald]: "bg-emerald-100 text-emerald-600",
          [IconCircleColor.Red]: "bg-red-100 text-red-600",
          [IconCircleColor.Indigo]: "bg-indigo-100 text-indigo-600",
        }[color],
        large ? "w-16" : "w-10",
        className
      )}
      {...restProps}
    >
      <Icon className={clsx("aspect-square", large ? "w-8" : "w-5")} />
    </div>
  );
}

export default hydratable("IconCircle", IconCircle);
