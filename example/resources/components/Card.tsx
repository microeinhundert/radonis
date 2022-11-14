import { hydratable } from "@microeinhundert/radonis";
import type { ReactNode } from "react";

import { clsx } from "../utils/string";

/*
 * Card Head
 */
interface CardHeadProps {
  className?: string;
  children: ReactNode;
  actions?: ReactNode;
}

function CardHead({ className, children, actions }: CardHeadProps) {
  return (
    <div
      className={clsx(
        "flex flex-wrap items-center justify-between border-b border-gray-200 p-4 sm:flex-nowrap",
        className
      )}
    >
      <h3 className="flex flex-1 items-center gap-4 truncate font-medium">{children}</h3>
      {actions && <div className="ml-4 flex flex-shrink-0 gap-2">{actions}</div>}
    </div>
  );
}

/*
 * Card Body
 */
interface CardBodyProps {
  className?: string;
  children: ReactNode;
}

function CardBody({ className, children }: CardBodyProps) {
  return <div className={clsx("p-4", className)}>{children}</div>;
}

/*
 * Card
 */
interface CardProps {
  className?: string;
  children: ReactNode;
}

function Card({ className, children }: CardProps) {
  return (
    <div
      className={clsx(
        "overflow-hidden rounded-md border border-gray-200 bg-white text-gray-900 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

Card.Head = CardHead;
Card.Body = CardBody;

export default hydratable("Card", Card);
