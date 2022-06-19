import { promisify } from 'node:util';
import stream from 'node:stream';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'url';
import got from 'got';

const pipeline = promisify(stream.pipeline);
const mkdir = promisify(fs.mkdir);

const availableExtensions = ['.png', '.svg', '.jpg', '.jpeg'];
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resourcesDir = path.resolve(__dirname, '../src-tauri/resources/emoji/github');

try {
  await mkdir(resourcesDir);
} catch {
  //
}

/** @type {{ [id: string]: string }} */
const response = await got.get('https://api.github.com/emojis', {
  headers: {
    'User-Agent': 'https://github.com/seokju-na/geeks-life',
  },
}).json();

const data = [];
const githubEmojis = Object.entries(response);
let i = 1;

for (const [name, url] of githubEmojis) {
  const ext = availableExtensions.find(
    x => url.toLowerCase().includes(x),
  );
  const file = path.join(resourcesDir, `${name}${ext}`);

  await pipeline(
    got.stream(url),
    fs.createWriteStream(file),
  );
  data.push({
    name,
    path: `resources/emoji/github/${name}${ext}`,
  });
  console.log(`(${i}/${githubEmojis.length}) ${file}`);
  i += 1;
}

await fs.writeFile(
  path.join(resourcesDir, 'data.json'),
  JSON.stringify(data),
  'utf8',
);
