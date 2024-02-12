import { PropsWithChildren } from "react";

export default function ExploreLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex justify-center py-7">
      <main>{children}</main>
    </div>
  );
}
