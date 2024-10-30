import { SellerDataProps } from '@/types/dataTypes';
import { create } from 'zustand';


interface SellerState {
    seller: SellerDataProps | null;
    setSeller: (seller: SellerDataProps) => void;
    updateSeller: (updatedInfo: Partial<SellerDataProps>) => void;
    removeSeller: () => void;
}

export const useSellerStore = create<SellerState>((set) => ({
    seller: null,

    setSeller: (seller) => set({ seller }),

    updateSeller: (updatedInfo) => set((state) => ({
        seller: state.seller ? { ...state.seller, ...updatedInfo } : null,
    })),

    removeSeller: () => set({ seller: null }),
}));

