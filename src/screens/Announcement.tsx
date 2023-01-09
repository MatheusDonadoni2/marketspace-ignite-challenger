import { useNavigation } from "@react-navigation/native";
import {
  Box,
  Button as ButtonNativeBase,
  Center,
  HStack,
  Icon,
  Image,
  ScrollView,
  Text,
  useTheme,
  VStack,
} from "native-base";
import { ArrowLeft } from "phosphor-react-native";

import { Button } from "@components/Button";

import { Avatar } from "@components/Avatar";

import WhatsAppIconFilledSvg from "@assets/WhatsAppIconFilled.svg";
import { Carrousel } from "@components/Carrousel";

export function Announcement() {
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

  const navigate = useNavigation();
  return (
    <VStack flex={1} h={6} safeArea bg={"gray.600"}>
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
      </HStack>
      <Center w={"full"} h={280} mt={3}>
        <Carrousel imgUrl={carrouselItems} />
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

        <HStack mt={6}>
          <Text
            color={"gray.200"}
            fontSize={"sm"}
            fontFamily={"heading"}
            mr={1}
          >
            Aceita troca?
          </Text>
          <Text color={"gray.200"} fontSize={"sm"} fontFamily={"body"}>
            sim
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
        </VStack>
      </ScrollView>
      <HStack
        w={"full"}
        h={24}
        px={6}
        justifyContent={"space-between"}
        alignItems={"center"}
        bgColor={"gray.700"}
      >
        <HStack alignItems={"center"}>
          <Text
            color={"blue.500"}
            fontSize={"sm"}
            fontFamily={"heading"}
            mr={1}
          >
            R$
          </Text>
          <Text color={"blue.500"} fontSize={"lg"} fontFamily={"heading"}>
            120,00
          </Text>
        </HStack>
        <Box w={189}>
          <Button
            title="Entrar em contato"
            leftIcon={<Icon as={<WhatsAppIconFilledSvg />} />}
          />
        </Box>
      </HStack>
    </VStack>
  );
}
