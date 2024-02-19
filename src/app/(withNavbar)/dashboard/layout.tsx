import Sidebar from "@/components/Sidebar";
import { PropsWithChildren } from "react";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex height-minus-navbar">
      <Sidebar />
      <div className="overflow-auto py-7 w-full">
        <main className="flex-grow mx-12 h-full">{children}</main>
      </div>
    </div>
  );
}
