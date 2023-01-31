import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { generateUUIDV4 } from "@/utils/funcs";
import { LazyLoadImage } from "react-lazy-load-image-component";

const HomeCarousel = () => {
  const IMAGES = [
    require("@/assets/images/ad_1.jpeg"),
    require("@/assets/images/ad_2.jpeg"),
    require("@/assets/images/ad_3.jpeg"),
  ];
  return (
    <div>
      <Carousel autoPlay showStatus={false} showThumbs={false} infiniteLoop>
        {IMAGES.map((image) => (
          <div key={generateUUIDV4()}>
            <LazyLoadImage
              src={image}
              effect="blur"
              style={{
                height: 150,
                width: 500,
                objectFit: "cover",
                borderRadius: 5,
              }}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default HomeCarousel;
