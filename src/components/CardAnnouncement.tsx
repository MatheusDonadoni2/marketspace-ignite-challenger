import {
  Box,
  Heading,
  HStack,
  Image,
  Pressable,
  IPressableProps,
  Text,
  VStack,
} from "native-base";
import { Avatar } from "@components/Avatar";

type Props = IPressableProps & {
  isNew: boolean;
};

export function CardAnnouncement({ isNew, ...rest }: Props) {
  return (
    <Pressable w={160} h={143} {...rest}>
      <VStack h={100}>
        <Image
          flex={1}
          source={{
            uri: "https://img.irroba.com.br/fit-in/600x600/filters:fill(fff):quality(95)/lojaaieu/catalog/51.jpg",
          }}
          alt="Foto do produto anunciado"
          rounded={6}
          resizeMode={"cover"}
        />
        <HStack
          position="absolute"
          h={6}
          w={"full"}
          justifyContent={"space-between"}
        >
          <Avatar
            source={{
              uri: "data:image/jpeg;base64,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",
            }}
            size={6}
            mt={1}
            ml={1}
            alt="Avatar usuário dono do anúncio"
            colorScheme="Secondary"
          />
          <Box
            w={50}
            h={17}
            rounded={50}
            bgColor={isNew ? "gray.200" : "blue.500"}
            alignItems={"center"}
            justifyItems={"center"}
            mt={1}
            mr={1}
          >
            <Text fontFamily={"heading"} color={"white"} fontSize={"lxs"}>
              {isNew ? "NOVO" : "USADO"}
            </Text>
          </Box>
        </HStack>
      </VStack>
      <VStack mt={1}>
        <Text color={"gray.200"} fontSize={"sm"}>
          Tênis vermelho
        </Text>
        <HStack alignItems={"baseline"}>
          <Heading color={"gray.100"} fontSize={"xs"} fontFamily={"heading"}>
            R$
          </Heading>
          <Heading color={"gray.100"} fontSize={"md"} fontFamily={"heading"}>
            59,90
          </Heading>
        </HStack>
      </VStack>
    </Pressable>
  );
}
