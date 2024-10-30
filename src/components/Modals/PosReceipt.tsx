"use client";
import React from "react";
import { useCartStore } from "@/stores/useCartStore";

const PosReceipt: React.FC<{
  currencySign: string;
}> = ({ currencySign }) => {
  const { cart, subtotal, total, discountRate, taxRate } = useCartStore();

  const currentDate = new Date();
  const date = currentDate.toLocaleDateString();
  const time = currentDate.toLocaleTimeString();

  return (
    <div className="w-[55mm] p-4 mx-auto border border-gray-300 font-mono text-[12px] leading-tight">
      <h1 className="text-center m-0 py-2 border-b">Coffee Shop</h1>
      <div className="my-4 space-y-1">
        <p className="text-center m-0">Date: {date}</p>
        <p className="text-center m-0 border-b">Time: {time}</p>
      </div>

      <ul className="list-none p-0 m-0">
        {cart.map((product) => (
          <li
            key={product.product_id}
            className="flex justify-between border-b border-dashed py-1"
          >
            <span>{product.name}</span>
            <span>
              {product.quantity} x{" "}
              {product.price}
              <span className="uppercase text-xs"> {currencySign}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <p className="flex justify-between border-t border-b py-1 mt-4">
          <span>Subtotal</span>{" "}
          <span>

            {subtotal.toFixed(2)}
            <span className="uppercase text-xs"> {currencySign}</span>
          </span>
        </p>
        <p className="flex justify-between py-1 border-b">
          <span>Tax({taxRate}%)</span>{" "}
          <span>

            {
              (subtotal * (taxRate / 100)).toFixed(2)
            }
            <span className="uppercase text-xs"> {currencySign}</span>
          </span>
        </p>
        <p className="flex justify-between py-1 border-b">
          <span>Discount({discountRate}%)</span>
          <span>
            {(subtotal * (discountRate / 100)).toFixed(2)}
            <span className="uppercase text-xs"> {currencySign}</span>
          </span>
        </p>
        <p className="flex justify-between font-bold py-1 border-t-2 border-b">
          <span>Total</span>{" "}
          <span>
            {/* {total.toFixed(2)} */}
            {Math.round(total)}
            <span className="uppercase text-xs"> {currencySign}</span>
          </span>
        </p>
      </div>

      <div className="text-center pt-4 border-t-2 border-dashed mt-4">
        <p>Thank you!</p>
      </div>
    </div>
  );
};

export default PosReceipt;
