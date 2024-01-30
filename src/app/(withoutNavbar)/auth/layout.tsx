import { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex items-center justify-center h-screen bg-accent">
      {children}
    </div>
  );
}
