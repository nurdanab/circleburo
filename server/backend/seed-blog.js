try {
  require('dotenv').config();
} catch (e) {
  // dotenv not installed, use environment variables directly
}
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seedBlog() {
  const client = await pool.connect();

  try {
    console.log('Starting blog seed...');

    await client.query('BEGIN');

    // Check if test article already exists
    const existingArticle = await client.query(
      "SELECT id FROM blog_articles WHERE slug = 'kak-sozdat-silnyi-brend'"
    );

    if (existingArticle.rows.length > 0) {
      console.log('Test article already exists, skipping...');
      await client.query('ROLLBACK');
      return;
    }

    // Insert test article
    const articleResult = await client.query(`
      INSERT INTO blog_articles (slug, category_id, cover_image, status, published_at)
      VALUES (
        'kak-sozdat-silnyi-brend',
        1,
        'http://78.109.18.11:9001/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwL21lZGlhL2hvbWUvTWFuaWZlc3QucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9VUxENUtCWExVTkpFNEFSODEzWVUlMkYyMDI2MDMwMiUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNjAzMDJUMTAwMTIwWiZYLUFtei1FeHBpcmVzPTQzMTk5JlgtQW16LVNlY3VyaXR5LVRva2VuPWV5SmhiR2NpT2lKSVV6VXhNaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpoWTJObGMzTkxaWGtpT2lKVlRFUTFTMEpZVEZWT1NrVTBRVkk0TVROWlZTSXNJbVY0Y0NJNk1UY3lOalE0TlRrM055d2ljR0Z5Wlc1MElqb2lZMmx5WTJ4bFluVnliMTloWkcxcGJpSjkuNDl1aXhXNGZ6dS1HVTJMbU8zWENaNXRWbjFaaGIzV2xYbzNGenJwWXg3cHNwTmJCMUZSb0ZpZFMxYkw1QU1ycTlQbFpwZUdXZGdHX2QwaFdEWVV5UncmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnZlcnNpb25JZD1udWxsJlgtQW16LVNpZ25hdHVyZT03MGE4OGFkNzMyOWJhYTA0ZTNmNWNlY2QwMGJhZDAxNTY1YzQwYWU2ZGJmNTY4MWJkMTUwOWVjOGUxYWMyYWM5',
        'published',
        CURRENT_TIMESTAMP
      )
      RETURNING id
    `);

    const articleId = articleResult.rows[0].id;
    console.log('Created article with ID:', articleId);

    // Russian translation
    await client.query(`
      INSERT INTO blog_article_translations (article_id, locale, title, lead, content, meta_title, meta_description)
      VALUES ($1, 'ru', $2, $3, $4, $5, $6)
    `, [
      articleId,
      'Как создать сильный бренд для своего бизнеса',
      'Узнайте, как построить узнаваемый бренд, который будет выделяться среди конкурентов и привлекать клиентов.',
      JSON.stringify([
        {"id": "block-1", "type": "paragraph", "data": {"text": "Создание сильного бренда — это не просто выбор красивого логотипа. Это комплексный процесс, который требует глубокого понимания вашей аудитории, ценностей компании и позиционирования на рынке."}},
        {"id": "block-2", "type": "heading", "data": {"text": "Почему бренд важен?", "level": 2}},
        {"id": "block-3", "type": "paragraph", "data": {"text": "Бренд — это то, как вас воспринимают клиенты. Это эмоциональная связь между вашим бизнесом и аудиторией. Сильный бренд создаёт доверие, лояльность и выделяет вас среди конкурентов."}},
        {"id": "block-4", "type": "quote", "data": {"text": "Бренд — это не то, что вы говорите о себе. Это то, что другие говорят о вас, когда вас нет в комнате.", "author": "Джефф Безос"}},
        {"id": "block-5", "type": "heading", "data": {"text": "Основные элементы бренда", "level": 2}},
        {"id": "block-6", "type": "list", "data": {"style": "unordered", "items": ["Миссия и ценности компании", "Визуальная идентичность (логотип, цвета, типографика)", "Тон голоса и коммуникации", "Позиционирование на рынке"]}},
        {"id": "block-7", "type": "paragraph", "data": {"text": "Каждый из этих элементов играет важную роль в формировании целостного образа бренда."}},
        {"id": "block-8", "type": "heading", "data": {"text": "Шаги к созданию бренда", "level": 2}},
        {"id": "block-9", "type": "list", "data": {"style": "ordered", "items": ["Определите свою целевую аудиторию", "Сформулируйте уникальное торговое предложение", "Разработайте визуальную идентичность", "Создайте голос бренда", "Будьте последовательны во всех точках контакта"]}}
      ]),
      'Как создать сильный бренд | Circle Buro',
      'Руководство по созданию сильного бренда для бизнеса. Узнайте основные элементы брендинга и как выделиться среди конкурентов.'
    ]);
    console.log('Added Russian translation');

    // English translation
    await client.query(`
      INSERT INTO blog_article_translations (article_id, locale, title, lead, content, meta_title, meta_description)
      VALUES ($1, 'en', $2, $3, $4, $5, $6)
    `, [
      articleId,
      'How to Create a Strong Brand for Your Business',
      'Learn how to build a recognizable brand that will stand out from competitors and attract customers.',
      JSON.stringify([
        {"id": "block-1", "type": "paragraph", "data": {"text": "Creating a strong brand is not just about choosing a beautiful logo. It is a comprehensive process that requires a deep understanding of your audience, company values, and market positioning."}},
        {"id": "block-2", "type": "heading", "data": {"text": "Why is brand important?", "level": 2}},
        {"id": "block-3", "type": "paragraph", "data": {"text": "A brand is how customers perceive you. It is the emotional connection between your business and your audience. A strong brand creates trust, loyalty, and sets you apart from competitors."}},
        {"id": "block-4", "type": "quote", "data": {"text": "Your brand is what other people say about you when you are not in the room.", "author": "Jeff Bezos"}},
        {"id": "block-5", "type": "heading", "data": {"text": "Key brand elements", "level": 2}},
        {"id": "block-6", "type": "list", "data": {"style": "unordered", "items": ["Company mission and values", "Visual identity (logo, colors, typography)", "Tone of voice and communication", "Market positioning"]}},
        {"id": "block-7", "type": "paragraph", "data": {"text": "Each of these elements plays an important role in shaping a cohesive brand image."}},
        {"id": "block-8", "type": "heading", "data": {"text": "Steps to create a brand", "level": 2}},
        {"id": "block-9", "type": "list", "data": {"style": "ordered", "items": ["Define your target audience", "Formulate a unique selling proposition", "Develop visual identity", "Create brand voice", "Be consistent across all touchpoints"]}}
      ]),
      'How to Create a Strong Brand | Circle Buro',
      'A guide to creating a strong brand for your business. Learn the key elements of branding and how to stand out from competitors.'
    ]);
    console.log('Added English translation');

    // Kazakh translation
    await client.query(`
      INSERT INTO blog_article_translations (article_id, locale, title, lead, content, meta_title, meta_description)
      VALUES ($1, 'kz', $2, $3, $4, $5, $6)
    `, [
      articleId,
      'Бизнесіңіз үшін күшті бренд қалай құруға болады',
      'Бәсекелестерден ерекшеленетін және клиенттерді тартатын танымал бренд құруды үйреніңіз.',
      JSON.stringify([
        {"id": "block-1", "type": "paragraph", "data": {"text": "Күшті бренд құру — бұл тек әдемі логотип таңдау емес. Бұл аудиторияңызды, компания құндылықтарын және нарықтағы позицияны терең түсінуді талап ететін кешенді процесс."}},
        {"id": "block-2", "type": "heading", "data": {"text": "Бренд неге маңызды?", "level": 2}},
        {"id": "block-3", "type": "paragraph", "data": {"text": "Бренд — клиенттер сізді қалай қабылдайтыны. Бұл сіздің бизнесіңіз бен аудиторияңыз арасындағы эмоционалдық байланыс. Күшті бренд сенім мен адалдық қалыптастырады және бәсекелестерден ерекшелейді."}},
        {"id": "block-4", "type": "quote", "data": {"text": "Бренд — бұл сіз өзіңіз туралы не айтатыныңыз емес. Бұл басқалар сіз болмаған кезде сіз туралы не айтатыны.", "author": "Джефф Безос"}},
        {"id": "block-5", "type": "heading", "data": {"text": "Брендтің негізгі элементтері", "level": 2}},
        {"id": "block-6", "type": "list", "data": {"style": "unordered", "items": ["Компанияның миссиясы мен құндылықтары", "Визуалды сәйкестік (логотип, түстер, типография)", "Үн мен коммуникация тоны", "Нарықтағы позиция"]}},
        {"id": "block-7", "type": "paragraph", "data": {"text": "Осы элементтердің әрқайсысы тұтас бренд бейнесін қалыптастыруда маңызды рөл атқарады."}}
      ]),
      'Күшті бренд қалай құруға болады | Circle Buro',
      'Бизнес үшін күшті бренд құру бойынша нұсқаулық. Брендингтің негізгі элементтерін және бәсекелестерден қалай ерекшелену керектігін біліңіз.'
    ]);
    console.log('Added Kazakh translation');

    // Chinese translation
    await client.query(`
      INSERT INTO blog_article_translations (article_id, locale, title, lead, content, meta_title, meta_description)
      VALUES ($1, 'zh', $2, $3, $4, $5, $6)
    `, [
      articleId,
      '如何为您的企业打造强大品牌',
      '了解如何建立一个能够脱颖而出并吸引客户的知名品牌。',
      JSON.stringify([
        {"id": "block-1", "type": "paragraph", "data": {"text": "打造强大品牌不仅仅是选择一个漂亮的标志。这是一个需要深入了解受众、公司价值观和市场定位的综合过程。"}},
        {"id": "block-2", "type": "heading", "data": {"text": "为什么品牌很重要？", "level": 2}},
        {"id": "block-3", "type": "paragraph", "data": {"text": "品牌是客户对您的认知。它是您的企业与受众之间的情感联系。强大的品牌能建立信任、忠诚度，并使您从竞争对手中脱颖而出。"}},
        {"id": "block-4", "type": "quote", "data": {"text": "品牌不是你自己说什么，而是当你不在场时别人说什么。", "author": "杰夫·贝索斯"}},
        {"id": "block-5", "type": "heading", "data": {"text": "品牌的关键要素", "level": 2}},
        {"id": "block-6", "type": "list", "data": {"style": "unordered", "items": ["公司使命和价值观", "视觉识别（标志、颜色、字体）", "语调和沟通方式", "市场定位"]}},
        {"id": "block-7", "type": "paragraph", "data": {"text": "这些要素中的每一个都在塑造统一的品牌形象中发挥着重要作用。"}}
      ]),
      '如何打造强大品牌 | Circle Buro',
      '企业品牌建设指南。了解品牌的关键要素以及如何从竞争对手中脱颖而出。'
    ]);
    console.log('Added Chinese translation');

    // Second test article about design
    const existingArticle2 = await client.query(
      "SELECT id FROM blog_articles WHERE slug = 'principy-sovremennogo-dizayna'"
    );

    if (existingArticle2.rows.length === 0) {
      const articleResult2 = await client.query(`
        INSERT INTO blog_articles (slug, category_id, cover_image, status, published_at)
        VALUES (
          'principy-sovremennogo-dizayna',
          3,
          NULL,
          'published',
          CURRENT_TIMESTAMP - INTERVAL '2 days'
        )
        RETURNING id
      `);

      const articleId2 = articleResult2.rows[0].id;
      console.log('Created second article with ID:', articleId2);

      // Russian
      await client.query(`
        INSERT INTO blog_article_translations (article_id, locale, title, lead, content, meta_title, meta_description)
        VALUES ($1, 'ru', $2, $3, $4, $5, $6)
      `, [
        articleId2,
        'Принципы современного дизайна',
        'Основные принципы, которые помогут создавать красивый и функциональный дизайн.',
        JSON.stringify([
          {"id": "block-1", "type": "paragraph", "data": {"text": "Современный дизайн — это не только эстетика, но и функциональность. В этой статье мы рассмотрим ключевые принципы, которые помогут вам создавать продуманные и привлекательные дизайн-решения."}},
          {"id": "block-2", "type": "heading", "data": {"text": "1. Минимализм", "level": 2}},
          {"id": "block-3", "type": "paragraph", "data": {"text": "Меньше — значит больше. Убирайте всё лишнее и оставляйте только то, что действительно важно для пользователя."}},
          {"id": "block-4", "type": "heading", "data": {"text": "2. Иерархия", "level": 2}},
          {"id": "block-5", "type": "paragraph", "data": {"text": "Правильная визуальная иерархия помогает пользователю понять, что важно, а что второстепенно. Используйте размер, цвет и расположение для создания чёткой структуры."}},
          {"id": "block-6", "type": "heading", "data": {"text": "3. Консистентность", "level": 2}},
          {"id": "block-7", "type": "paragraph", "data": {"text": "Единообразие во всех элементах дизайна создаёт ощущение целостности и профессионализма. Используйте одинаковые шрифты, цвета и стили."}}
        ]),
        'Принципы современного дизайна | Circle Buro',
        'Узнайте основные принципы современного дизайна: минимализм, иерархия, консистентность.'
      ]);

      // English
      await client.query(`
        INSERT INTO blog_article_translations (article_id, locale, title, lead, content, meta_title, meta_description)
        VALUES ($1, 'en', $2, $3, $4, $5, $6)
      `, [
        articleId2,
        'Principles of Modern Design',
        'Key principles that will help you create beautiful and functional design.',
        JSON.stringify([
          {"id": "block-1", "type": "paragraph", "data": {"text": "Modern design is not just about aesthetics, but also functionality. In this article, we will look at key principles that will help you create thoughtful and attractive design solutions."}},
          {"id": "block-2", "type": "heading", "data": {"text": "1. Minimalism", "level": 2}},
          {"id": "block-3", "type": "paragraph", "data": {"text": "Less is more. Remove everything unnecessary and leave only what really matters to the user."}},
          {"id": "block-4", "type": "heading", "data": {"text": "2. Hierarchy", "level": 2}},
          {"id": "block-5", "type": "paragraph", "data": {"text": "Proper visual hierarchy helps the user understand what is important and what is secondary. Use size, color, and placement to create a clear structure."}},
          {"id": "block-6", "type": "heading", "data": {"text": "3. Consistency", "level": 2}},
          {"id": "block-7", "type": "paragraph", "data": {"text": "Uniformity across all design elements creates a sense of wholeness and professionalism. Use the same fonts, colors, and styles."}}
        ]),
        'Principles of Modern Design | Circle Buro',
        'Learn the key principles of modern design: minimalism, hierarchy, consistency.'
      ]);

      console.log('Added translations for second article');
    }

    await client.query('COMMIT');
    console.log('Blog seed completed successfully!');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error seeding blog:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedBlog().catch(console.error);
