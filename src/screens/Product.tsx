import { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  HStack,
  Heading,
  VStack,
  useTheme,
  Button as ButtonNativeBase,
  Center,
  ScrollView,
  Text,
  Box,
  StatusBar,
  Icon,
  useToast,
  FlatList,
} from "native-base";
import { Dimensions, Linking } from "react-native";

import {
  ArrowLeft,
  PencilSimpleLine,
  Power,
  Trash,
} from "phosphor-react-native";

import UserPhotoDefaultPng from "@assets/userPhotoDefault.png";
import WhatsAppIconFilledSvg from "@assets/WhatsAppIconFilled.svg";

import { api } from "@services/api";
import { useAuth } from "@hooks/useAuth";
import { AppError } from "@utils/AppErro";
import { ProductDTO } from "@dtos/ProductDTO";
import { AppNavigatorProps } from "@routes/app.routes";

import { Avatar } from "@components/Avatar";
import { Button } from "@components/Button";
import { Carrousel } from "@components/Carrousel";
import { PaymentMethodText } from "@components/PaymentMethodText";
import { Loading } from "@components/Loading";

type RouteParamsProps = {
  productId: string;
  isOwner: boolean;
};

type ProductImageResponseProps = {
  path: string;
};

type ProductImageProps = {
  imgUrl: string;
};

export function Product() {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [productData, setProductData] = useState<ProductDTO>({} as ProductDTO);

  const toast = useToast();
  const { user } = useAuth();
  const { colors } = useTheme();
  const [productsImageData, setProductsImageData] = useState<
    ProductImageProps[]
  >([]);

  const navigation = useNavigation<AppNavigatorProps>();

  const route = useRoute();
  const { productId, isOwner } = route.params as RouteParamsProps;

  const SLIDER_WIDTH = Dimensions.get("window").width;

  function handleGoBack() {
    {
      isOwner ? navigation.navigate("myProducts") : navigation.navigate("home");
    }
  }

  async function fetchProduct() {
    try {
      setIsLoading(true);
      const { data } = await api.get(`products/${productId}`);

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
        : "Não foi possível carregar os dados do produto.";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  }

  async function handleDeleteProduct() {
    try {
      setIsLoading(true);
      await api.delete(`/products/${productId}`);
      handleGoBack();
    } catch (error) {
      const isAppErro = error instanceof AppError;
      const title = isAppErro
        ? error.message
        : "Não foi possível deletar este produto. Tente novamente mais tarde";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleActiveProduct() {
    try {
      setIsLoading(true);
      await api.patch(`/products/${productId}`, {
        is_active: !productData.is_active,
      });
      await fetchProduct();

      toast.show({
        title: "Produto atualizado com sucesso.",
        placement: "top",
        bgColor: "green.500",
      });
    } catch (error) {
      const isAppErro = error instanceof AppError;
      const title = isAppErro
        ? error.message
        : "Não foi possível concluir a ação. Tente novamente mais tarde";
      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleWhatsAppContact() {
    await Linking.openURL(`https://wa.me/${productData.user.tel}`);
  }

  useEffect(() => {
    setIsInitialLoading(true);
    fetchProduct();
  }, [productId]);

  return (
    <>
      {isInitialLoading ? (
        <Loading />
      ) : (
        <VStack flex={1} h={6} safeArea bg={"gray.600"}>
          <HStack mt={5} mx={6} justifyContent={"space-between"}>
            <ButtonNativeBase
              w={6}
              h={6}
              p={0}
              variant={"unstyled"}
              _pressed={{ opacity: 0.1 }}
              onPress={handleGoBack}
            >
              <ArrowLeft color={colors.gray[100]} weight="bold" />
            </ButtonNativeBase>
            {isOwner && (
              <ButtonNativeBase
                w={6}
                h={6}
                p={0}
                variant={"unstyled"}
                _pressed={{ opacity: 0.1 }}
                onPress={() =>
                  navigation.navigate("newProduct", {
                    isEdit: true,
                    productId,
                  })
                }
              >
                <PencilSimpleLine color={colors.gray[100]} weight="bold" />
              </ButtonNativeBase>
            )}
          </HStack>
          <Center w={"full"} h={"280"} mt={3}>
            {isInitialLoading ? (
              <Loading />
            ) : (
              <>
                <Carrousel imgUrl={productsImageData} width={SLIDER_WIDTH} />
                {!productData.is_active && isOwner && (
                  <Center
                    w={"full"}
                    h={"full"}
                    position="absolute"
                    bgColor={"rgba(0, 0, 0, 0.614)"}
                  >
                    <Text
                      color={"gray.700"}
                      fontFamily={"heading"}
                      fontSize={"sm"}
                    >
                      ANÚNCIO DESATIVADO
                    </Text>
                  </Center>
                )}
              </>
            )}
          </Center>
          <VStack px={6} flex={1}>
            <HStack mt={5} h={6} alignItems={"center"}>
              <Avatar
                urlImage={
                  isOwner
                    ? user.avatar
                    : productData.user
                    ? productData?.user.avatar
                    : ""
                }
                size={6}
                mr={2}
              />

              <Text fontSize={"sm"} color={"gray.100"}>
                {isOwner ? user.name : productData.user.name}
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
              <Text color={"gray.100"} fontSize={"lg"} fontFamily={"heading"}>
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
            <VStack mt={4} flex={1}>
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
          </VStack>
          {isOwner ? (
            <VStack px={6} mb={8} space={2}>
              <Button
                title={
                  productData.is_active
                    ? "Desativar anúncio"
                    : "Reativar anúncio"
                }
                colorScheme={productData.is_active ? "black" : "blue"}
                leftIcon={
                  <Icon as={<Power color={colors.gray[600]} size={16} />} />
                }
                onPress={handleActiveProduct}
                isLoading={isLoading}
              />
              <Button
                title="Excluir anúncio"
                colorScheme={"gray"}
                leftIcon={
                  <Icon as={<Trash color={colors.gray[300]} size={16} />} />
                }
                onPress={handleDeleteProduct}
                isLoading={isLoading}
              />
            </VStack>
          ) : (
            <HStack
              px={6}
              h={90}
              pt={5}
              pb={7}
              space={16}
              bgColor={"white"}
              justifyContent={"space-between"}
            >
              <HStack alignItems={"baseline"}>
                <Text
                  color={"blue.100"}
                  fontSize={"sm"}
                  fontFamily={"heading"}
                  mr={1}
                >
                  R$
                </Text>
                <Text color={"blue.500"} fontSize={"xl"} fontFamily={"heading"}>
                  {productData.price}
                </Text>
              </HStack>
              <Button
                title="Entrar em contato"
                colorScheme={"blue"}
                leftIcon={<Icon as={<WhatsAppIconFilledSvg />} />}
                onPress={handleWhatsAppContact}
                isLoading={isLoading}
                flex={1}
              />
            </HStack>
          )}
        </VStack>
      )}
    </>
  );
}
