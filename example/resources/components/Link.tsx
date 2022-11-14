import { hydratable } from "@microeinhundert/radonis";
import type { ReactNode } from "react";

import { clsx } from "../utils/string";

/*
 * Link
 */
interface LinkProps extends HTMLProps<"a"> {
  children?: ReactNode;
}

function Link({ children, className, ...restProps }: LinkProps) {
  return (
    <a
      {...restProps}
      className={clsx("font-medium text-emerald-600 hover:text-emerald-500", className)}
    >
      {children}
    </a>
  );
}

export default hydratable("Link", Link);
