import {
  Box,
  Button as ButtonNativeBase,
  HStack,
  IButtonProps,
  Text,
} from "native-base";

type Props = IButtonProps & {
  title: string;
  colorScheme?: "blue" | "gray" | "black";
};

export function Button({ title, colorScheme = "blue", ...rest }: Props) {
  return (
    <ButtonNativeBase
      w="full"
      h={12}
      bgColor={
        colorScheme === "blue"
          ? "blue.100"
          : colorScheme === "gray"
          ? "gray.500"
          : "gray.200"
      }
      _pressed={{
        bg:
          colorScheme === "blue"
            ? "blue.500"
            : colorScheme === "gray"
            ? "gray.400"
            : "gray.100",
      }}
      rounded={6}
      {...rest}
    >
      <Text
        fontSize="sm"
        fontFamily="heading"
        color={
          colorScheme === "blue"
            ? "gray.700"
            : colorScheme === "gray"
            ? "gray.200"
            : "gray.700"
        }
      >
        {title}
      </Text>
    </ButtonNativeBase>
  );
}
