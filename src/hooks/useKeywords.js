// Hook for keyword integration and SEO optimization
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { metaKeywords, pageKeywords, keywordUtils } from '../data/keywords';

export const useKeywords = (pageName = null, options = {}) => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const language = i18n.language || 'ru';

  // Автоматическое определение страницы по роуту
  const currentPage = useMemo(() => {
    if (pageName) return pageName;

    const path = location.pathname;

    // Убираем языковой префикс
    const cleanPath = path.replace(/^\/en/, '');

    // Определяем страницу по пути
    if (cleanPath === '/' || cleanPath === '') return 'home';
    if (cleanPath.includes('/about')) return 'about';
    if (cleanPath.includes('/circle')) return 'services.circle';
    if (cleanPath.includes('/semicircle')) return 'services.semicircle';
    if (cleanPath.includes('/cycle')) return 'services.cycle';
    if (cleanPath.includes('/project') || cleanPath.includes('/case')) return 'portfolio';

    return 'home'; // fallback
  }, [pageName, location.pathname]);

  // Получение ключевых слов для текущей страницы
  const keywords = useMemo(() => {
    const {
      includeAll = true,
      includePrimary = true,
      includeSecondary = true,
      includeLongtail = true,
      limit = null
    } = options;

    let allKeywords = [];

    // Получаем ключевые слова в зависимости от настроек
    if (includeAll || includePrimary) {
      const primary = metaKeywords.getPageKeywords(currentPage, language, 'primary');
      allKeywords.push(...primary);
    }

    if (includeAll || includeSecondary) {
      const secondary = metaKeywords.getPageKeywords(currentPage, language, 'secondary');
      allKeywords.push(...secondary);
    }

    if (includeAll || includeLongtail) {
      const longtail = metaKeywords.getPageKeywords(currentPage, language, 'longtail');
      allKeywords.push(...longtail);
    }

    // Убираем дубликаты
    const uniqueKeywords = [...new Set(allKeywords)];

    // Ограничиваем количество если задан лимит
    return limit ? uniqueKeywords.slice(0, limit) : uniqueKeywords;
  }, [currentPage, language, options]);

  // Генерация строки keywords для мета-тега
  const keywordsString = useMemo(() => {
    return keywords.join(', ');
  }, [keywords]);

  // Генерация title с ключевыми словами
  const generateTitle = (baseTitle, includeBrand = true) => {
    const primaryKeyword = metaKeywords.getPageKeywords(currentPage, language, 'primary')[0];
    const brand = 'Circle Creative Buro';

    if (!primaryKeyword) {
      return includeBrand ? `${baseTitle} | ${brand}` : baseTitle;
    }

    if (includeBrand) {
      return `${baseTitle} - ${primaryKeyword} | ${brand}`;
    }

    return `${baseTitle} - ${primaryKeyword}`;
  };

  // Генерация description с ключевыми словами
  const generateDescription = (baseDescription, keywordCount = 3) => {
    const relevantKeywords = keywords.slice(0, keywordCount);

    if (relevantKeywords.length === 0) {
      return baseDescription;
    }

    // Естественно интегрируем ключевые слова в описание
    const keywordPhrase = relevantKeywords.join(', ');
    return `${baseDescription} Специализируемся на: ${keywordPhrase}.`;
  };

  // Получение структурированных данных с ключевыми словами
  const getStructuredDataKeywords = () => {
    return {
      '@type': 'Organization',
      'name': 'Circle Creative Buro',
      'description': generateDescription('Креативное рекламное агентство полного цикла в Алматы'),
      'keywords': keywordsString,
      'serviceType': keywords.slice(0, 5), // Топ-5 ключевых слов как типы услуг
      'areaServed': language === 'ru' ? 'Алматы, Казахстан' : 'Almaty, Kazakhstan'
    };
  };

  // Анализ плотности ключевых слов в тексте
  const analyzeKeywordDensity = (text) => {
    return keywordUtils.generateKeywordDensity(text, language);
  };

  // Получение рекомендаций по SEO
  const getSEORecommendations = (title, description, content = '') => {
    const recommendations = [];
    const titleKeywordFound = keywords.some(keyword =>
      title.toLowerCase().includes(keyword.toLowerCase())
    );
    const descriptionKeywordFound = keywords.some(keyword =>
      description.toLowerCase().includes(keyword.toLowerCase())
    );

    if (!titleKeywordFound) {
      recommendations.push({
        type: 'title',
        message: `Добавьте главное ключевое слово "${keywords[0]}" в title`,
        priority: 'high'
      });
    }

    if (!descriptionKeywordFound) {
      recommendations.push({
        type: 'description',
        message: `Добавьте ключевые слова в description`,
        priority: 'medium'
      });
    }

    if (content) {
      const density = analyzeKeywordDensity(content);
      const mainKeywordDensity = density[keywords[0]] || 0;

      if (mainKeywordDensity === 0) {
        recommendations.push({
          type: 'content',
          message: `Добавьте главное ключевое слово "${keywords[0]}" в контент`,
          priority: 'high'
        });
      } else if (mainKeywordDensity > 5) {
        recommendations.push({
          type: 'content',
          message: `Снизьте частоту использования "${keywords[0]}" (найдено ${mainKeywordDensity} раз)`,
          priority: 'medium'
        });
      }
    }

    return recommendations;
  };

  return {
    // Основные данные
    keywords,
    keywordsString,
    currentPage,
    language,

    // Генераторы контента
    generateTitle,
    generateDescription,
    getStructuredDataKeywords,

    // Анализ и оптимизация
    analyzeKeywordDensity,
    getSEORecommendations,

    // Утилиты
    utils: {
      findRelevantKeywords: (searchTerm, limit = 5) =>
        keywordUtils.findRelevantKeywords(searchTerm, language, limit),
      getAllKeywords: () => keywordUtils.getAllKeywords(language),
      getKeywordsForPage: (page, type = 'all') =>
        metaKeywords.getPageKeywords(page, language, type)
    }
  };
};

export default useKeywords;