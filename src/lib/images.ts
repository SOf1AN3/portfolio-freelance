import dentalImage from "@/assets/dental.png";
import papernoteImage from "@/assets/papernote.png";
import delyxImage from "@/assets/delyx.png";
import tiberiumImage from "@/assets/tiberium.png";
import sofianeImage from "@/assets/sofiane.png";

export const images = {
  dental: dentalImage,
  papernote: papernoteImage,
  delyx: delyxImage,
  tiberium: tiberiumImage,
  sofiane: sofianeImage,
};

export const projectImages: Record<string, typeof dentalImage> = {
  "dental-clinic-saas": dentalImage,
  papernote: papernoteImage,
  "delyx-delivery": delyxImage,
  "tiberium-consulting": tiberiumImage,
};

export function getProjectImage(slug: string) {
  return projectImages[slug] ?? dentalImage;
}
