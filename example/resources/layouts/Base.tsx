import type { ReactNode } from "react";

import Search from "../components/Search";
import Sidebar from "../components/Sidebar";

interface BaseLayoutProps {
  children?: ReactNode;
}

function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed inset-y-0 hidden w-64 lg:block">
        <Sidebar />
      </div>
      <div className="flex-1 lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 md:px-8">
          <div className="mb-10 border-b border-gray-200 py-4">
            <Search />
          </div>
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}

export { BaseLayout };
