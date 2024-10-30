"use client";

import React from "react";
import Link from "next/link";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import {
  BarChart,
  Coffee,
  LayoutDashboard,
  Menu,
  ShoppingBagIcon,
  ShoppingCart,
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

// side bar menu items
const menuGroups = [
  {
    name: "MENU",
    menuItems: [
      {
        icon: <LayoutDashboard />,
        label: "Dashboard",
        route: "/",
      },
      { icon: <ShoppingCart />, label: "POS", route: "/sales" },
      {
        icon: <ShoppingBagIcon />,
        label: "Products",
        route: "/products",
      },
      {
        icon: <BarChart />,
        label: "Reports",
        route: "/reports",
        children: [
          { label: "Daily Reports", route: "/reports/daily" },
          { label: "Monthly Reports", route: "/reports/Monthly" },
          { label: "Yearly Reports", route: "/reports/Yearly" },
        ],
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {

  return (
    <aside
      className={`absolute left-0 top-0 z-40 flex h-screen w-72 flex-col overflow-y-hidden bg-primary text-white duration-300 ease-linear dark:bg-secondary lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5 lg:py-6">
        <Link href="/" className="flex gap-2 items-center text-2xl">
          <Coffee />
          Coffee Shop POS
        </Link>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          className="block lg:hidden"
        >
          <Menu />
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="px-4 py-10 lg:px-6">
          {menuGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              <ul className="mb-6 flex flex-col gap-2">
                {group.menuItems.map((menuItem, menuIndex) => (
                  <SidebarItem key={menuIndex} item={menuItem} />
                ))}
              </ul>
            </div>
          ))}
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
