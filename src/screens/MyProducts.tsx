import { useCallback, useState } from "react";
import {
  CheckIcon,
  FlatList,
  Heading,
  HStack,
  Select,
  Text,
  VStack,
  Button,
  useTheme,
  useToast,
} from "native-base";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { Plus } from "phosphor-react-native";

import { AppError } from "@utils/AppErro";
import { AppNavigatorProps } from "@routes/app.routes";

import { api } from "@services/api";
import { ProductDTO } from "@dtos/ProductDTO";
import { CardProduct } from "@components/CardProduct";
import { Loading } from "@components/Loading";

type QueryParamsProps = {
  is_new?: boolean | undefined;
};

export function MyProducts() {
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<QueryParamsProps>(
    {} as QueryParamsProps
  );
  const [productsData, setProductsData] = useState<ProductDTO[]>([]);

  const toast = useToast();
  const { colors } = useTheme();
  const navigation = useNavigation<AppNavigatorProps>();

  const [stateProduct, SetStateProduct] = useState("");

  async function fetchMyProducts() {
    try {
      setIsLoading(true);
      const { data } = await api.get("/users/products/");
      setProductsData(data);
    } catch (error) {
      const isAppErro = error instanceof AppError;
      const title = isAppErro
        ? error.message
        : "Não foi possível carregas os produtos. Tente novamente mais tarde.";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchFilterMyProducts(value: string) {
    try {
      setIsLoading(true);
      let x;
      if (value === "allProducts") {
        x = {} as QueryParamsProps;
      } else if (value === "newProducts") {
        x = { is_new: true };
      } else if (value === "usedProducts") {
        x = { is_new: false };
      }

      SetStateProduct(value);

      const { data } = await api.get("/users/products/", {
        params: { is_new: false },
      });

      setProductsData(data);
    } catch (error) {
      const isAppErro = error instanceof AppError;
      const title = isAppErro
        ? error.message
        : "Não foi possível carregas os produtos. Tente novamente mais tarde.";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchMyProducts();
    }, [])
  );

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
          onPress={() => navigation.navigate("newProduct", { isEdit: false })}
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
        <Text>{`${productsData?.length} anúncios`}</Text>
        <Select
          h={9}
          minW={111}
          fontSize={"sm"}
          color="gray.100"
          placeholder={"Estado "}
          _selectedItem={{ endIcon: <CheckIcon size="5" /> }}
          selectedValue={stateProduct}
          onValueChange={(value) => {
            fetchFilterMyProducts(value);
          }}
        >
          <Select.Item value="allProducts" label="Todos" />
          <Select.Item value="newProducts" label="Novo" />
          <Select.Item value="usedProducts" label="Usado" />
        </Select>
      </HStack>
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={productsData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CardProduct
              data={item}
              onPress={() =>
                navigation.navigate("product", {
                  productId: item.id,
                  isOwner: true,
                })
              }
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
      )}
    </VStack>
  );
}
