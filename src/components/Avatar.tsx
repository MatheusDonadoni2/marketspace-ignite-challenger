import { Image, IImageProps, Button, useTheme, Center } from "native-base";
import { PencilSimpleLine } from "phosphor-react-native";

type Props = IImageProps & {
  size: number;
  edit?: boolean;
  colorScheme?: "Primary" | "Secondary";
  onPress?: () => Promise<void> | undefined;
};

export function Avatar({
  size,
  edit = false,
  onPress = undefined,
  colorScheme = "Primary",

  ...rest
}: Props) {
  const { colors } = useTheme();
  const iconColor = colors.gray[600];

  const editButtonSize = size / 2;
  const iconSize = size / 1.5;

  return (
    <Button variant={"unstyled"} position="relative" onPress={onPress} p={0}>
      <Image
        w={size}
        h={size}
        rounded="full"
        borderWidth={2}
        borderColor={colorScheme === "Primary" ? "blue.100" : "gray.700"}
        alt="Imagem do usuário"
        {...rest}
      />
      {edit && (
        <Center
          bgColor={colorScheme === "Primary" ? "blue.100" : "gray.700"}
          rounded="full"
          width={editButtonSize}
          height={editButtonSize}
          position="absolute"
          bottom={-0}
          right={-6}
        >
          <PencilSimpleLine color={iconColor} size={iconSize} />
        </Center>
      )}
    </Button>
  );
}
