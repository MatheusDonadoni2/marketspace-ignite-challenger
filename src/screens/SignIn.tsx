import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { VStack, Image, Text, Center, useToast } from "native-base";

import logoPNG from "@assets/logo.png";
import { useAuth } from "@hooks/useAuth";
import { AppError } from "@utils/AppErro";
import MarketspaceSVG from "@assets/marketspace.svg";
import { AuthNavigationRoutesProps } from "@routes/auth.routes";

import { Input } from "@components/Input";
import { Button } from "@components/Button";

type FormData = {
  email: string;
  password: string;
};

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();
  const { signIn } = useAuth();
  const navigation = useNavigation<AuthNavigationRoutesProps>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  async function handleSignIn({ email, password }: FormData) {
    try {
      setIsLoading(true);
      await signIn(email, password);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível entrar. Tente novamente mais tarde.";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <VStack flex={1} bgColor={"gray.700"} alignItems="center" safeArea>
      <VStack
        width="full"
        height={556}
        alignItems="center"
        bgColor={"gray.600"}
        roundedBottom={24}
      >
        <VStack mt={109} justifyContent="center" alignItems="center">
          <Image source={logoPNG} alt="logo da empresa" />
          <MarketspaceSVG />
          <Text color="gray.300" fontSize="sm" fontFamily="body">
            Seu espaço de compra e venda
          </Text>
        </VStack>

        <Center
          w={279}
          mt={76}
          flex={1}
          justifyContent="center"
          alignItems="center"
        >
          <Text color="gray.200" fontSize="sm" fontFamily="body">
            Acesse sua conta
          </Text>

          <Controller
            control={control}
            name="email"
            rules={{ required: "Informe o Email" }}
            render={({ field: { onChange, value } }) => (
              <Input
                mt={4}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="E-mail"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name={"password"}
            rules={{ required: "Informe a senha" }}
            render={({ field: { onChange, value } }) => (
              <Input
                mt={4}
                secureTextEntry={true}
                autoCapitalize="none"
                placeholder="Senha"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Button
            mt={8}
            title="Entrar"
            h={12}
            isLoading={isLoading}
            onPress={handleSubmit(handleSignIn)}
          />
        </Center>
      </VStack>
      <VStack
        w={279}
        h={76}
        mt={63}
        justifyContent="center"
        alignItems="center"
      >
        <Text color="gray.200" fontSize="sm" fontFamily="body">
          Ainda não tem acesso?
        </Text>
        <Button
          mt={4}
          title="Criar uma conta"
          colorScheme="gray"
          onPress={() => navigation.navigate("signUp")}
        />
      </VStack>
    </VStack>
  );
}
