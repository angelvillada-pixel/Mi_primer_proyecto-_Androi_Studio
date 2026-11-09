export interface Rating {
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
  rating: Rating;
}

export interface UserName {
  firstname: string;
  lastname: string;
}

export interface UserAddress {
  city: string;
  street: string;
  number: number;
  zipcode: string;
  geolocation?: {
    lat: string;
    long: string;
  };
}

export interface User {
  id: number;
  email: string;
  username: string;
  password?: string;
  name: UserName;
  address: UserAddress;
  phone: string;
}

export interface CartItemProduct {
  product: Product;
  quantity: number;
}

export interface ApiCartItem {
  productId: number;
  quantity: number;
}

export interface ApiCart {
  id: number;
  userId: number;
  date: string;
  products: ApiCartItem[];
}
