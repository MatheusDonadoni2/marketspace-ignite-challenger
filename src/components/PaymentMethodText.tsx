import { useState } from "react";
import { Text, HStack, useTheme, useToast } from "native-base";
import {
  Bank,
  Barcode,
  CreditCard,
  Money,
  QrCode,
} from "phosphor-react-native";

import { PaymentMethodsDTO } from "@dtos/PaymentMethodsDTO";
export function PaymentMethodText(method: PaymentMethodsDTO) {
  return (
    <HStack>
      {method === "boleto" && (
        <>
          <Barcode />
          <Text color={"gray.200"} ml={3}>
            Boleto
          </Text>
        </>
      )}
      {method === "pix" && (
        <>
          <QrCode />
          <Text color={"gray.200"} ml={3}>
            Pix
          </Text>
        </>
      )}
      {method === "cash" && (
        <>
          <Money />
          <Text color={"gray.200"} ml={3}>
            Dinheiro
          </Text>
        </>
      )}
      {method === "card" && (
        <>
          <CreditCard />
          <Text color={"gray.200"} ml={3}>
            Cartão de Crédito
          </Text>
        </>
      )}
      {method === "deposit" && (
        <>
          <Bank size={5} />
          <Text color={"gray.200"} ml={3}>
            Deposito Bancário
          </Text>
        </>
      )}
    </HStack>
  );
}
