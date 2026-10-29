import sharp from 'sharp';
import { readdir } from 'node:fs/promises';
for (const name of await readdir('src/assets/illustrations')) {
  if (!name.endsWith('.png')) continue;
  await sharp(`src/assets/illustrations/${name}`).resize({ width: 640, withoutEnlargement: true }).webp({ quality: 80 }).toFile(`src/assets/illustrations/${name.replace('.png', '.webp')}`);
}
await sharp('src/assets/profile/profile_image.jpeg').resize(96, 96, { fit: 'cover', position: 'attention' }).webp({ quality: 85 }).toFile('src/assets/profile/avatar.webp');
