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
import {
  Tag,
  ArrowRight,
  MagnifyingGlass,
  Divide,
  Sliders,
  XCircle,
} from "phosphor-react-native";

import { api } from "@services/api";
import { AppError } from "@utils/AppErro";
import { AppNavigatorProps } from "@routes/app.routes";

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { HeaderHome } from "@components/HeaderHome";
import { Tag as TagComponent } from "@components/Tag";
import { CardAnnouncement } from "@components/CardAnnouncement";

export function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [filterIsNew, setFilterIsNew] = useState(true);
  const [filterIsUsed, setFilterIsUsed] = useState(true);

  const toast = useToast();

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

  const [productsData, setProductsData] = useState();

  const { colors } = useTheme();
  const navigate = useNavigation<AppNavigatorProps>();

  async function fetchProduct() {
    try {
      setIsLoading(true);
      const response = await api.get("/users/products");
      console.log(response.data);
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

  useFocusEffect(
    useCallback(() => {
      fetchProduct();
    }, [])
  );

  return (
    <>
      <VStack flex={1} px={6} bgColor={"gray.600"} safeArea>
        <HeaderHome />
        <Button
          title="fetchProduct"
          onPress={() => fetchProduct()}
          isLoading={isLoading}
        />
        <Text color="gray.300" fontSize="sm" mt={8}>
          Seus produtos anunciados para venda{" "}
        </Text>
        <HStack
          bgColor="#dfe1ea"
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
              <Heading
                color={"gray.200"}
                fontSize={"lg"}
                fontFamily={"heading"}
              >
                4
              </Heading>
              <Text color={"gray.200"} fontSize={"xs"} fontFamily={"body"}>
                anúncios ativos
              </Text>
            </VStack>
          </HStack>
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
        </HStack>
        <Text color="gray.300" fontSize="sm" mt={8}>
          Compre produtos variados
        </Text>

        <Input
          mt={3}
          placeholder="Buscar anúncio"
          InputRightElement={
            <HStack pr={4}>
              <TouchableOpacity onPress={() => console.log("Search")}>
                <MagnifyingGlass size={20} weight={"bold"} />
              </TouchableOpacity>
              <Divider orientation="vertical" h={5} bg="gray.400" mx={3} />
              <TouchableOpacity onPress={() => setOpenModal(!openModal)}>
                <Sliders size={20} weight={"bold"} />
              </TouchableOpacity>
            </HStack>
          }
        />

        <FlatList
          data={data}
          keyExtractor={(item) => item.name}
          renderItem={(item) => (
            <CardAnnouncement
              isNew={item.item.isNew}
              onPress={() => navigate.navigate("announcement")}
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
                  onPress={() => setFilterIsNew(!filterIsNew)}
                />
                <TagComponent
                  title="USADO"
                  isChecked={filterIsUsed}
                  onPress={() => setFilterIsUsed(!filterIsUsed)}
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
                  // onToggle={() => }
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
            <Button title="Aplicar filtros" colorScheme={"black"} flex={1} />
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
}
