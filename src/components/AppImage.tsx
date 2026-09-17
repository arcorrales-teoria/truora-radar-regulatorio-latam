import type { ImgHTMLAttributes } from "react";

type AppImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  priority?: boolean;
};

export default function AppImage({ priority, loading, ...props }: AppImageProps) {
  return <img loading={priority ? "eager" : loading} {...props} />;
}
