import { type ReactNode } from "react";

export function ErrorAlert({ children }: { children: ReactNode }) {
  return (
    <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
      {children}
    </div>
  );
}
