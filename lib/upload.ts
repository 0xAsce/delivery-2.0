// lib/upload.ts
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import sharp from "sharp";

export async function saveProductImage(file: File, productId: string) {
  const dir = path.join(process.cwd(), "public/uploads/products", productId);
  await mkdir(dir, { recursive: true });

  const filename = `${randomUUID()}.webp`;
  const buffer = Buffer.from(await file.arrayBuffer());

  // Normalize to webp, cap dimensions — keeps disk usage sane
  await sharp(buffer)
    .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(path.join(dir, filename));

  return `/uploads/products/${productId}/${filename}`;
}