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
} from "native-base";
import { Dimensions } from "react-native";
import {
  ArrowLeft,
  PencilSimpleLine,
  Power,
  Trash,
} from "phosphor-react-native";

import { Avatar } from "@components/Avatar";
import { Carrousel } from "@components/Carrousel";
import { Button } from "@components/Button";

function handleGoBack() {}

export function MyAnnouncement() {
  const { colors } = useTheme();

  const carrouselItems = [
    {
      imgUrl:
        "https://www.guller.com.br/1563-medium_default/t%C3%AAnis-vermelho-masculino-esportivo-treinos-casual-fitness-leve-macio-%C3%A1-prova-d%C2%B4%C3%A1gua.jpg",
    },
    {
      imgUrl:
        "https://www.guller.com.br/1560-medium_default/t%C3%AAnis-vermelho-masculino-esportivo-treinos-casual-fitness-leve-macio-%C3%A1-prova-d%C2%B4%C3%A1gua.jpg",
    },
    {
      imgUrl:
        "https://www.guller.com.br/1562-large_default/t%C3%AAnis-vermelho-masculino-esportivo-treinos-casual-fitness-leve-macio-%C3%A1-prova-d%C2%B4%C3%A1gua.jpg",
    },
    {
      imgUrl:
        "https://www.guller.com.br/1564-large_default/t%C3%AAnis-vermelho-masculino-esportivo-treinos-casual-fitness-leve-macio-%C3%A1-prova-d%C2%B4%C3%A1gua.jpg",
    },
  ];

  const SLIDER_WIDTH = Dimensions.get("window").width;
  return (
    <VStack flex={1} h={6} safeArea bg={"gray.600"}>
      <HStack mt={5} mx={6} justifyContent={"space-between"}>
        <ButtonNativeBase
          w={6}
          h={6}
          p={0}
          variant={"unstyled"}
          _pressed={{ opacity: 0.1 }}
          onPress={() => handleGoBack()}
        >
          <ArrowLeft color={colors.gray[100]} weight="bold" />
        </ButtonNativeBase>

        <ButtonNativeBase
          w={6}
          h={6}
          p={0}
          variant={"unstyled"}
          _pressed={{ opacity: 0.1 }}
        >
          <PencilSimpleLine color={colors.gray[100]} weight="bold" />
        </ButtonNativeBase>
      </HStack>
      <Center w={"full"} h={"280"} mt={3}>
        <Carrousel imgUrl={carrouselItems} width={SLIDER_WIDTH} />
      </Center>
      <ScrollView px={6}>
        <HStack mt={5} h={6} alignItems={"center"}>
          <Avatar
            size={6}
            source={{
              uri: "https://img.irroba.com.br/fit-in/600x600/filters:fill(fff):quality(95)/lojaaieu/catalog/51.jpg",
            }}
            mr={2}
          />
          <Text fontSize={"sm"} color={"gray.100"}>
            Makenna Baptista
          </Text>
        </HStack>
        <HStack mt={6} w={"full"} h={4}>
          <Box
            w={12}
            h={"full"}
            rounded={"full"}
            bgColor={"gray.500"}
            alignItems={"center"}
          >
            <Text color={"gray.200"} fontSize={"lxs"} fontFamily={"heading"}>
              NOVO
            </Text>
          </Box>
        </HStack>

        <HStack mt={3} w={"full"} h={7} justifyContent={"space-between"}>
          <Text color={"gray.100"} fontSize={"lg"} fontFamily={"heading"}>
            Tênis vermelho
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
              120,00
            </Text>
          </HStack>
        </HStack>
        <Text color={"gray.200"} fontSize={"sm"} fontFamily={"body"}>
          Cras congue cursus in tortor sagittis placerat nunc, tellus arcu.
          Vitae ante leo eget maecenas urna mattis cursus. Mauris metus amet
          nibh mauris mauris accumsan, euismod. Aenean leo nunc, purus iaculis
          in aliquam.
        </Text>
        <VStack mt={4}>
          <Text
            color={"gray.200"}
            fontSize={"sm"}
            fontFamily={"heading"}
            mr={1}
          >
            Meios de pagamento:
          </Text>
        </VStack>

        <Button
          title="Desativar anúncio"
          colorScheme={"black"}
          mt={8}
          leftIcon={<Icon as={<Power color={colors.gray[600]} size={16} />} />}
        />
        <Button
          title="Excluir anúncio"
          colorScheme={"gray"}
          mt={2}
          leftIcon={<Icon as={<Trash color={colors.gray[300]} size={16} />} />}
        />
      </ScrollView>
    </VStack>
  );
}
