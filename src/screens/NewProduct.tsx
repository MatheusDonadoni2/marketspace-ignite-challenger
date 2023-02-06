import * as yup from "yup";
import { useCallback, useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import {
  Image,
  Radio,
  Text,
  VStack,
  HStack,
  Center,
  Switch,
  Heading,
  useTheme,
  FlatList,
  Checkbox,
  useToast,
  Pressable,
  ScrollView,
  FormControl,
  Button as ButtonNativeBase,
} from "native-base";
import { ArrowLeft, Plus } from "phosphor-react-native";

import { AppNavigatorProps } from "@routes/app.routes";

import { ProductDTO } from "@dtos/ProductDTO";
import { PaymentMethodsDTO } from "@dtos/PaymentMethodsDTO";

import { api } from "@services/api";
import { AppError } from "@utils/AppErro";

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { TextArea } from "@components/TextArea";
import { useAuth } from "@hooks/useAuth";
import { Loading } from "@components/Loading";

type CardProductPhotoProps = {
  imgUrl: string;
};

type RouteProps = {
  isEdit: boolean;
  productId?: string;
};

const productSchema = yup.object({
  name: yup.string().required("Informe o título do anúncio."),
  description: yup.string().required("Informe a descrição do anúncio."),
  isNew: yup.string().required("Informe a condição do produto."),
  price: yup.number().required("Informe o preço do produto"),
  acceptTrade: yup.boolean(),
  paymentMethods: yup
    .array<PaymentMethodsDTO>(yup.string().defined())
    .min(1, "Defina ao menos um método de pagamento.")
    .required(),
});

type FormDataProps = yup.InferType<typeof productSchema>;
type ProductsPhotosProps = {
  imgUrl: string;
  name: string;
  uri: string;
  type: string;
};

export function NewProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [productData, setProductData] = useState<ProductDTO>({} as ProductDTO);
  const [productsPhotos, setProductsPhotos] = useState<ProductsPhotosProps[]>([
    { imgUrl: "", name: "", uri: "", type: "" },
  ]);

  const toast = useToast();
  const route = useRoute();
  const { colors } = useTheme();
  const navigation = useNavigation<AppNavigatorProps>();

  const { isEdit, productId } = route.params as RouteProps;

  const defaultValues = {
    name: "productData.name",
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(productSchema),
    defaultValues,
  });

  function CardProductPhoto({ imgUrl }: CardProductPhotoProps) {
    const { colors } = useTheme();

    return (
      <Pressable _pressed={{ opacity: 0.7 }} onPress={handleProductPhotoSelect}>
        <Center mr={1} h={100} w={100} bgColor={"gray.500"} rounded={6}>
          {imgUrl ? (
            <Image
              h={100}
              w={100}
              resizeMode="cover"
              alt={"Foto do produto"}
              source={{ uri: imgUrl }}
            />
          ) : (
            <Plus color={colors.gray[400]} />
          )}
        </Center>
      </Pressable>
    );
  }

  async function handleProductPhotoSelect() {
    const photoSelected = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      aspect: [4, 4],
      allowsMultipleSelection: true,
      selectionLimit: 3,
    });

    if (photoSelected.canceled) {
      return;
    }
    if (photoSelected.assets.length > 3) {
      toast.show({
        title: "Selecione no máximo três imagens",
        placement: "top",
        bgColor: "red.500",
      });
      return;
    }
    if (photoSelected.assets.length >= 3) {
      setProductsPhotos([]);
    } else {
      setProductsPhotos([{ imgUrl: "", name: "", uri: "", type: "" }]);
    }
    if (photoSelected.assets.length > 0) {
      photoSelected.assets.forEach(async (photo) => {
        const photoInfo = await FileSystem.getInfoAsync(photo.uri);
        if (photoInfo?.size && photoInfo.size / 1024 / 1024 > 5) {
          toast.show({
            title: "Essa imagem é muito grande",
            placement: "top",
            bgColor: "red.500",
          });
          return;
        }
        const fileExtension = photo.uri.split(".").pop();

        setProductsPhotos((prevState) =>
          prevState.concat({
            imgUrl: photoInfo.uri,
            name: `${photo.uri}.${fileExtension}`.toLowerCase(),
            uri: photo.uri,
            type: `${photo.type}/${fileExtension}`,
          })
        );
      });
    }
  }

  function handleGoToPreviewProduct(id: string) {
    navigation.navigate("previewProduct", {
      productId: id,
    });
  }

  function handleGoBack() {
    {
      if (isEdit && productId) {
        navigation.navigate("product", {
          isOwner: true,
          productId: productId,
        });
      } else {
        navigation.navigate("home");
      }
    }
  }

  async function handleNewProduct({
    name,
    description,
    isNew,
    price,
    acceptTrade,
    paymentMethods,
  }: FormDataProps) {
    try {
      setIsLoading(true);
      if (productsPhotos.length <= 1) {
        toast.show({
          title: "Nenhuma imagem selecionada",
          placement: "top",
          bgColor: "red.500",
        });
        return;
      }
      const { data } = await api.post("products/", {
        name,
        description,
        is_new: isNew === "new" ? true : false,
        price,
        is_active: false,
        accept_trade: acceptTrade,
        payment_methods: paymentMethods,
      });

      const photoData = new FormData();
      photoData.append("product_id", data.id);

      productsPhotos.forEach((item) => {
        item.imgUrl && photoData.append("images", item as any);
      });

      await api.post(`products/images/`, photoData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const defaultValues: FormDataProps = {
        name: "",
        description: "",
        isNew: "new",
        price: 0,
        acceptTrade: false,
        paymentMethods: [],
      };
      reset(defaultValues);
      setProductsPhotos([{ imgUrl: "", name: "", uri: "", type: "" }]);

      handleGoToPreviewProduct(data.id);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível criar o anúncio. Tente novamente mais tarde.";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchProduct() {
    try {
      setIsLoading(true);
      const { data } = await api.get(`products/${productId}`);
      setProductData({} as ProductDTO);
      setProductData(data);
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
    }
  }

  useFocusEffect(
    useCallback(() => {
      if (isEdit) {
        fetchProduct();
      }
    }, [productId])
  );

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <VStack flex={1} safeArea bgColor={"gray.600"}>
          <HStack mt={5} ml={6}>
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
            <Heading
              flex={1}
              color="gray.100"
              fontFamily={"heading"}
              fontSize={"lg"}
              textAlign="center"
            >
              Criar anúncio
            </Heading>
          </HStack>
          <ScrollView px={6}>
            <Text
              fontSize={"md"}
              fontFamily={"heading"}
              color={"gray.200"}
              mt={6}
            >
              Imagem
            </Text>
            <Text fontSize={"sm"} fontFamily={"body"} color={"gray.300"}>
              Escolha até 3 imagens para mostrar o quando o seu produto é
              incrível!
            </Text>

            <FlatList
              data={productsPhotos}
              keyExtractor={(item) => item.imgUrl}
              renderItem={({ item }) => (
                <CardProductPhoto imgUrl={item.imgUrl} />
              )}
              horizontal
              h={100}
              mt={4}
            />

            <Text fontSize={"md"} fontFamily={"heading"} color={"gray.200"}>
              Sobre o produto
            </Text>
            <Controller
              control={control}
              name={"name"}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Título do anúncio"
                  mt={4}
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name={"description"}
              render={({ field: { onChange, value } }) => (
                <TextArea
                  placeholder="Descrição do produto"
                  placeholderTextColor="gray.400"
                  fontSize="md"
                  bg="gray.100"
                  borderWidth={0}
                  py={3}
                  px={4}
                  h={160}
                  mt={4}
                  errorMessage={errors.description?.message}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />

            <Controller
              control={control}
              name={"isNew"}
              render={({ field: { onChange, value } }) => (
                <FormControl>
                  <Radio.Group
                    name="usedProduct"
                    accessibilityLabel="Condições do produto"
                    defaultValue="new"
                    colorScheme="blue"
                    value={value}
                    onChange={onChange}
                  >
                    <HStack mt={4} alignItems={"center"}>
                      <Radio
                        value={"new"}
                        borderColor={"gray.400"}
                        bgColor={"transparent"}
                        _text={{ fontSize: "sm" }}
                      >
                        Produto novo
                      </Radio>
                      <Radio
                        value={"used"}
                        borderColor={"gray.400"}
                        bgColor={"transparent"}
                        _text={{ fontSize: "sm" }}
                        ml={6}
                      >
                        Produto usado
                      </Radio>
                    </HStack>
                  </Radio.Group>
                  <FormControl.ErrorMessage
                    _text={{ color: "red.500" }}
                    color="red.500"
                  >
                    {errors.isNew?.message}
                  </FormControl.ErrorMessage>
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name={"price"}
              render={({ field: { onChange, value } }) => (
                <>
                  <Text
                    fontSize={"md"}
                    fontFamily={"heading"}
                    mt={9}
                    color={"gray.200"}
                  >
                    Venda
                  </Text>
                  <Input
                    placeholder="Valor do produto"
                    mt={4}
                    onChangeText={onChange}
                    value={value?.toString()}
                    errorMessage={errors.price?.message}
                    keyboardType="numeric"
                    leftElement={
                      <Text color={"gray.100"} fontSize={"md"} ml={4}>
                        R$
                      </Text>
                    }
                  />
                </>
              )}
            />

            <VStack width="full" alignItems={"flex-start"} mt={4}>
              <Text fontSize={"md"} fontFamily={"heading"} color={"gray.200"}>
                Aceita troca ?
              </Text>
              <Controller
                control={control}
                name={"acceptTrade"}
                render={({ field: { onChange, value } }) => (
                  <Switch
                    offThumbColor={"gray.700"}
                    offTrackColor={"gray.500"}
                    onThumbColor={"gray.700"}
                    onTrackColor={"blue.100"}
                    isChecked={value}
                    value={value}
                    onToggle={onChange}
                  />
                )}
              />
            </VStack>

            <VStack width="full" mt={4} mb={6}>
              <Text fontSize={"md"} fontFamily={"heading"} color={"gray.200"}>
                Meios de pagamento aceitos
              </Text>
              <Controller
                control={control}
                name="paymentMethods"
                render={({ field: { onChange, value } }) => (
                  <Checkbox.Group value={value} onChange={onChange}>
                    <Checkbox
                      value="boleto"
                      colorScheme="blue"
                      borderColor={"gray.400"}
                      borderWidth={1}
                      mt={3}
                      rounded="xs"
                    >
                      Boleto
                    </Checkbox>
                    <Checkbox
                      value="pix"
                      colorScheme="blue"
                      borderColor={"gray.400"}
                      borderWidth={1}
                      rounded="xs"
                    >
                      Pix
                    </Checkbox>
                    <Checkbox
                      value="cash"
                      colorScheme="blue"
                      borderColor={"gray.400"}
                      borderWidth={1}
                      rounded="xs"
                    >
                      Dinheiro
                    </Checkbox>
                    <Checkbox
                      value="card"
                      colorScheme="blue"
                      borderColor={"gray.400"}
                      borderWidth={1}
                      rounded="xs"
                    >
                      Cartão de Crédito
                    </Checkbox>
                    <Checkbox
                      value="deposit"
                      colorScheme="blue"
                      borderColor={"gray.400"}
                      borderWidth={1}
                      rounded="xs"
                    >
                      Depósito
                    </Checkbox>
                  </Checkbox.Group>
                )}
              />
            </VStack>
          </ScrollView>

          <HStack
            h={90}
            px={6}
            pt={5}
            pb={7}
            bg={"gray.700"}
            space={3}
            safeAreaBottom
          >
            <Button
              title="Avançar"
              colorScheme={"black"}
              onPress={handleSubmit(handleNewProduct)}
              isLoading={isLoading}
              flex={1}
            />
            <Button
              title="Cancelar"
              colorScheme={"gray"}
              onPress={handleGoBack}
              flex={1}
            />
          </HStack>
        </VStack>
      )}
    </>
  );
}
