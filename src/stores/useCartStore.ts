
import { ProductDataProps } from '@/types/dataTypes';
import { create } from 'zustand';

// export interface ProductDataProps extends ProductDataProps {
//     quantity: number;
// }

interface CartState {
    cart: ProductDataProps[];
    addToCart: (product: ProductDataProps) => void;
    removeFromCart: (product_id: number) => void;
    increaseQuantity: (product_id: number) => void;
    decreaseQuantity: (product_id: number) => void;
    clearCart: () => void;
    total: number;
    subtotal: number;
    discountRate: number;
    taxRate: number;
    setDiscountRate: (rate: number) => void;
    setTaxRate: (rate: number) => void;
    calculateTotals: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
    cart: [],
    total: 0,
    subtotal: 0,
    discountRate: 0,
    taxRate: 0,

    addToCart: (product) => set((state) => {
        const existingProduct = state.cart.find((item) => item.product_id === product.product_id);

        if (!existingProduct) {
            const newCart = [...state.cart, { ...product, quantity: 1 }];
            const newSubtotal = state.subtotal + Number(product.price);

            return {
                cart: newCart,
                subtotal: newSubtotal,
            };
        }

        return state;
    }),

    removeFromCart: (product_id) => set((state) => {
        const newCart = state.cart.filter((item) => item.product_id !== product_id);
        const removedProduct = state.cart.find((item) => item.product_id === product_id);
        const newSubtotal = removedProduct ? state.subtotal - (Number(removedProduct.price) * removedProduct?.quantity) : state.subtotal;

        return {
            cart: newCart,
            subtotal: newSubtotal >= 0 ? newSubtotal : 0,
        };
    }),

    increaseQuantity: (product_id) => set((state) => {
        const updatedCart = state.cart.map((item) => {
            if (item.product_id === product_id) {
                const updatedQuantity = item?.quantity + 1;
                return { ...item, quantity: updatedQuantity };
            }
            return item;
        });

        const product = state.cart.find((item) => item.product_id === product_id);
        const newSubtotal = product ? state.subtotal + Number(product.price) : state.subtotal;

        return {
            cart: updatedCart,
            subtotal: newSubtotal,
        };
    }),

    decreaseQuantity: (product_id) => set((state) => {
        const updatedCart = state.cart.map((item) => {
            if (item.product_id === product_id) {
                const updatedQuantity = item.quantity > 1 ? item.quantity - 1 : 1;
                return { ...item, quantity: updatedQuantity };
            }
            return item;
        });

        const product = state.cart.find((item) => item.product_id === product_id);
        const newSubtotal = product
            ? product?.quantity > 1
                ? state.subtotal - Number(product.price)
                : state.subtotal
            : state.subtotal;

        return {
            cart: updatedCart,
            subtotal: newSubtotal >= 0 ? newSubtotal : 0,
        };
    }),

    clearCart: () => set({
        cart: [],
        subtotal: 0,
        total: 0,
    }),

    setDiscountRate: (rate) => set({
        discountRate: rate,
    }),

    setTaxRate: (rate) => set({
        taxRate: rate,
    }),

    calculateTotals: () => set((state) => {
        const discount = state.subtotal * (state.discountRate / 100);
        const discountedSubtotal = state.subtotal - discount;
        const tax = discountedSubtotal * (state.taxRate / 100);
        const newTotal = discountedSubtotal + tax;

        return {
            total: newTotal >= 0 ? newTotal : 0,
        };
    }),
}));
