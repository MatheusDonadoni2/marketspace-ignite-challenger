import { useState } from "react";
import {
  CheckIcon,
  FlatList,
  Heading,
  HStack,
  Select,
  Text,
  VStack,
  Button,
  Icon,
  useTheme,
} from "native-base";

import { CardAnnouncement } from "@components/CardAnnouncement";
import { Plus } from "phosphor-react-native";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorProps } from "@routes/app.routes";
import { NewAnnouncement } from "./NewAnnouncement";

export function MyAnnouncements() {
  const { colors } = useTheme();
  const navigation = useNavigation<AppNavigatorProps>();
  const data = [
    { name: "Product 1", isNew: false },
    { name: "Product 2", isNew: true },
    { name: "Product 3", isNew: true },
    { name: "Product 4", isNew: false },
    { name: "Product 5", isNew: true },
    { name: "Product 6", isNew: true },
    { name: "Product 7", isNew: false },
    { name: "Product 8", isNew: true },
    { name: "Product 9", isNew: true },
  ];
  const [stateProduct, SetStateProduct] = useState("");

  return (
    <VStack flex={1} safeArea bgColor={"gray.600"} px={6} pt={5}>
      <HStack>
        <Heading
          flex={1}
          color="gray.100"
          fontFamily={"heading"}
          fontSize={"lg"}
          textAlign="center"
        >
          Meus anúncios
        </Heading>
        <Button
          w={6}
          h={6}
          p={0}
          variant={"unstyled"}
          _pressed={{ opacity: 0.1 }}
          alignContent={"center"}
          onPress={() => navigation.navigate("newAnnouncement")}
        >
          <Plus color={colors.gray[100]} weight="bold" />
        </Button>
      </HStack>

      <HStack
        mt={8}
        h={9}
        color={"gray.200"}
        fontSize={"xs"}
        justifyContent={"space-between"}
      >
        <Text>9 anúncios</Text>
        <Select
          h={9}
          minW={111}
          fontSize={"sm"}
          color="gray.100"
          placeholder={"Estado "}
          _selectedItem={{ endIcon: <CheckIcon size="5" /> }}
          selectedValue={stateProduct}
          onValueChange={(value) => SetStateProduct(value)}
        >
          <Select.Item value="allProducts" label="Todos" />
          <Select.Item value="newProducts" label="Novo" />
          <Select.Item value="usedProducts" label="Usado" />
        </Select>
      </HStack>

      <FlatList
        data={data}
        keyExtractor={(item) => item.name}
        renderItem={(item) => (
          <CardAnnouncement
            isNew={item.item.isNew}
            onPress={() => navigation.navigate("myAnnouncement")}
          />
        )}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 24,
        }}
        mt={8}
        showsVerticalScrollIndicator={false}
        h="full"
      />
    </VStack>
  );
}
