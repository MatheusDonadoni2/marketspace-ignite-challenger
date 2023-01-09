import { TextArea, VStack } from "native-base";

export function Teste() {
  return (
    <VStack safeArea px={6} pt={6}>
      <TextArea
        aria-label="t1"
        numberOfLines={40}
        totalLines={40}
        lineHeight={1}
        placeholder="Invalid TextArea"
        isInvalid
        _dark={{
          placeholderTextColor: "gray.300",
        }}
        mb="5"
        autoCompleteType={false}
      />
    </VStack>
  );
}
