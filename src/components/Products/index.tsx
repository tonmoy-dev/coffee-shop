"use client";

import ProductCard from "./ProductCard";
import { CirclePlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddNewProduct from "./AddNewProduct";
import { Button } from "../ui/button";
import useSWR, { useSWRConfig } from "swr";
import axios from "axios";
import { serverURL } from "@/utils/serverURL";
import { ProductDataProps } from "@/types/dataTypes";
import { useSession } from "next-auth/react";
import { useSellerStore } from "@/stores/useSellerStore";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Products() {
  const session = useSession();
  const seller_email = session?.data?.user?.email;
  const seller = useSellerStore((state) => state.seller);

  const { data, error } = useSWR<ProductDataProps[] | undefined>(
    `${serverURL}/api/products/${seller_email}`, fetcher);


  const { mutate } = useSWRConfig();


  const handleDeleteProduct = async (id: number) => {
    try {
      const res = await axios.delete(`${serverURL}/api/products/${id}`);

      console.log("Product is deleted successfully");
      if (res.status !== 200) {
        throw new Error("Failed to delete product");
      }
      mutate(`${serverURL}/api/products`);
    } catch (err) {
      console.error('Error deleting todo:', err);
    }
  };

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl text-gray-900">Shop Products</h2>
          {/* -- Add New Product -- */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default">
                <CirclePlusIcon
                  className="-ml-1 mr-2 h-5 w-5"
                  aria-hidden="true"
                />
                Add A New Product
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full">
              <DialogTitle>Add Product Details</DialogTitle>
              <AddNewProduct sellerCurrency={seller?.currency} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {data.length === 0 ? (
            <div>You have no products.</div>
          ) : (
            data?.map((product: ProductDataProps) => (
              <ProductCard
                key={product.product_id}
                product={product}
                onDelete={handleDeleteProduct}
                sellerCurrency={seller?.currency}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
