import { PaymentMethodsDTO } from "./PaymentMethodsDTO";

type ProductsImageDTO = {
  id: string;
  path: string;
};

export type ProductDTO = {
  id: string;
  name: string;
  price: number;
  description: string;
  is_new: boolean;
  is_active: boolean;
  accept_trade: boolean;
  product_images: ProductsImageDTO[];
  payment_methods: PaymentMethodsDTO[];
  user: {
    avatar: string;
    name: string;
    tel: string;
  };
};
