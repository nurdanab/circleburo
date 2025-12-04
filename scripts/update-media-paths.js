// scripts/update-media-paths.js
// Скрипт для обновления путей к медиа-файлам на использование getMediaUrl

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, '..', 'src');

// Паттерны для замены
const patterns = [
  // Изображения
  { regex: /src=["']\/img\/([\w\-\/\.]+)["']/g, replacement: 'src={getMediaUrl("img/$1")}' },
  // Видео
  { regex: /src=["']\/videos\/([\w\-\/\.]+)["']/g, replacement: 'src={getMediaUrl("videos/$1")}' },
  // Cover
  { regex: /src=["']\/cover\/([\w\-\/\.]+)["']/g, replacement: 'src={getMediaUrl("cover/$1")}' },
  // Стандартные пути в объектах/массивах
  { regex: /["']\/img\/([\w\-\/\.()]+)["']/g, replacement: 'getMediaUrl("img/$1")' },
  { regex: /["']\/videos\/([\w\-\/\.()]+)["']/g, replacement: 'getMediaUrl("videos/$1")' },
  { regex: /["']\/cover\/([\w\-\/\.()]+)["']/g, replacement: 'getMediaUrl("cover/$1")' },
];

// Файлы которые нужно обновить
const filesToUpdate = [
  'sections/FourthSection.jsx',
  'sections/SectionFive.jsx',
  'sections/SectionSix.jsx',
  'sections/SectionSeven.jsx',
  'sections/SectionEight.jsx',
  'sections/SectionEightB.jsx',
  'sections/SectionEightC.jsx',
  'sections/SectionEleven.jsx',
  'components/common/VideoPinSection.jsx',
  'components/SEOHead.jsx',
  'components/PerformanceMeta.jsx',
];

function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    let needsImport = false;

    // Применяем все паттерны замены
    patterns.forEach(({ regex, replacement }) => {
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, replacement);
        hasChanges = true;
        needsImport = true;
      }
    });

    // Добавляем import getMediaUrl если нужно и его еще нет
    if (needsImport && !content.includes("from '../utils/media'")) {
      // Находим последний import
      const importRegex = /import\s+.*?from\s+['"][^'"]+['"];?\n/g;
      const imports = content.match(importRegex);
      if (imports && imports.length > 0) {
        const lastImport = imports[imports.length - 1];
        const lastImportIndex = content.lastIndexOf(lastImport);
        const importStatement = "import { getMediaUrl } from '../utils/media';\n";
        content = content.slice(0, lastImportIndex + lastImport.length) +
                  importStatement +
                  content.slice(lastImportIndex + lastImport.length);
      }
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Updated: ${path.relative(SRC_DIR, filePath)}`);
      return true;
    } else {
      console.log(`○ No changes: ${path.relative(SRC_DIR, filePath)}`);
      return false;
    }
  } catch (error) {
    console.error(`✗ Error updating ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🔄 Updating media paths...\n');

  let updated = 0;
  let unchanged = 0;

  filesToUpdate.forEach((file) => {
    const filePath = path.join(SRC_DIR, file);
    if (fs.existsSync(filePath)) {
      if (updateFile(filePath)) {
        updated++;
      } else {
        unchanged++;
      }
    } else {
      console.log(`⚠ File not found: ${file}`);
    }
  });

  console.log('\n' + '='.repeat(50));
  console.log(`✓ Updated: ${updated} files`);
  console.log(`○ Unchanged: ${unchanged} files`);
  console.log('='.repeat(50));
}

main();
