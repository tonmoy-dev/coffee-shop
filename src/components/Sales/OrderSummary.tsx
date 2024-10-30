"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { ShoppingCartIcon, MinusCircleIcon, PlusCircleIcon, CircleXIcon } from "lucide-react";
import { ProductDataProps } from '@/types/dataTypes';
import { useCartStore } from '@/stores/useCartStore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { PosReceiptModal } from '../Modals/PosReceiptModal';

interface OrderSummaryProps {
  sellerCurrency: string | undefined;
  sellerTaxRate: number | undefined;
  filteredProducts: ProductDataProps[] | undefined;
  setFilteredProducts: React.Dispatch<React.SetStateAction<ProductDataProps[] | undefined>>
}

export type Cart = {
  product_id: number;
  count: number;
  price: number;
  initialPrice: number;
  name: string;
};

const OrderSummary: React.FC<OrderSummaryProps> = ({ sellerCurrency, sellerTaxRate, filteredProducts,
  setFilteredProducts }) => {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, subtotal, total, setDiscountRate, calculateTotals } = useCartStore();


  const [discount, setDiscount] = useState<number>(0);
  const currencySign = sellerCurrency;
  const tax = sellerTaxRate || 0;

  const addProductToSales = (item: ProductDataProps) => {
    if (filteredProducts) {
      setFilteredProducts([...filteredProducts, item])
    }
  }
  const handleInputChange = (e: any) => {
    setDiscountRate(Number(e.target.value));
    setDiscount(Number(e.target.value));
    calculateTotals();
  };


  return (
    <div className="mt-10 lg:mt-0 space-y-4">
      <h2 className="text-2xl text-gray-900 text-center">Cart</h2>

      <div className=" rounded-lg border border-gray-200 shadow-sm">
        <h3 className="sr-only">Items in your cart</h3>
        <ul role="list" className="divide-y divide-gray-200">
          {cart.length === 0 ? (
            <div className="my-10 text-center space-y-2">
              <ShoppingCartIcon className="h-6 w-6 mx-auto" />
              <p className="text-base text-semibold">Cart is empty!</p>
              <p className="text-[#3c4c4f] dark:text-white text-xs">
                Add a product for sale.
              </p>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <li key={item.product_id} className="flex py-4 px-4 sm:px-6">
                  <div className="flex-shrink-0">

                    <Image
                      height={100}
                      width={100}
                      src={item.image_src}
                      alt={item.image_alt}
                      className="h-10 w-10 rounded-md"
                    />
                  </div>

                  <div className="ml-3 flex flex-1 flex-col">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0 w-1/3">
                        <h4 className="text-sm">{item.name}</h4>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.variant}
                          {" - "}
                          {item?.size
                            .slice(0, 1)
                            .toUpperCase()}{" "}
                        </p>
                      </div>
                      <div>
                        <p className="mt-1 text-sm text-gray-500">
                          {" "}
                          Price: {item.price}  <span className="uppercase"> {currencySign}</span>
                        </p>
                      </div>
                      <div>
                        <Button
                          onClick={() => {
                            removeFromCart(item.product_id);
                            addProductToSales(item);
                            calculateTotals();
                          }}
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                        >
                          <CircleXIcon />
                        </Button>
                      </div>
                      <div className="space-y-0">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            onClick={() => {
                              decreaseQuantity(item.product_id);
                              calculateTotals();
                            }}
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                          >
                            <MinusCircleIcon />
                          </Button>
                          <p className="text-base">{item.quantity}</p>
                          <Button
                            onClick={() => {
                              increaseQuantity(item.product_id);
                              calculateTotals();
                            }}
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                          >
                            <PlusCircleIcon />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </>
          )}

        </ul>
        <div className="border-t border-gray-200 py-3 px-4 sm:px-6 flex items-center justify-between">
          <dt className="text-sm">Add Discounts</dt>
          <dd className="text-sm text-gray-900 relative">
            <Input
              className="w-20"
              type="number"
              placeholder=""
              onChange={handleInputChange}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 bg-[#dddd] rounded-r-md">
              <span className="text-sm">%</span>
            </div>
          </dd>
        </div>
        <div className="border-t border-gray-200 py-3 px-4 sm:px-6">
          <dl className="space-y-2">
            <div className="flex items-center justify-between">
              <dt className="text-sm font-medium text-gray-900">
                Subtotal
              </dt>
              <dd className="text-sm font-medium text-gray-900">
                {subtotal.toFixed(2)}
                <span className="uppercase"> {currencySign}</span>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm font-medium text-gray-900">TaxRates ({Math.round(tax)}%)</dt>
              <dd className="text-sm font-medium text-gray-900">
                {(subtotal * (tax / 100)).toFixed(2)}
                <span className="uppercase"> {currencySign}</span>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm font-medium text-gray-900">Discount ({discount}%)</dt>
              <dd className="text-sm font-medium text-gray-900">
                {(subtotal * (discount / 100)).toFixed(2)}
                <span className="uppercase"> {currencySign}</span>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm font-medium text-gray-900">Total</dt>
              <dd className="text-sm font-medium text-gray-900">
                {total.toFixed(2)}
                <span className="uppercase"> {currencySign}</span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <PosReceiptModal
        currencySign={currencySign || ""}
        filteredProducts={filteredProducts}
        setFilteredProducts={setFilteredProducts}
      />
    </div>
  );
};

export default OrderSummary;
