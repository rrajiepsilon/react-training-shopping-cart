export interface ProductRating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: ProductRating;
}

export interface CartItem extends Product {
  quantity: number;
}

export type CouponCode = '' | 'SAVE10' | 'FLAT20';

export interface CartTotals {
  subtotal: number;
  tax: number;
  discount: number;
  couponCode: CouponCode;
  totalItems: number;
  grandTotal: number;
}

export interface CartState extends CartTotals {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  applyCoupon: (code: string) => void;
  clearCart: () => void;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  age: string;
  phone: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  name: {
    firstname: string;
    lastname: string;
  };
  address: {
    city: string;
    street: string;
    number: number;
    zip: string;
    geolocation: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
}

export interface RegisteredUser extends RegisterPayload {
  id: number;
}

export interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

export type PaymentMethod = 'card' | 'cod';

export interface ShippingAddress {
  label: string;
  name: string;
  line1: string;
  cityStateZip: string;
  country: string;
  phone: string;
}
