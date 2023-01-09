import { useNavigation } from "@react-navigation/native";
import {
  VStack,
  Button as ButtonNativeBase,
  HStack,
  useTheme,
  Heading,
  Text,
  ScrollView,
  Radio,
  Image,
  FlatList,
  Center,
  Checkbox,
  Switch,
} from "native-base";
import { ArrowLeft, Plus } from "phosphor-react-native";
import { TextArea } from "@components/TextArea";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

type CardProductPhotoProps = {
  imgUrl: string;
};

function CardProductPhoto({ imgUrl }: CardProductPhotoProps) {
  const { colors } = useTheme();
  return (
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
  );
}

const photos = [
  {
    imgUrl: "",
  },
  {
    imgUrl:
      "https://www.guller.com.br/1563-medium_default/t%C3%AAnis-vermelho-masculino-esportivo-treinos-casual-fitness-leve-macio-%C3%A1-prova-d%C2%B4%C3%A1gua.jpg",
  },
];

export function NewAnnouncement() {
  const { colors } = useTheme();
  const navigate = useNavigation();

  return (
    <VStack flex={1} safeArea bgColor={"gray.600"}>
      <HStack mt={5} ml={6}>
        <ButtonNativeBase
          w={6}
          h={6}
          p={0}
          variant={"unstyled"}
          _pressed={{ opacity: 0.1 }}
          onPress={() => navigate.goBack()}
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
        <Text fontSize={"md"} fontFamily={"heading"} color={"gray.200"} mt={6}>
          Imagem
        </Text>
        <Text fontSize={"sm"} fontFamily={"body"} color={"gray.300"}>
          Escolha até 3 imagens para mostrar o quando o seu produto é incrível!
        </Text>
        <FlatList
          data={photos}
          keyExtractor={(item) => item.imgUrl}
          renderItem={({ item }) => <CardProductPhoto imgUrl={item.imgUrl} />}
          horizontal
          h={100}
          mt={4}
        />

        <Text fontSize={"md"} fontFamily={"heading"} color={"gray.200"}>
          Sobre o produto
        </Text>

        <Input placeholder="Título do anúncio" mt={4} />

        <Radio.Group name="usedProduct" colorScheme="blue">
          <HStack mt={4} alignItems={"center"}>
            <Radio
              value="new"
              borderColor={"gray.400"}
              bgColor={"transparent"}
              _text={{ fontSize: "sm" }}
            >
              Produto novo
            </Radio>
            <Radio
              value="used"
              borderColor={"gray.400"}
              bgColor={"transparent"}
              _text={{ fontSize: "sm" }}
              ml={6}
            >
              Produto usado
            </Radio>
          </HStack>
        </Radio.Group>

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
        />
        <VStack width="full" alignItems={"flex-start"} mt={4}>
          <Text fontSize={"md"} fontFamily={"heading"} color={"gray.200"}>
            Aceita troca ?
          </Text>
          <Switch
            offThumbColor={"gray.700"}
            offTrackColor={"gray.500"}
            onThumbColor={"gray.700"}
            onTrackColor={"blue.100"}
            onToggle={() => console.log("Aceita troca")}
          />
        </VStack>
        <VStack width="full" mt={4} mb={6}>
          <Text fontSize={"md"} fontFamily={"heading"} color={"gray.200"}>
            Meios de pagamento aceitos
          </Text>
          <Checkbox
            value="Boleto"
            colorScheme="blue"
            borderColor={"gray.400"}
            borderWidth={1}
            mt={3}
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
            Cartão de Crédito
          </Checkbox>
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
        <Button title="Avançar" colorScheme={"black"} />
        <Button title="Cancelar" colorScheme={"gray"} />
      </HStack>
    </VStack>
  );
}
