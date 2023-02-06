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

type PaymentMethodTextProps = {
  data: PaymentMethodsDTO;
};

export function PaymentMethodText({ data }: PaymentMethodTextProps) {
  return (
    <HStack>
      {data.key === "boleto" && (
        <>
          <Barcode />
          <Text color={"gray.200"} ml={3}>
            {data.name}
          </Text>
        </>
      )}
      {data.key === "pix" && (
        <>
          <QrCode />
          <Text color={"gray.200"} ml={3}>
            {data.name}
          </Text>
        </>
      )}
      {data.key === "cash" && (
        <>
          <Money />
          <Text color={"gray.200"} ml={3}>
            {data.name}
          </Text>
        </>
      )}
      {data.key === "card" && (
        <>
          <CreditCard />
          <Text color={"gray.200"} ml={3}>
            {data.name}
          </Text>
        </>
      )}
      {data.key === "deposit" && (
        <>
          <Bank />
          <Text color={"gray.200"} ml={3}>
            {data.name}
          </Text>
        </>
      )}
    </HStack>
  );
}
