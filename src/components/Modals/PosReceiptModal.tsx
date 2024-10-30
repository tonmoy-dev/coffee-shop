import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PosReceipt from "./PosReceipt";
import { useCartStore } from "@/stores/useCartStore";
import { useSellerStore } from "@/stores/useSellerStore";
import { serverURL } from "@/utils/serverURL";
import axios from "axios";
import { useSWRConfig } from "swr";
import { ProductDataProps } from "@/types/dataTypes";

interface SalesDataProps {
  date: string;
  total_sales: number;
  total_amount: number;
  seller_email: string | undefined;
  product_id: number;
}[]

export function PosReceiptModal({
  currencySign,
  filteredProducts,
  setFilteredProducts
}: {
  currencySign: string;
  filteredProducts: ProductDataProps[] | undefined;
  setFilteredProducts: React.Dispatch<React.SetStateAction<ProductDataProps[] | undefined>>
}) {
  const { cart, clearCart, calculateTotals } = useCartStore(state => state);
  const { seller, updateSeller } = useSellerStore((state) => state);
  const { cache, mutate } = useSWRConfig();

  async function addToSales(salesdata: any) {
    try {
      const res = await axios.post(`${serverURL}/api/daily-sales/`, salesdata);

      if (res.data) {
        mutate(`${serverURL}/api/daily-sales/${seller?.email}`);
      }
    } catch (err) {
      console.error("Error on updating daily sales:", err);
    }
  }

  async function addToSeller(salesdata: SalesDataProps[]) {
    const totalAmount = salesdata.reduce(
      (sum, item) => sum + Number(item.total_amount),
      0
    );
    const totalSales = salesdata.reduce(
      (sum, item) => sum + item.total_sales,
      0
    );
    try {
      if (seller) {
        const res = await axios.patch(`${serverURL}/api/sellers/${seller?.email}`, {
          total_income: seller?.total_income + totalAmount, total_sales: seller?.total_sales + totalSales
        });

        if (res.data) {
          mutate(`${serverURL}/api/sellers/${seller?.email}`);
          updateSeller({
            ...seller,
            total_income: seller?.total_income + totalAmount,
            total_sales: seller?.total_sales + totalSales
          })
        }
      }
    } catch (err) {
      console.error("Error on updating daily sales:", err);
    }
  }
  const handleCheckout = () => {
    const salesdata = cart.map(item => {
      const date = new Date().toISOString().slice(0, 10); // Current date in ISO format
      const total_sales = item.quantity;
      const total_amount = total_sales * Number(item?.price);
      return {
        date: date,
        total_sales: total_sales,
        total_amount: total_amount,
        seller_email: item.seller_email,
        product_id: item.product_id
      };
    });

    if (filteredProducts) {
      // restore the products
      setFilteredProducts([...filteredProducts, ...cart])
      // clear the cart
      clearCart();
    }

    if (salesdata) {
      addToSales(salesdata);
      addToSeller(salesdata)
    }

  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          type="submit"
          className="w-full rounded-md border"
          disabled={cart.length < 1}
          onClick={() => calculateTotals()}
        >
          Checkout
        </Button>
      </DialogTrigger>
      <DialogContent className="w-72 h-auto justify-items-center">
        <DialogHeader>
          <DialogTitle>
            <span className="sr-only">POS Receipt</span>
          </DialogTitle>
          <DialogDescription>
            {/* Anyone who has this link will be able to view this. */}
          </DialogDescription>
        </DialogHeader>
        {/* -- content -- */}
        <PosReceipt
          currencySign={currencySign}
        />
        <DialogFooter className="w-[50mm]">
          <DialogClose asChild>
            <Button type="button" variant="default" className="w-full" onClick={handleCheckout}>
              POS Print
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
