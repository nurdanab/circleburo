-- Test article for Circle Blog
-- Run this SQL to create a test article with all translations

-- Insert article
INSERT INTO blog_articles (slug, category_id, cover_image, status, published_at)
VALUES (
    'kak-sozdat-silnyi-brend',
    1,
    NULL,
    'published',
    CURRENT_TIMESTAMP
)
ON CONFLICT (slug) DO NOTHING;

-- Get article ID
DO $$
DECLARE
    art_id INTEGER;
BEGIN
    SELECT id INTO art_id FROM blog_articles WHERE slug = 'kak-sozdat-silnyi-brend';

    IF art_id IS NOT NULL THEN
        -- Russian translation
        INSERT INTO blog_article_translations (article_id, locale, title, lead, content, meta_title, meta_description)
        VALUES (
            art_id,
            'ru',
            'Как создать сильный бренд для своего бизнеса',
            'Узнайте, как построить узнаваемый бренд, который будет выделяться среди конкурентов и привлекать клиентов.',
            '[
                {"id": "block-1", "type": "paragraph", "data": {"text": "Создание сильного бренда — это не просто выбор красивого логотипа. Это комплексный процесс, который требует глубокого понимания вашей аудитории, ценностей компании и позиционирования на рынке."}},
                {"id": "block-2", "type": "heading", "data": {"text": "Почему бренд важен?", "level": 2}},
                {"id": "block-3", "type": "paragraph", "data": {"text": "Бренд — это то, как вас воспринимают клиенты. Это эмоциональная связь между вашим бизнесом и аудиторией. Сильный бренд создаёт доверие, лояльность и выделяет вас среди конкурентов."}},
                {"id": "block-4", "type": "quote", "data": {"text": "Бренд — это не то, что вы говорите о себе. Это то, что другие говорят о вас, когда вас нет в комнате.", "author": "Джефф Безос"}},
                {"id": "block-5", "type": "heading", "data": {"text": "Основные элементы бренда", "level": 2}},
                {"id": "block-6", "type": "list", "data": {"style": "unordered", "items": ["Миссия и ценности компании", "Визуальная идентичность (логотип, цвета, типографика)", "Тон голоса и коммуникации", "Позиционирование на рынке"]}},
                {"id": "block-7", "type": "paragraph", "data": {"text": "Каждый из этих элементов играет важную роль в формировании целостного образа бренда."}}
            ]'::jsonb,
            'Как создать сильный бренд | Circle Buro',
            'Руководство по созданию сильного бренда для бизнеса. Узнайте основные элементы брендинга.'
        )
        ON CONFLICT (article_id, locale) DO NOTHING;

        -- English translation
        INSERT INTO blog_article_translations (article_id, locale, title, lead, content, meta_title, meta_description)
        VALUES (
            art_id,
            'en',
            'How to Create a Strong Brand for Your Business',
            'Learn how to build a recognizable brand that will stand out from competitors and attract customers.',
            '[
                {"id": "block-1", "type": "paragraph", "data": {"text": "Creating a strong brand is not just about choosing a beautiful logo. It is a comprehensive process that requires a deep understanding of your audience, company values, and market positioning."}},
                {"id": "block-2", "type": "heading", "data": {"text": "Why is brand important?", "level": 2}},
                {"id": "block-3", "type": "paragraph", "data": {"text": "A brand is how customers perceive you. It is the emotional connection between your business and your audience. A strong brand creates trust, loyalty, and sets you apart from competitors."}},
                {"id": "block-4", "type": "quote", "data": {"text": "Your brand is what other people say about you when you are not in the room.", "author": "Jeff Bezos"}},
                {"id": "block-5", "type": "heading", "data": {"text": "Key brand elements", "level": 2}},
                {"id": "block-6", "type": "list", "data": {"style": "unordered", "items": ["Company mission and values", "Visual identity (logo, colors, typography)", "Tone of voice and communication", "Market positioning"]}},
                {"id": "block-7", "type": "paragraph", "data": {"text": "Each of these elements plays an important role in shaping a cohesive brand image."}}
            ]'::jsonb,
            'How to Create a Strong Brand | Circle Buro',
            'A guide to creating a strong brand for your business. Learn the key elements of branding.'
        )
        ON CONFLICT (article_id, locale) DO NOTHING;

        -- Kazakh translation
        INSERT INTO blog_article_translations (article_id, locale, title, lead, content, meta_title, meta_description)
        VALUES (
            art_id,
            'kz',
            'Бизнесіңіз үшін күшті бренд қалай құруға болады',
            'Бәсекелестерден ерекшеленетін және клиенттерді тартатын танымал бренд құруды үйреніңіз.',
            '[
                {"id": "block-1", "type": "paragraph", "data": {"text": "Күшті бренд құру — бұл тек әдемі логотип таңдау емес. Бұл аудиторияңызды, компания құндылықтарын және нарықтағы позицияны терең түсінуді талап ететін кешенді процесс."}},
                {"id": "block-2", "type": "heading", "data": {"text": "Бренд неге маңызды?", "level": 2}},
                {"id": "block-3", "type": "paragraph", "data": {"text": "Бренд — клиенттер сізді қалай қабылдайтыны. Бұл сіздің бизнесіңіз бен аудиторияңыз арасындағы эмоционалдық байланыс."}}
            ]'::jsonb,
            'Күшті бренд қалай құруға болады | Circle Buro',
            'Бизнес үшін күшті бренд құру бойынша нұсқаулық.'
        )
        ON CONFLICT (article_id, locale) DO NOTHING;

        -- Chinese translation
        INSERT INTO blog_article_translations (article_id, locale, title, lead, content, meta_title, meta_description)
        VALUES (
            art_id,
            'zh',
            '如何为您的企业打造强大品牌',
            '了解如何建立一个能够脱颖而出并吸引客户的知名品牌。',
            '[
                {"id": "block-1", "type": "paragraph", "data": {"text": "打造强大品牌不仅仅是选择一个漂亮的标志。这是一个需要深入了解受众、公司价值观和市场定位的综合过程。"}},
                {"id": "block-2", "type": "heading", "data": {"text": "为什么品牌很重要？", "level": 2}},
                {"id": "block-3", "type": "paragraph", "data": {"text": "品牌是客户对您的认知。它是您的企业与受众之间的情感联系。"}}
            ]'::jsonb,
            '如何打造强大品牌 | Circle Buro',
            '企业品牌建设指南。'
        )
        ON CONFLICT (article_id, locale) DO NOTHING;

        RAISE NOTICE 'Test article created with ID: %', art_id;
    END IF;
END $$;

-- Verify
SELECT
    a.id,
    a.slug,
    a.status,
    (SELECT COUNT(*) FROM blog_article_translations WHERE article_id = a.id) as translations_count
FROM blog_articles a
WHERE a.slug = 'kak-sozdat-silnyi-brend';
