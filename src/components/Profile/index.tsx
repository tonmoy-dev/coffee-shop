"use client";

import Image from "next/image";
import { CameraIcon } from "lucide-react";
import { useSellerStore } from "@/stores/useSellerStore";
import { useSession } from "next-auth/react";


export default function Profile() {
  const session = useSession();
  const seller = useSellerStore((state) => state.seller);


  // if (error) return <div>Failed to load</div>;
  // if (!data) return <div>Loading...</div>;

  const fullName = `${seller?.first_name} ${seller?.last_name}`;

  return (
    <div className="mx-auto max-w-242.5">
      <div className="overflow-hidden rounded-md border ">
        <div className="relative z-20 h-35 md:h-65">
          <Image
            src={"/images/cover/coffee-cover.jpg"}
            alt="profile cover"
            className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
            width={900}
            height={200}
          />
          <div className="absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4">
            <label
              htmlFor="cover"
              className="flex cursor-pointer items-center justify-center gap-2 rounded bg-primary px-2 py-1 text-sm font-medium text-white hover:bg-opacity-80 xsm:px-4"
            >
              <input type="file" name="cover" id="cover" className="sr-only" />
              <span>
                <CameraIcon size={16} />
              </span>
              {/* <span>Edit</span> */}
            </label>
          </div>
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-32 sm:max-w-32 sm:p-3 flex items-center justify-center">
            <div className="relative drop-shadow-2">
              <Image
                src={session?.data?.user?.image ?? "/images/user/user.png"}
                width={200}
                height={200}
                alt="profile"
                className="rounded-full mx-auto my-auto w-20 h-20 md:w-24 md:h-24"
              />
              {/* <label
                htmlFor="profile"
                className="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
              >
                <CameraIcon size={16} />
                <input
                  type="file"
                  name="profile"
                  id="profile"
                  className="sr-only"
                />
              </label> */}
            </div>
          </div>
          <div className="">
            <h3 className="mb-1 text-2xl font-semibold text-black dark:text-white">
              {fullName}
            </h3>
            <p className="font-medium">Coffee Seller</p>

            <address className="text-base my-6 not-italic space-y-1">
              <p>{seller?.email}</p>
              <p>
                {seller?.street_address},{seller?.city}, {seller?.state}, {seller?.postal_code}
              </p>
              <p>
                {seller?.country} <span className="uppercase">({seller?.currency})</span>
              </p>
            </address>
            <div className="mx-auto mb-5.5 mt-4.5 grid max-w-94 grid-cols-3 rounded-md border border-stroke py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F]">
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                <span className="font-semibold text-black dark:text-white">
                  {seller?.total_sales}
                </span>
                <span className="text-sm">Sales</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                <span className="font-semibold text-black dark:text-white">
                  {seller?.total_products}
                </span>
                <span className="text-sm">Products</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row">
                <span className="font-semibold text-black dark:text-white">
                  {
                    seller && (
                      Math.round(seller?.total_income)
                    )
                  }
                  <span className="uppercase">
                    {" "}{seller?.currency}
                  </span>
                </span>
                <span className="text-sm">Income</span>
              </div>
            </div>

            <div className="mx-auto max-w-180">
              <h4 className="font-semibold text-black dark:text-white">
                About Me
              </h4>
              <p className="mt-4.5">{seller?.bio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
