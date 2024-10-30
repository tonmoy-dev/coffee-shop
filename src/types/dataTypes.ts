export interface ProductDataProps {
    imageAlt: string;
    product_id: number;
    name: string;
    image_src: string;
    image_alt: string;
    category: string;
    price: number;
    size: string;
    weight: number;
    description: string;
    variant: string;
    seller_id?: number;
    seller_email?: string;
    quantity: number;
}

export interface SellerDataProps {
    seller_id: number;
    product_category: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    street_address: string;
    city: string;
    state: string;
    postal_code: string;
    bio: string;
    country: string;
    currency: string;
    tax_rates: number;
    total_sales: number;
    total_products: number;
    total_income: number;
}

export interface DailySalesDataProps {
    // sales_id: number;
    seller_id: number;
    product_id: number;
    product_name: string;
    product_price: number;
    product_size: string;
    product_variant: string;
    date: Date;
    total_sales: number;
    total_amount: number;
}