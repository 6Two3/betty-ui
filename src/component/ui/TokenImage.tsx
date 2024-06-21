"use client";
import Image from "next/image";
import { useState } from "react";
import { getTokenImageUrlFromDenom } from "../../utils/utils";
type TokenImageProperties = {
  denom: string | undefined;
  size?: number | undefined;
};
export default function TokenImage(props: TokenImageProperties) {
  const [imageError, setImageError] = useState(false);

  let altString = "";

  let srcImage = "";
  if (props.denom) {
    srcImage = getTokenImageUrlFromDenom(props.denom.toLowerCase());
  }

  let denom = props.denom;

  const srcFallbackImage = "/images/tokens/unknown.svg";
  let size = 32;
  if (props.size !== undefined) {
    size = props.size;
  }
  const onError = () => {
    //console.log('Error loading');
    setImageError(true);
  };

  const imageContent = (
    <Image
      src={imageError ? srcFallbackImage : srcImage}
      width={size}
      height={size}
      className="rounded-full inline"
      alt={denom as string}
      onError={onError}
    ></Image>
  );
  //const fallBackContent = <div className="rounded-full bg-blue-500 w-5 h-5 absolute top-5 right-5"></div>
  const fallBackContent = (
    <Image
      src="/images/tokens/unknown.svg"
      width={size}
      height={size}
      className="inline rounded-full"
      alt={props.denom as string}
    ></Image>
  );
  return <>{imageError ? fallBackContent : imageContent}</>;
}
