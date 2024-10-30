"use client"
import React, { useEffect, useState } from 'react';
import ProductsForSales from './ProductsForSales';
import OrderSummary from './OrderSummary';
import { ProductDataProps } from '@/types/dataTypes';
import { useSession } from 'next-auth/react';
import { useSellerStore } from '@/stores/useSellerStore';
import useSWR from 'swr';
import { serverURL } from '@/utils/serverURL';
import { useCartStore } from '@/stores/useCartStore';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Sales() {
  const session = useSession();
  const seller = useSellerStore((state) => state.seller);
  const seller_email = session?.data?.user?.email;
  const { data: products, error } = useSWR<ProductDataProps[] | undefined>(
    `${serverURL}/api/products/${seller_email}`,
    fetcher
  );
  const [filteredProducts, setFilteredProducts] = useState<ProductDataProps[] | undefined>(products);
  const clearCart = useCartStore(state => state.clearCart);

  // update data
  useEffect(() => {
    if (products) {
      // console.log("sales data updated");
      setFilteredProducts(products);
    }
  }, [products]);

  useEffect(() => {
    clearCart();
  }, [])

  if (error) {
    return <p>Failed to load data.</p>;
  }

  if (!products) {
    return <p>Loading...</p>;
  }

  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
      {/* Products for sales */}
      <ProductsForSales
        sellerCurrency={seller?.currency}
        sellerTaxRate={seller?.tax_rates}
        filteredProducts={filteredProducts}
        setFilteredProducts={setFilteredProducts}
      />
      {/* Order summary */}
      <OrderSummary
        sellerCurrency={seller?.currency}
        sellerTaxRate={seller?.tax_rates}
        filteredProducts={filteredProducts}
        setFilteredProducts={setFilteredProducts}
      />
    </div>
  );
}


