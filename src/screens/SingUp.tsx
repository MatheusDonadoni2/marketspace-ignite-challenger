import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

import { Image, ScrollView, Text, useToast, VStack } from "native-base";

import { api } from "@services/api";
import { AppError } from "@utils/AppErro";

import logoPng from "@assets/logo.png";
import userPhotoDefaultPNG from "@assets/userPhotoDefault.png";

import { Input } from "@components/Input";
import { Avatar } from "@components/Avatar";
import { Button } from "@components/Button";

import { AuthNavigationRoutesProps } from "@routes/auth.routes";
import { useAuth } from "@hooks/useAuth";

type FormDataProps = {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirm: string;
};

type UserAvatarProps = {
  name: string;
  uri: string;
  type: string;
};

const signUpSchema = yup.object({
  name: yup.string().required("Informe o nome."),
  email: yup.string().required("Informe o email.").email("Email inválido."),
  phone: yup.string().required("Informe o telefone."),
  password: yup
    .string()
    .required("Informe a senha.")
    .min(6, "A senha deve ter o mínimo de seis dígitos"),
  password_confirm: yup
    .string()
    .required("Confirme a senha.")
    .oneOf([yup.ref("password"), null], "Senhas não conferem"),
});

export function SignUp() {
  const [userAvatar, setUserAvatar] = useState<UserAvatarProps>(
    {} as UserAvatarProps
  );
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { signIn } = useAuth();
  const navigation = useNavigation<AuthNavigationRoutesProps>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({ resolver: yupResolver(signUpSchema) });

  function handleGoBack() {
    navigation.goBack();
  }

  async function handleSignUp({ name, email, phone, password }: FormDataProps) {
    try {
      setIsLoading(true);
      const userData = new FormData();

      userData.append("name", name);
      userData.append("email", email);
      userData.append("password", password);
      userData.append("tel", phone);

      if (userAvatar.uri) {
        userData.append("avatar", userAvatar as any);
      }

      await api.post("/users", userData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.show({
        title: "Conta criado com sucesso",
        placement: "top",
        bgColor: "green.500",
      });

      await signIn(email, password);
    } catch (error) {
      const isAppErro = error instanceof AppError;
      const title = isAppErro
        ? error.message
        : "Não foi possível criar a conta. Tente novamente mais tarde";
      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUserPhotoSelect() {
    const photoSelected = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      aspect: [4, 4],
      allowsEditing: true,
    });

    if (photoSelected.canceled) {
      return;
    }

    if (photoSelected.assets[0].uri) {
      const photoInfo = await FileSystem.getInfoAsync(
        photoSelected.assets[0].uri
      );

      if (photoInfo?.size && photoInfo.size / 1024 / 1024 > 5) {
        return toast.show({
          title: "Essa imagem é muito grande",
          placement: "top",
          bgColor: "red.500",
        });
      }

      const fileExtension = photoSelected.assets[0].uri.split(".").pop();

      const photoFile = {
        name: `${"user.name"}.${fileExtension}`.toLowerCase(),
        uri: photoSelected.assets[0].uri,
        type: `${photoSelected.assets[0].type}/${fileExtension}`,
      };
      setUserAvatar(photoFile);

      toast.show({
        title: "Foto atualizada com sucesso",
        placement: "top",
        bgColor: "green.500",
      });
    }
  }

  return (
    <VStack safeArea bgColor={"gray.600"}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <VStack flex={1} px={12} pb={5}>
          <VStack alignItems="center" pt={16} w="full">
            <Image source={logoPng} alt="logo da empresa" />
            <Text fontSize="lg" fontFamily="heading" pt={6} color="gray.100">
              Boas vindas!
            </Text>
            <Text fontSize="sm" textAlign="center" pt={2} color="gray.300">
              Crie sua conta e use o espaço para comprar itens variados e vender
              seus produtos
            </Text>
          </VStack>
          <VStack flex={1} mt={8} alignItems="center">
            <Avatar
              size={24}
              urlImage={""}
              source={
                userAvatar.uri ? { uri: userAvatar.uri } : userPhotoDefaultPNG
              }
              alt="foto do usuário"
              edit={true}
              onPress={handleUserPhotoSelect}
            />

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Nome"
                  mt={4}
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Email"
                  mt={4}
                  keyboardType="email-address"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Telefone"
                  mt={4}
                  keyboardType="phone-pad"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.phone?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Senha"
                  mt={4}
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password_confirm"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Confirme a senha"
                  mt={4}
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.password_confirm?.message}
                />
              )}
            />

            <Button
              title="Criar"
              colorScheme="black"
              mt={6}
              isLoading={isLoading}
              onPress={handleSubmit(handleSignUp)}
            />

            <Text fontSize="sm" textAlign="center" pt={12}>
              Já tem uma conta?
            </Text>
            <Button
              title="Ir para o login"
              colorScheme="gray"
              mt={4}
              onPress={handleGoBack}
            />
          </VStack>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
