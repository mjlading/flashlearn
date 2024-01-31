import Sidebar from "@/components/Sidebar";
import { PropsWithChildren } from "react";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex height-minus-navbar">
      <Sidebar />
      <main className="flex-grow bg-muted my-7 mx-12">{children}</main>
    </div>
  );
}
