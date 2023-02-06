export type PaymentMethodsDTO = {
  key: "boleto" | "pix" | "cash" | "card" | "deposit";
  name: string;
};
