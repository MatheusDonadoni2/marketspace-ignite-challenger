import { Center, Image } from "native-base";

type Props = {
  indexImg: number;
};

export function ImagemCarrousel({ indexImg }: Props) {
  const img = [
    "https://www.guller.com.br/1563-medium_default/t%C3%AAnis-vermelho-masculino-esportivo-treinos-casual-fitness-leve-macio-%C3%A1-prova-d%C2%B4%C3%A1gua.jpg",
    "https://www.guller.com.br/1560-medium_default/t%C3%AAnis-vermelho-masculino-esportivo-treinos-casual-fitness-leve-macio-%C3%A1-prova-d%C2%B4%C3%A1gua.jpg",
    "https://www.guller.com.br/1562-large_default/t%C3%AAnis-vermelho-masculino-esportivo-treinos-casual-fitness-leve-macio-%C3%A1-prova-d%C2%B4%C3%A1gua.jpg",
    "https://www.guller.com.br/1564-large_default/t%C3%AAnis-vermelho-masculino-esportivo-treinos-casual-fitness-leve-macio-%C3%A1-prova-d%C2%B4%C3%A1gua.jpg",
  ];
  return (
    <Center w={"full"} h={"full"}>
      <Image
        w={"full"}
        h={"full"}
        source={{ uri: img[indexImg] }}
        alt="imagem carrossel"
        resizeMode="cover"
      />
    </Center>
  );
}
