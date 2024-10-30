"use client";
import { useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden dark:bg-background">
      {/* Sidebar Start */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {/* Sidebar End */}

      {/* Content Area */}
      <div className="relative flex flex-1 flex-col overflow-y-auto over-flow-x-hidden">
        {/* Header Start */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* Header End */}

        {/* Main Content */}
        <main className="">
          <div className="mx-auto max-w-screen-2xl p-4 md:p-10 ">{children}</div>
        </main>
        {/* Main Content End */}
      </div>
      {/* Content Area End */}
    </div>
  );
}
