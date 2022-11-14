import type { ReactNode } from "react";

import Logo from "../components/Logo";

interface AuthLayoutProps {
  children?: ReactNode;
  title: string;
}

function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <>
      <div className="flex min-h-screen flex-col justify-center bg-gray-100 py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Logo className="mx-auto h-12 w-auto" />
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">{title}</h1>
        </div>
        <div className="mt-14 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="border border-gray-200 bg-white py-8 px-4 sm:rounded-lg sm:px-10">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

export { AuthLayout };
