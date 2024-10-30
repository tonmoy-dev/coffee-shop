"use client";
import React from "react";
import { ProductDataProps } from "@/types/dataTypes";
import { useCartStore } from "@/stores/useCartStore";
import Image from "next/image";
import { PlusCircleIcon } from "lucide-react";

interface ProductsForSalesProps {
  sellerCurrency: string | undefined;
  sellerTaxRate: number | undefined;
  filteredProducts: ProductDataProps[] | undefined;
  setFilteredProducts: React.Dispatch<React.SetStateAction<ProductDataProps[] | undefined>>
}
const ProductsForSales: React.FC<ProductsForSalesProps> = ({
  sellerCurrency,
  filteredProducts,
  sellerTaxRate,
  setFilteredProducts
}) => {
  const { addToCart, cart, taxRate, setTaxRate, calculateTotals } = useCartStore();

  const handleAddToCart = (product: ProductDataProps) => {
    if (!cart.some(item => item.product_id === product.product_id)) {
      addToCart(product);
    }
    const data = filteredProducts?.filter(item => item.product_id !== product.product_id);
    setFilteredProducts(data);
    if (!taxRate && sellerTaxRate) {
      setTaxRate(sellerTaxRate)
    }
    calculateTotals();
  };


  return (
    <div className="space-y-4">
      <h2 className="text-2xl text-gray-900">Products For Sale</h2>
      {filteredProducts?.map((product) => (
        <div
          key={product.product_id}
          onClick={() => handleAddToCart(product)}
          aria-disabled={true}
          className="px-4 py-3 sm:px-6 overflow-hidden rounded-lg border hover:border-1 hover:border-gray-700  cursor-pointer shadow-sm hover:shadow-md shadow  hover:shadow-gray-700"
        >
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              <Image
                height={100}
                width={100}
                className="h-10 w-10 rounded-full"
                src={product.image_src}
                alt={product.image_alt}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {product.name}
              </p>
              <p className="text-sm text-gray-500">
                price: {product.price}
                <span className="uppercase"> {sellerCurrency}</span>
              </p>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {product.variant}
              </p>
              <p className="text-sm text-gray-500">
                {product.size}
              </p>
            </div>
            <button
              className="flex flex-shrink-0 self-center"
            >
              <PlusCircleIcon />
            </button>

          </div>
        </div>
      ))}

      {
        filteredProducts?.length === 0 && (
          <div>
            <p>You have no products for sale.</p>
          </div>
        )
      }
    </div>
  );
};

export default ProductsForSales;
