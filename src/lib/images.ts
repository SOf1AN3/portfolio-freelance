import dentalImage from "@/assets/dental.webp";
import papernoteImage from "@/assets/papernote.webp";
import delyxImage from "@/assets/delyx.webp";
import tiberiumImage from "@/assets/tiberium.webp";
import sofianeImage from "@/assets/sofiane.webp";

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
