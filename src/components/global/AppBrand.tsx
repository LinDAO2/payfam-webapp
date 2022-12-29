import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import logoMain from "@/assets/images/500x500.png";

interface Props {
  size?: "small" | "medium" | "large";
}
const AppBrand = ({ size }: Props) => {
  const smallSize = 30;
  const mediumSize = 50;
  const largeSize = 170;

  const SIZE =
    size === "small"
      ? smallSize
      : size === "medium"
      ? mediumSize
      : size === "large"
      ? largeSize
      : smallSize;
  return (
    <Link to="/">
      <LazyLoadImage
        effect="blur"
        style={{ objectFit: "cover", width: SIZE, height: SIZE }}
        src={logoMain}
      />
    </Link>
  );
};

export default AppBrand;
