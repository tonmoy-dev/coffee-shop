import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarItem = ({ item }: any) => {
  const pathname = usePathname();

  // Find the active item from menu
  const isActive = (item: any) => {
    if (item.route === pathname) return true;
    if (item.children) {
      return item.children.some((child: any) => isActive(child));
    }
    return false;
  };

  // Check the item is active or not
  const isItemActive = isActive(item);

  return (
    <>
      {/* Menu item */}
      <li>
        <Link
          href={item.route}
          className={`${
            isItemActive ? "bg-graydark dark:bg-meta-4" : ""
          } group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4`}
        >
          {item.icon}
          {item.label}
        </Link>
      </li>
    </>
  );
};

export default SidebarItem;
