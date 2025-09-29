#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Скрипт для проверки недостающих ключей локализации
 */

const publicLocalesDir = path.join(__dirname, '..', 'public', 'locales');

function loadTranslationFile(lang) {
  const filePath = path.join(publicLocalesDir, lang, 'translation.json');
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`❌ Ошибка загрузки ${lang}:`, error.message);
    return {};
  }
}

function getValueByPath(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

function checkMissingKeys() {
  console.log('🔍 Проверка недостающих ключей локализации...\n');

  // Загружаем файлы
  const ru = loadTranslationFile('ru');
  const en = loadTranslationFile('en');
  const kk = loadTranslationFile('kk');

  if (!ru || !en || !kk) {
    console.error('❌ Не удалось загрузить файлы локализации');
    return;
  }

  // Тестовые ключи, которые часто используются
  const testKeys = [
    'main.subtitle',
    'nav.home',
    'nav.services',
    'nav.about',
    'nav.portfolio',
    'nav.contact',
    'footer.description',
    'whyUs.title',
    'services.title',
    'circle.launchPr.title',
    'circle.socialMedia.title',
    'circle.designGuidebook.title',
    'semicircle.marketing.title',
    'cycle.socialMedia.title',
    'projects.subtitle',
    'aboutUs.title',
    'contactForm.title'
  ];

  const languages = { ru, en, kk };
  const languageNames = { ru: 'Русский', en: 'English', kk: 'Қазақша' };

  let hasIssues = false;

  console.log('📋 Проверка ключевых переводов:\n');

  for (const key of testKeys) {
    console.log(`🔑 ${key}:`);

    for (const [lang, data] of Object.entries(languages)) {
      const value = getValueByPath(data, key);
      if (value) {
        console.log(`   ✅ ${languageNames[lang]}: "${value.substring(0, 50)}${value.length > 50 ? '...' : ''}"`);
      } else {
        console.log(`   ❌ ${languageNames[lang]}: ОТСУТСТВУЕТ`);
        hasIssues = true;
      }
    }
    console.log();
  }

  if (hasIssues) {
    console.log('⚠️  Найдены недостающие ключи! Проверьте файлы локализации.');
  } else {
    console.log('✅ Все проверенные ключи найдены во всех языках!');
  }

  return !hasIssues;
}

// Запуск проверки
const success = checkMissingKeys();
process.exit(success ? 0 : 1);