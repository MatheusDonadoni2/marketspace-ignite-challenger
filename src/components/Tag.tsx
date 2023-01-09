import { Pressable, IPressableProps, Text } from "native-base";
import { XCircle } from "phosphor-react-native";

type Props = IPressableProps & {
  title: string;
  isChecked: boolean;
};

export function Tag({ title, isChecked, ...rest }: Props) {
  return (
    <Pressable
      {...rest}
      bgColor={isChecked ? "blue.100" : "gray.500"}
      px={4}
      flexDir={"row"}
      justifyContent={"center"}
      alignItems={"center"}
      rounded={"full"}
      _pressed={{
        opacity: 0.7,
      }}
    >
      <Text
        fontFamily={"heading"}
        fontSize={"xs"}
        color={isChecked ? "white" : "gray.300"}
        mr={isChecked ? "2" : "0"}
      >
        {title}
      </Text>
      {isChecked && <XCircle weight="fill" size={13} color="white" />}
    </Pressable>
  );
}
