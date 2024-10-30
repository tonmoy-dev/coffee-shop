"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSellerStore } from "@/stores/useSellerStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { DialogClose } from "../ui/dialog";
import axios from "axios";
import { useSWRConfig } from "swr";
import { serverURL } from "@/utils/serverURL";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
  variant: z.string().min(1, {
    message: "variant is required.",
  }),
  size: z.string().min(1, {
    message: "Size is required.",
  }),
  price: z.number().min(0.01, {
    message: "Price is required and must be greater than 0.",
  }),
  weight: z.number().min(0.01, {
    message: "Weight is required and must be greater than 0.",
  }),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .max(160, {
      message: "Description must not be longer than 30 characters.",
    }),

});

export default function AddNewProduct({ sellerCurrency }: { sellerCurrency: string | undefined; }) {
  const session = useSession();
  const seller_email = session?.data?.user?.email;
  const seller = useSellerStore((state) => state.seller);

  const { mutate } = useSWRConfig();

  // define currency
  const currency = sellerCurrency;

  // Define form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      variant: "",
      price: 0,
      weight: 0,
      description: "",
      size: ""
    },
  });
  // update seller information
  async function updateSeller() {
    if (seller) {
      try {
        const res = await axios.patch(`${serverURL}/api/sellers/${session?.data?.user?.email}`, {
          total_products: seller?.total_products + 1
        });
        console.log("Seller profile updated:", res.data);

        if (res.data) {
          mutate(`${serverURL}/api/sellers`);
        }

      } catch (err) {
        console.error("Error on updating seller profile:", err);
      }
    }
  }
  // Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const productData = {
      ...values,
      category: "Coffee",
      image_src: "/images/products/coffee.png",
      image_alt: values.name,
      seller_email: seller_email
    };

    try {
      const res = await axios.post(`${serverURL}/api/products`, productData);
      console.log(res);

      if (res.data) {
        mutate(`${serverURL}/api/products/${seller_email}`);
      }
      console.log("Product added successfully");
      updateSeller();

      return res.data;
    } catch (err) {
      console.error("Error adding product:", err);
    }
    form.reset();
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-4 w-full mx-auto"
      >
        {/* name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Coffee" {...field} />
              </FormControl>
              <FormDescription>
                {/* This is your public display name. */}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* variant */}
        <FormField
          control={form.control}
          name="variant"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Variant</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      className="text-slate-500"
                      placeholder="Select Variant"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Cappuccino">Cappuccino</SelectItem>
                  <SelectItem value="Espresso">Espresso</SelectItem>
                  <SelectItem value="Black Coffee">Black Coffee</SelectItem>
                  <SelectItem value="Americano">Americano</SelectItem>
                  <SelectItem value="Mocha">Mocha</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                {/* This is your public display name. */}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* size */}
        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Size</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a size" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Large">Large</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Small">Small</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* price */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <Input
                    type="number"
                    aria-describedby="price-currency"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 bg-[#dddd] rounded-r-md">
                    <span className="uppercase text-sm" id="price-currency">
                      {currency}
                    </span>
                  </div>
                </div>
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* weight */}
        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weight</FormLabel>
              <FormControl>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 bg-[#dddd] rounded-r-md">
                    <span className="text-sm" id="price-currency">
                      GM
                    </span>
                  </div>
                </div>
              </FormControl>
              <FormDescription>
                {/* This is your public display name. */}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* description */}
        <div className="col-span-2">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write the product description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {/* This is your public display name. */}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {!form.formState.isValid ? (
          <Button className="col-span-2" type="submit">
            Submit
          </Button>
        ) : (
          <DialogClose className="col-span-2" asChild>
            <Button type="submit">Submit</Button>
          </DialogClose>
        )}
      </form>
    </Form>
  );
}
