import { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import {
  HStack,
  VStack,
  Button as ButtonNativeBase,
  useTheme,
  Heading,
  Text,
  Center,
  ScrollView,
  Box,
  FlatList,
  Icon,
  useToast,
} from "native-base";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ArrowLeft, PencilSimpleLine, Tag } from "phosphor-react-native";

import { useAuth } from "@hooks/useAuth";
import { ProductDTO } from "@dtos/ProductDTO";
import { AppNavigatorProps } from "@routes/app.routes";

import { Button } from "@components/Button";
import { Avatar } from "@components/Avatar";
import { Carrousel } from "@components/Carrousel";
import { PaymentMethodText } from "@components/PaymentMethodText";
import { AppError } from "@utils/AppErro";
import { api } from "@services/api";

type ProductImageProps = {
  imgUrl: string;
};

type RouteParams = {
  productId: string;
};
type ProductImageResponseProps = {
  path: string;
};

export function PreviewProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [productData, setProductData] = useState<ProductDTO>({} as ProductDTO);

  const toast = useToast();
  const route = useRoute();
  const { user } = useAuth();
  const { colors } = useTheme();
  const SLIDER_WIDTH = Dimensions.get("window").width;
  const navigation = useNavigation<AppNavigatorProps>();

  const { productId } = route.params as RouteParams;

  const [productsImageData, setProductsImageData] = useState<
    ProductImageProps[]
  >([]);

  function handleGoToEditProduct() {
    navigation.navigate("newProduct", { isEdit: true, productId });
  }

  async function fetchProducts() {
    try {
      setIsLoading(true);
      const { data } = await api.get(`products/${productId}`);
      setProductData(data);

      let dataImg = data.product_images.map(
        (item: ProductImageResponseProps) => {
          return {
            imgUrl: `${api.defaults.baseURL}/images/${item?.path}`,
          };
        }
      );
      setProductData(data);
      setProductsImageData(dataImg);
    } catch (error) {
      const isAppErro = error instanceof AppError;
      const title = isAppErro
        ? error.message
        : "Não foi possível carregar o produto. Tente novamente mais tarde";
      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePublishedProduct() {
    try {
      setIsLoading(true);
      await api.patch(`products/${productId}`, {
        is_active: true,
      });
      navigation.navigate("myProducts");
    } catch (error) {
      const isAppErro = error instanceof AppError;
      const title = isAppErro
        ? error.message
        : "Não foi possível publicar o produto. Tente novamente mais tarde";
      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <VStack
        justifyContent="flex-start"
        alignItems="center"
        px={4}
        pt={10}
        pb={6}
        bg="blue.100"
      >
        <Heading fontSize="md" color="gray.700">
          Pré visualização do anúncio
        </Heading>
        <Text fontSize="sm" color="gray.700">
          É assim que seu produto vai aparecer!
        </Text>
      </VStack>
      <Center w={"full"} h={"280"}>
        <Carrousel imgUrl={productsImageData} width={SLIDER_WIDTH} />
      </Center>

      <ScrollView px={6}>
        <HStack mt={5} h={6} w={"full"} alignItems={"center"}>
          <Avatar size={6} urlImage={user.avatar} mr={2} />
          <Text fontSize={"sm"} color={"gray.100"}>
            {user.name}
          </Text>
        </HStack>
        <HStack mt={6} w={"full"} h={4}>
          <Box
            w={12}
            h={"full"}
            rounded={"full"}
            bgColor={productData.is_new ? "blue.100" : "gray.500"}
            alignItems={"center"}
          >
            <Text
              color={productData.is_new ? "white" : "gray.200"}
              fontSize={"lxs"}
              fontFamily={"heading"}
            >
              {productData.is_new ? "NOVO" : "USADO"}
            </Text>
          </Box>
        </HStack>

        <HStack mt={3} w={"full"} h={7} justifyContent={"space-between"}>
          <Text
            color={"gray.100"}
            fontSize={"lg"}
            fontFamily={"heading"}
            flex={1}
            numberOfLines={0.2}
          >
            {productData.name}
          </Text>
          <HStack alignItems={"baseline"}>
            <Text
              color={"blue.100"}
              fontSize={"sm"}
              fontFamily={"heading"}
              mr={1}
            >
              R$
            </Text>
            <Text color={"blue.100"} fontSize={"lg"} fontFamily={"heading"}>
              {productData.price}
            </Text>
          </HStack>
        </HStack>
        <Text color={"gray.200"} fontSize={"sm"} fontFamily={"body"}>
          {productData.description}
        </Text>
        <HStack mt={6}>
          <Text
            color={"gray.200"}
            fontSize={"sm"}
            fontFamily={"heading"}
            mr={1}
          >
            Aceita troca ?
          </Text>
          <Text color={"gray.200"} fontSize={"sm"} fontFamily={"body"} mr={1}>
            {productData.accept_trade ? "Sim" : "Não"}
          </Text>
        </HStack>
        <VStack mt={4}>
          <Text
            color={"gray.200"}
            fontSize={"sm"}
            fontFamily={"heading"}
            mr={1}
          >
            Meios de pagamento:
          </Text>
          <FlatList
            data={productData.payment_methods}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => <PaymentMethodText data={item} />}
          />
        </VStack>
      </ScrollView>
      <HStack w="full" bgColor={"white"} h={90} px={6} pt={5} pb={7} space={3}>
        <Button
          title="Voltar e editar"
          colorScheme={"gray"}
          leftIcon={<Icon as={<ArrowLeft color={colors.gray[200]} />} />}
          onPress={handleGoToEditProduct}
          flex={1}
        />
        <Button
          title="Publicar"
          leftIcon={<Icon as={<Tag color={colors.gray[700]} />} />}
          onPress={handlePublishedProduct}
          flex={1}
        />
      </HStack>
    </>
  );
}
