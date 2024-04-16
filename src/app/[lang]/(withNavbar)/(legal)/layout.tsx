import { PropsWithChildren } from "react";

export default function LegalLayout({ children }: PropsWithChildren) {
  return (
    <div className="height-minus-navbar flex justify-center items-center">
      <main>{children}</main>
    </div>
  );
}
