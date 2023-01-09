import { UserDTO } from "./UserDTO";

type PaymentMethodsDTO = {
  key: string;
  name: string;
};

export type ProductDTO = {
  id: string;
  name: string;
  description: string;
  is_new: boolean;
  price: number;
  accept_trade: boolean;
  is_active: boolean;
  product_images: string[];
  payment_methods: PaymentMethodsDTO[];
  user: UserDTO;
};
