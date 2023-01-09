import {
  Input as InputNativeBase,
  IInputProps,
  FormControl,
} from "native-base";

type Props = IInputProps & {
  errorMessage?: string | null;
};

export function Input({ errorMessage, isInvalid, ...rest }: Props) {
  const invalid = !!errorMessage || isInvalid;

  return (
    <FormControl isInvalid={invalid}>
      <InputNativeBase
        h={12}
        rounded={6}
        borderWidth={0}
        bgColor="gray.700"
        py={3}
        px={4}
        fontFamily="body"
        color="gray.100"
        fontSize="md"
        placeholderTextColor="gray.400"
        isInvalid={invalid}
        _invalid={{
          borderWidth: 1,
          borderColor: "red.500",
        }}
        _focus={{
          borderWidth: 1,
          borderColor: "blue.90",
        }}
        {...rest}
      />
      <FormControl.ErrorMessage _text={{ color: "red.500" }} color="red.500">
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  );
}
