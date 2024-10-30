"use client";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries } from "@/assets/data/countries";
import axios from "axios";
import { serverURL } from "@/utils/serverURL";
import { useSellerStore } from "@/stores/useSellerStore";

const formSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  phone_number: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  street_address: z.string().min(1, "Add your street address"),
  city: z.string().min(1, "Add your city"),
  state: z.string().min(1, "Add your state"),
  postal_code: z.string().min(1, "Add your postal code"),
  bio: z
    .string()
    .min(10, "Write about you and your shop, add minimum 10 characters"),
  country: z.string().min(1, "Please select country"),
  currency: z.string().min(1, "Please select country"),
  product_category: z.string().min(1, "Please select category for your products"),
  tax_rates: z
    .number()
    .min(0, "Add tax rates for the products")
    .max(100, "Tax rates must be less than or equal to 100"),
});
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AccountSettings() {
  const session = useSession();
  const { seller, updateSeller, setSeller } = useSellerStore((state) => state);
  const seller_email = session?.data?.user?.email;
  const router = useRouter();

  // Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: seller?.first_name || "",
      last_name: seller?.last_name || "",
      phone_number: seller?.phone_number || "",
      street_address: seller?.street_address || "",
      city: seller?.city || "",
      state: seller?.state || "",
      postal_code: seller?.postal_code || "",
      bio: seller?.bio || "",
      country: seller?.country || "",
      currency: seller?.currency || "",
      product_category: seller?.product_category || "",
      tax_rates: Number(seller?.tax_rates) || 0,
    },
  });

  // Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {

    if (seller?.email) {
      // update the seller info
      try {
        const res = await axios.patch(`${serverURL}/api/sellers/${session?.data?.user?.email}`, values);
        // console.log("Seller profile updated:", res.data);

        if (res.data) {
          updateSeller({ ...values });
        }

      } catch (err) {
        console.error("Error on updating seller profile:", err);
      }

      router.push("/profile");
    } else {
      // add a new seller info
      const sellerData = {
        ...values,
        email: seller_email,
        total_sales: 0,
        total_products: 0,
        total_income: 0,
      };

      try {
        const res = await axios.post(`${serverURL}/api/sellers`, sellerData);
        console.log("Seller profile added:", res.data);

        if (res.data) {
          setSeller({ ...res?.data });
        }

      } catch (err) {
        console.error("Error on updating seller profile:", err);
      }
      router.push("/profile");
    }

  }
  return (
    <>
      <div className="px-4 py-5 shadow sm:rounded-lg sm:p-6 ">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-2xl text-gray-900">Profile</h3>
            <p className="mt-1 text-sm text-gray-500">
              Share your information.
            </p>
          </div>
          <div className="mt-5 space-y-6 md:col-span-2 md:mt-0">
            {/* profile settings form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-2 gap-4"
              >
                {/* first name */}
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>first_name</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormDescription>
                        {/* This is your public display name. */}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* last name */}
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>last_name</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormDescription>
                        {/* This is your public display name. */}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* email */}
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input disabled={(seller_email) ? true : false}
                      // placeholder={seller_email || ""}  
                      readOnly
                      value={seller_email ? seller_email : ""}
                    />
                  </FormControl>
                  <FormDescription>
                    {/* This is your public display name. */}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
                {/* phone */}
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormDescription>
                        {/* This is your public display name. */}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* street address */}
                <FormField
                  control={form.control}
                  name="street_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormDescription>
                        {/* This is your public display name. */}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* city */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormDescription>
                        {/* This is your public display name. */}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* state */}
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State / Province</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormDescription>
                        {/* This is your public display name. */}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* zip/ postal code */}
                <FormField
                  control={form.control}
                  name="postal_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP / Postal code</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormDescription>
                        {/* This is your public display name. */}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* country */}
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a country..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countries.map((country, index) => (
                            <SelectItem key={index} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {/* This is your public display name. */}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* -- currency -- */}
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bdt">BDT (&#2547;)</SelectItem>
                          <SelectItem value="usd">USD ($)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>{/* currency */}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* -- seller category -- */}
                <FormField
                  control={form.control}
                  name="product_category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seller Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="coffee">Coffee</SelectItem>
                          {/* <SelectItem value="tea">Tea</SelectItem> */}
                        </SelectContent>
                      </Select>
                      <FormDescription>{/* seller category */}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* -- tax rate -- */}
                <FormField
                  control={form.control}
                  name="tax_rates"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Rates</FormLabel>
                      <FormControl>
                        <div className="relative mt-1 rounded-md shadow-sm">
                          <Input
                            placeholder="Tax"
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 bg-[#dddd] dark:bg-secondary rounded-r-md">
                            <span className="text-semibold" id="price-currency">
                              %
                            </span>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>{/* Tax rates */}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* bio */}
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us a little bit about yourself"
                            className="resize-none h-28"
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

                <Button className="col-span-2" type="submit">
                  Submit
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
