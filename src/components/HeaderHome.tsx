import { HStack, VStack, Text, useTheme, Icon } from "native-base";
import { Avatar } from "@components/Avatar";
import { Button } from "@components/Button";
import { Plus } from "phosphor-react-native";
import { useNavigation } from "@react-navigation/native";

import { useAuth } from "@hooks/useAuth";
import { AppNavigatorProps } from "@routes/app.routes";

import { api } from "@services/api";

export function HeaderHome() {
  const { colors } = useTheme();
  const navigate = useNavigation<AppNavigatorProps>();
  const { user } = useAuth();
  return (
    <HStack flex={1} minH={12} maxH={12}>
      <Avatar
        size={12}
        h={"full"}
        mt={1}
        p={0}
        alt="foto de perfil do usuário!"
        urlImage={user.avatar}
      />
      <VStack flex={1} ml={2}>
        <Text fontSize={"md"} color={"gray.100"} fontFamily={"body"}>
          Boas vindas,{" "}
        </Text>
        <Text fontSize={"md"} color={"gray.100"} fontFamily={"heading"}>
          {user.name}
        </Text>
      </VStack>
      <HStack flex={1}>
        <Button
          onPress={() => navigate.navigate("newProduct", { isEdit: false })}
          colorScheme={"black"}
          title="Criar anúncio"
          ml={2}
          leftIcon={
            <Icon
              as={<Plus size={16} weight="bold" color={colors.gray[700]} />}
            />
          }
        />
      </HStack>
    </HStack>
  );
}
