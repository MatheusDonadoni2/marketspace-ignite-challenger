import { useCallback, useState } from "react";
import { TouchableOpacity } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ArrowRight, Tag } from "phosphor-react-native";
import { Heading, HStack, Text, useTheme, useToast, VStack } from "native-base";

import { api } from "@services/api";
import { AppError } from "@utils/AppErro";
import { ProductDTO } from "@dtos/ProductDTO";
import { AppNavigatorProps } from "@routes/app.routes";

export function MyProductsBanner() {
  const [isLoading, setIsLoading] = useState(false);
  const [userProductsData, setUserProductsData] = useState<ProductDTO[]>([]);

  const toast = useToast();
  const { colors } = useTheme();
  const navigation = useNavigation<AppNavigatorProps>();

  function handleGoToMyProducts() {
    navigation.navigate("myProducts");
  }

  async function fetchMyProducts() {
    try {
      setIsLoading(true);
      const { data } = await api.get("users/products");
      setUserProductsData(data);
    } catch (error) {
      const isAppErro = error instanceof AppError;
      const title = isAppErro
        ? error.message
        : "Não foi possível carregar os produtos do usuário.";

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
    <HStack
      bgColor="rgba(100, 122, 199, 0.1)"
      px={4}
      py={3}
      mt={3}
      rounded={6}
      alignItems="center"
      justifyContent={"space-between"}
    >
      <HStack w="126">
        <Tag size={22} weight="bold" color={colors.blue[500]} />
        <VStack flex={1} ml={4}>
          <Heading color={"gray.200"} fontSize={"lg"} fontFamily={"heading"}>
            {userProductsData.length}
          </Heading>
          <Text color={"gray.200"} fontSize={"xs"} fontFamily={"body"}>
            anúncios ativos
          </Text>
        </VStack>
      </HStack>
      <TouchableOpacity onPress={handleGoToMyProducts}>
        <HStack
          w={"111"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text color={"blue.500"} fontSize={"xs"} fontFamily={"heading"}>
            Meus anúncios
          </Text>
          <ArrowRight size={24} color={colors.blue[500]} />
        </HStack>
      </TouchableOpacity>
    </HStack>
  );
}
