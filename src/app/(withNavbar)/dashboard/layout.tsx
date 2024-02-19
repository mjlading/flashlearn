import Sidebar from "@/components/Sidebar";
import { PropsWithChildren } from "react";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex height-minus-navbar">
      <Sidebar />
      <div className="overflow-auto w-full">
        <main className="flex-grow my-7 mx-12">{children}</main>
      </div>
    </div>
  );
}
