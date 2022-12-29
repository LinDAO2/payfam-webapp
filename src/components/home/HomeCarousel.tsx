import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { generateUUIDV4 } from "@/utils/funcs";
import { LazyLoadImage } from "react-lazy-load-image-component";

const HomeCarousel = () => {
  const IMAGES = [
    "https://images.pexels.com/photos/1447418/pexels-photo-1447418.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/8369770/pexels-photo-8369770.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/9588219/pexels-photo-9588219.jpeg?auto=compress&cs=tinysrgb&w=800",
  ];
  return (
    <div>
      <Carousel autoPlay showStatus={false} showThumbs={false}>
        {IMAGES.map((image) => (
          <div key={generateUUIDV4()}>
            <LazyLoadImage src={image} effect="blur" />
            {/* <p className="legend">Legend 1</p> */}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default HomeCarousel;
