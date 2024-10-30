"use client";

import { DollarSign, ShoppingBagIcon, ShoppingCart } from "lucide-react";
import StatsDataCard from "../Cards/StatsDataCard";
import useSWR from "swr";
import { serverURL } from "@/utils/serverURL";
import { SellerDataProps } from "@/types/dataTypes";
import { useSession } from "next-auth/react";
import { useSellerStore } from "@/stores/useSellerStore";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dashboard() {
  const session = useSession();
  const seller = useSellerStore((state) => state.seller);
  const setSeller = useSellerStore((state) => state.setSeller);
  const { data, error, isLoading } = useSWR<SellerDataProps[]>(`${serverURL}/api/sellers/${session?.data?.user?.email}`, fetcher);

  if (!seller?.seller_id && data) {
    // console.log('seller added');
    setSeller(data[0]);
  }

  // console.log(user);
  let sellerInfo;
  if (data) {
    sellerInfo = data[0];
  }

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {/* Stats Data in Cards */}
        {/* Total Sales */}
        <StatsDataCard title="Total Sales" total={sellerInfo?.total_sales ?? 0}>
          <ShoppingCart className="text-primary" />
        </StatsDataCard>
        {/* Total Products */}
        <StatsDataCard
          title="Total Products"
          total={sellerInfo?.total_products ?? 0}
        >
          <ShoppingBagIcon className="text-primary" />
        </StatsDataCard>
        {/* Total Income */}
        <StatsDataCard
          title="Total Income"
          total={sellerInfo?.total_income ?? 0}
        >
          {sellerInfo?.currency === "bdt" ? (
            <span className="text-bold text-2xl">&#2547;</span>
          ) : (
            <DollarSign className="text-primary" />
          )}
        </StatsDataCard>
      </div>
    </>
  );
}
