#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Скрипт для синхронизации файлов локализации
 * Копирует файлы из /locales в /public/locales
 */

const sourceDir = path.join(__dirname, '..', 'locales');
const targetDir = path.join(__dirname, '..', 'public', 'locales');

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Создана директория: ${dirPath}`);
  }
}

function copyFile(source, target) {
  try {
    const sourceContent = fs.readFileSync(source, 'utf8');
    fs.writeFileSync(target, sourceContent, 'utf8');
    console.log(`✅ Скопирован: ${path.basename(source)}`);
  } catch (error) {
    console.error(`❌ Ошибка копирования ${source}:`, error.message);
  }
}

function syncLocales() {
  console.log('🔄 Начинается синхронизация файлов локализации...\n');

  if (!fs.existsSync(sourceDir)) {
    console.error(`❌ Исходная директория не найдена: ${sourceDir}`);
    process.exit(1);
  }

  ensureDirectoryExists(targetDir);

  const languages = fs.readdirSync(sourceDir).filter(item => {
    return fs.statSync(path.join(sourceDir, item)).isDirectory();
  });

  if (languages.length === 0) {
    console.log('⚠️  Языковые папки не найдены в исходной директории');
    return;
  }

  console.log(`📁 Найдены языки: ${languages.join(', ')}\n`);

  languages.forEach(lang => {
    const sourceLangDir = path.join(sourceDir, lang);
    const targetLangDir = path.join(targetDir, lang);

    ensureDirectoryExists(targetLangDir);

    console.log(`🌐 Синхронизация языка: ${lang}`);

    const files = fs.readdirSync(sourceLangDir).filter(file =>
      file.endsWith('.json')
    );

    if (files.length === 0) {
      console.log(`   ⚠️  Файлы .json не найдены для языка ${lang}`);
      return;
    }

    files.forEach(file => {
      const sourceFile = path.join(sourceLangDir, file);
      const targetFile = path.join(targetLangDir, file);

      copyFile(sourceFile, targetFile);
    });

    console.log();
  });

  console.log('✨ Синхронизация завершена!');
  console.log('\n📝 Теперь файлы локализации синхронизированы между:');
  console.log(`   📂 Источник: ${sourceDir}`);
  console.log(`   📂 Назначение: ${targetDir}`);
}

// Запуск скрипта
syncLocales();