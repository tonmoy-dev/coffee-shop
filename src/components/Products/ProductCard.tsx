import { FilePenLineIcon, TrashIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { ProductDataProps } from "@/types/dataTypes";
import EditProduct from "./EditProduct";

interface ProductCardProps {
  product: ProductDataProps;
  onDelete: (productId: number) => void;
  sellerCurrency: string | undefined;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete, sellerCurrency }) => {
  const { product_id, name, image_src, image_alt, category, price, size, weight, description, variant, seller_id } =
    product;
  // define currency
  const currencySign = sellerCurrency;
  return (
    <div className="group relative">
      <div className="w-full overflow-hidden rounded-md bg-gray-200 lg:h-70">
        <Image
          width={200}
          height={200}
          src={image_src}
          alt={image_alt}
          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
        />
      </div>
      {/* -- Edit New Product -- */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default" size="icon" className="absolute top-2 left-2">
            <FilePenLineIcon className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full">
          <DialogTitle>Edit Product Details</DialogTitle>
          <EditProduct currency={sellerCurrency} product={product} />
        </DialogContent>
      </Dialog>

      {/* -- Alert dialog for removing product -- */}
      <AlertDialog>
        <AlertDialogTrigger asChild className="absolute top-2 right-2">
          <Button variant="destructive" size="icon" className="">
            <TrashIcon className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure to remove this product?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              product from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              onClick={() => onDelete(product_id)}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-700">{name}</h3>
          <p className="mt-1 text-sm text-gray-500">{variant}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">
            {Math.round(price)} <span className="uppercase">{currencySign}</span>
          </p>
          <p className="text-sm text-gray-500">{Math.round(weight)} gm</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
