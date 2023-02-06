import {
  Box,
  Heading,
  HStack,
  Image,
  Pressable,
  IPressableProps,
  Text,
  VStack,
  Center,
} from "native-base";
import { api } from "@services/api";
import { ProductDTO } from "@dtos/ProductDTO";
import { Avatar } from "@components/Avatar";

import productPhotoDefault from "@assets/productPhotoDefault.png";

type Props = IPressableProps & {
  data: ProductDTO;
};

export function CardProduct({ data, ...rest }: Props) {
  return (
    <Pressable w={160} h={143} {...rest}>
      <VStack h={100}>
        <Image
          flex={1}
          source={
            data.product_images.length > 0
              ? {
                  uri: `${api.defaults.baseURL}/images/${data.product_images[0].path}`,
                }
              : productPhotoDefault
          }
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
          {data.user?.avatar && (
            <Avatar
              urlImage={data.user.avatar}
              size={6}
              mt={1}
              ml={1}
              alt="Avatar usuário dono do anúncio"
              colorScheme="Secondary"
            />
          )}

          <Box
            w={50}
            h={17}
            rounded={50}
            bgColor={data.is_new ? "gray.200" : "blue.500"}
            alignItems={"center"}
            justifyItems={"center"}
            mt={1}
            mr={1}
          >
            <Text fontFamily={"heading"} color={"white"} fontSize={"lxs"}>
              {data.is_new ? "NOVO" : "USADO"}
            </Text>
          </Box>
        </HStack>
        {!data.is_active && data.is_active !== undefined && (
          <Center
            w={"full"}
            h={"full"}
            position="absolute"
            bgColor={"rgba(0, 0, 0, 0.614)"}
          >
            <Text color={"gray.700"} fontFamily={"body"} fontSize={"xs"}>
              ANÚNCIO DESATIVADO
            </Text>
          </Center>
        )}
      </VStack>
      <VStack mt={1}>
        <Text color={"gray.200"} fontSize={"sm"} numberOfLines={2}>
          {data.name}
        </Text>
        <HStack alignItems={"baseline"}>
          <Heading color={"gray.100"} fontSize={"xs"} fontFamily={"heading"}>
            R$
          </Heading>
          <Heading color={"gray.100"} fontSize={"md"} fontFamily={"heading"}>
            {data.price}
          </Heading>
        </HStack>
      </VStack>
    </Pressable>
  );
}
