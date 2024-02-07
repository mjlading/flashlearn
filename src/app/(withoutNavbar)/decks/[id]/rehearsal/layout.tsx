import BackButton from "@/components/BackButton";
import { PropsWithChildren } from "react";

export default function RehearsalLayout({ children }: PropsWithChildren) {
  return (
    <div className="h-screen">
      <header className="h-[60px] flex items-center px-4">
        <BackButton variant="ghost" />
      </header>
      <div className="flex items-center justify-center height-minus-navbar">
        <main>{children}</main>
      </div>
    </div>
  );
}
