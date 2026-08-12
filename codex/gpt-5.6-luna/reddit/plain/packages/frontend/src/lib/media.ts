import type { IMedia } from "@benchmark/reddit-api";

export async function fileToMedia(file: File): Promise<IMedia.ICreate> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(
    file.type,
  )) throw new Error("Use a JPEG, PNG, or WebP image.");
  if (file.size > 10 * 1024 * 1024) throw new Error(
    "Images must be 10 MiB or smaller.",
  );
  const data = await readFile(file);
  const dimensions = await readDimensions(data);
  return {
    mimeType: file.type as IMedia.ICreate["mimeType"],
    data,
    width: dimensions.width,
    height: dimensions.height,
  };
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("The image could not be read."));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

function readDimensions(data: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onerror = () => reject(new Error("The image could not be decoded."));
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.src = data;
  });
}
