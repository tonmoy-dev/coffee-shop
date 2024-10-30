"use client"

import { doLogout } from "@/app/actions";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ClickOutside from "@/components/Utility/ClickOutside";
import { LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'

const DropdownUser = () => {
  const session = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const router = useRouter();


  return (
    <ClickOutside onClick={() => setDropdownOpen(false)}>
      <div className="relative">
        <Link
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-4"
          href="#"
        >
          <span className="hidden text-right lg:block">
            <span className="block text-sm font-medium text-black dark:text-white">
              {/* {firstName} {lastName} */}
              {session?.data?.user?.name || ""
              }
            </span>
            <span className="block text-xs">Coffee Seller</span>
          </span>
          {/* User Profile Dropdown */}
          <span className="h-10 w-10 rounded-full">
            <Image
              className="rounded-full"
              width={100}
              height={100}
              src={session?.data?.user?.image || ""}
              // ?? "/images/user/user.png"
              style={{
                width: "auto",
                height: "auto",
              }}
              alt={session?.data?.user?.name || ""}
            //  ?? "New Seller"

            />
          </span>
        </Link>

        {/* <!-- Dropdown Start --> */}
        {dropdownOpen && (
          <div
            className={`absolute right-0 mt-3 flex w-60 flex-col rounded-sm border bg-white dark:bg-background border shadow-default z-40`}
          >
            <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
              <li>
                <Link
                  href="/profile"
                  className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                  onClick={() => setDropdownOpen(false)}
                >
                  <UserIcon />
                  My Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/account-settings"
                  className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                  onClick={() => setDropdownOpen(false)}
                >
                  <SettingsIcon />
                  Account Settings
                </Link>
              </li>
            </ul>
            {/* -- log out -- */}
            <form action={doLogout}>
              <button
                className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                type="submit"
                onClick={() => {
                  router.push('/login');
                }}
              >
                <LogOutIcon /> Logout
              </button>
            </form>
          </div>
        )}
        {/* <!-- Dropdown End --> */}
      </div>
    </ClickOutside>
  );
};

export default DropdownUser;
