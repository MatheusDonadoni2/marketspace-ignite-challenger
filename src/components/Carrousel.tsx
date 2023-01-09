// import { ImagemCarrousel } from "@components/ImagemCarrousel";
import { Image, VStack } from "native-base";
import { Dimensions } from "react-native";
import CarouselSnap from "react-native-snap-carousel";

const SLIDER_WIDTH = Dimensions.get("window").width;
const ITEM_WIDTH = SLIDER_WIDTH * 0.88;

type PropsCarrouselItem = {
  item: {
    imgUrl: string;
  };
  index: number;
};

type Props = {
  imgUrl: { imgUrl: string }[];
  width?: number;
};

function CarrouselCardItem({ item, index }: PropsCarrouselItem) {
  return (
    <VStack>
      <Image
        w={"full"}
        h={"full"}
        alt={`imagem ${index} do produto.`}
        source={{ uri: item.imgUrl }}
      />
    </VStack>
  );
}

export function Carrousel({ imgUrl, width = ITEM_WIDTH }: Props) {
  return (
    <CarouselSnap
      data={imgUrl}
      renderItem={CarrouselCardItem}
      sliderWidth={SLIDER_WIDTH}
      itemWidth={width}
      showsHorizontalScrollIndicator
      useScrollView
    />
  );
}
