import { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import {
  Divider,
  FlatList,
  Heading,
  HStack,
  Modal,
  Text,
  useTheme,
  VStack,
  Checkbox,
  Switch,
  useToast,
} from "native-base";
import { MagnifyingGlass, Sliders } from "phosphor-react-native";

import { api } from "@services/api";
import { AppError } from "@utils/AppErro";
import { ProductDTO } from "@dtos/ProductDTO";
import { AppNavigatorProps } from "@routes/app.routes";

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { HeaderHome } from "@components/HeaderHome";
import { Tag as TagComponent } from "@components/Tag";
import { CardProduct } from "@components/CardProduct";
import { MyProductsBanner } from "@components/MyProductsBanner";
import { Loading } from "@components/Loading";

type QueryParamsProps = {
  is_new?: boolean | undefined;
  acceptTrade?: boolean | undefined;
  paymentMethod?: Array<string> | undefined;
  query?: string | undefined;
};

export function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [filterIsNew, setFilterIsNew] = useState(true);
  const [filterIsUsed, setFilterIsUsed] = useState(true);
  const [filterAcceptTrada, setFilterAcceptTrada] = useState(false);
  const [filter, setFilter] = useState<QueryParamsProps>(
    {} as QueryParamsProps
  );

  const toast = useToast();

  const [productsData, setProductsData] = useState<ProductDTO[]>([]);

  const navigate = useNavigation<AppNavigatorProps>();

  async function fetchProducts() {
    try {
      setIsLoading(true);
      const { data } = await api.get("/products");
      setProductsData(data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar os produtos.";
      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }
  async function fetchFilterProducts() {
    try {
      setIsLoading(true);
      setOpenModal(false);
      console.log({ params: filter });
      const { data } = await api.get("/products", { params: filter });
      setProductsData(data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar os produtos.";
      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleSetFilterSearchText(text: string) {
    if (text.length > 0) {
      let newFilter = {
        ...filter,
        query: text,
      };

      setFilter(newFilter);
    }
  }

  function handleFilterIsNew(value: boolean) {
    setFilterIsNew(value);

    if (value && filterIsUsed) {
      let newFilter = filter;
      delete newFilter.is_new;

      setFilter(newFilter);
    } else if (value) {
      let newFilter = {
        ...filter,
        is_new: true,
      };
      setFilter(newFilter);
    } else if (filterIsUsed) {
      let newFilter = {
        ...filter,
        is_new: false,
      };
      setFilter(newFilter);
    } else {
      let newFilter = filter;
      delete newFilter.is_new;

      setFilter(newFilter);
    }
  }

  function handleFilterIsUsed(value: boolean) {
    setFilterIsUsed(value);

    if (filterIsNew && value) {
      let newFilter = filter;
      delete newFilter.is_new;

      setFilter(newFilter);
    } else if (value) {
      let newFilter = {
        ...filter,
        is_new: false,
      };
      setFilter(newFilter);
    } else if (filterIsNew) {
      let newFilter = {
        ...filter,
        is_new: true,
      };
    } else {
      let newFilter = filter;
      delete newFilter.is_new;

      setFilter(newFilter);
    }
  }

  function handleFilterAcceptTrade(value: boolean) {
    let newFilter = {
      ...filter,
      accept_trade: value,
    };

    setFilterAcceptTrada(value);

    setFilter(newFilter);
  }

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  return (
    <>
      <VStack flex={1} px={6} bgColor={"gray.600"} safeArea>
        <HeaderHome />
        <Text color="gray.300" fontSize="sm" mt={8}>
          Seus produtos anunciados para venda{" "}
        </Text>

        <MyProductsBanner />

        <Text color="gray.300" fontSize="sm" mt={8}>
          Compre produtos variados
        </Text>

        <Input
          mt={3}
          placeholder="Buscar anúncio"
          onChangeText={handleSetFilterSearchText}
          InputRightElement={
            <HStack pr={4}>
              <TouchableOpacity onPress={fetchFilterProducts}>
                <MagnifyingGlass size={20} weight={"bold"} />
              </TouchableOpacity>
              <Divider orientation="vertical" h={5} bg="gray.400" mx={3} />
              <TouchableOpacity onPress={() => setOpenModal(!openModal)}>
                <Sliders size={20} weight={"bold"} />
              </TouchableOpacity>
            </HStack>
          }
        />
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
                  navigate.navigate("product", {
                    productId: item.id,
                    isOwner: false,
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

      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        justifyContent={"flex-end"}
        size="lg"
        animationPreset="slide"
      >
        <Modal.Content w={"full"} marginTop={"auto"}>
          <Modal.Header borderBottomWidth={0} mt={12} p={0} px={6}>
            <Modal.CloseButton p={0} m={0} />
            <Text fontFamily={"heading"} color={"gray.100"} fontSize={"lg"}>
              Filtrar anúncios
            </Text>
          </Modal.Header>
          <Modal.Body px={6} py={0} pb={8} m={0}>
            <VStack mt={6}>
              <Text fontFamily={"heading"} color={"gray.200"} fontSize={"sm"}>
                Condição
              </Text>
              <HStack h={7} mt={3} space={3}>
                <TagComponent
                  title="NOVO"
                  isChecked={filterIsNew}
                  onPress={() => handleFilterIsNew(!filterIsNew)}
                />
                <TagComponent
                  title="USADO"
                  isChecked={filterIsUsed}
                  onPress={() => handleFilterIsUsed(!filterIsUsed)}
                />
              </HStack>
            </VStack>

            <VStack mt={6}>
              <Text fontFamily={"heading"} color={"gray.200"} fontSize={"sm"}>
                Aceita troca?
              </Text>
              <HStack h={7} mt={1}>
                <Switch
                  offThumbColor={"gray.700"}
                  offTrackColor={"gray.500"}
                  onThumbColor={"gray.700"}
                  onTrackColor={"blue.100"}
                  value={filterAcceptTrada}
                  onToggle={(value) => handleFilterAcceptTrade(value)}
                />
              </HStack>
            </VStack>

            <VStack mt={6}>
              <Text fontFamily={"heading"} color={"gray.200"} fontSize={"sm"}>
                Meios de pagamento aceitos
              </Text>
              <VStack mt={3}>
                <Checkbox
                  value="Boleto"
                  colorScheme="blue"
                  borderColor={"gray.400"}
                  borderWidth={1}
                  rounded="xs"
                >
                  Boleto
                </Checkbox>
                <Checkbox
                  value="Boleto"
                  colorScheme="blue"
                  borderColor={"gray.400"}
                  borderWidth={1}
                  rounded="xs"
                >
                  Pix
                </Checkbox>
                <Checkbox
                  value="Boleto"
                  colorScheme="blue"
                  borderColor={"gray.400"}
                  borderWidth={1}
                  rounded="xs"
                >
                  Dinheiro
                </Checkbox>
                <Checkbox
                  value="Boleto"
                  colorScheme="blue"
                  borderColor={"gray.400"}
                  borderWidth={1}
                  rounded="xs"
                >
                  Cartão de Crédito
                </Checkbox>
                <Checkbox
                  value="Boleto"
                  colorScheme="blue"
                  borderColor={"gray.400"}
                  borderWidth={1}
                  rounded="xs"
                >
                  Cartão de Debito
                </Checkbox>
              </VStack>
            </VStack>
          </Modal.Body>
          <Modal.Footer borderTopWidth={0} h={12} p={0} px={6} mb={8}>
            <Button
              title="Resetar filtros"
              colorScheme={"gray"}
              flex={1}
              mr={3}
            />
            <Button
              title="Aplicar filtros"
              colorScheme={"black"}
              flex={1}
              onPress={fetchFilterProducts}
            />
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
}
