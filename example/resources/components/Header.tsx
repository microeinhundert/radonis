import { hydratable } from "@microeinhundert/radonis";
import type { ReactNode } from "react";

/*
 * Header
 */
interface HeaderProps {
  title: string;
  actions?: ReactNode;
}

function Header({ title, actions }: HeaderProps) {
  return (
    <header className="mb-12 flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
      <div className="flex-1">
        <h1 className="truncate text-4xl font-bold text-gray-900">{title}</h1>
      </div>
      {actions && <div className="flex items-center gap-4">{actions}</div>}
    </header>
  );
}

export default hydratable("Header", Header);
