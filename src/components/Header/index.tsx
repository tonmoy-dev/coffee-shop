"use client";
import Link from "next/link";
import DropdownUser from "./DropdownUser";
import { CoffeeIcon, MenuIcon } from "lucide-react";
import { ModeToggle } from "../ui/mode-toggle";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  return (
    <header className="sticky top-0 z-40 flex w-full bg-white dark:bg-background drop-shadow-sm dark:border-b-2">
      <div className="flex flex-grow items-center justify-between px-4 py-5 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-40 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark  lg:hidden"
          >
            <MenuIcon />
          </button>
          {/* <!-- Hamburger Toggle BTN --> */}

          {/* Logo */}
          <Link
            href="/"
            className="block flex gap-2 items-center flex-shrink-0 lg:hidden text-2xl"
          >
            <CoffeeIcon size={30} />
            Coffee Shop
          </Link>
        </div>

        <div className="text-center hidden sm:block ms-4">
          <p className="text-xl">Welcome to Coffee Shop</p>
        </div>

        <div className="flex items-center gap-6 2xsm:gap-7">
          {/* <!-- Dark Mode Toggler --> */}
          <ModeToggle />

          {/* <!-- User Area --> */}
          <DropdownUser />
        </div>
      </div>
    </header>
  );
};

export default Header;
