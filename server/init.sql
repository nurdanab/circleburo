-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    meeting_date DATE NOT NULL,
    meeting_time TIME NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    notes TEXT,
    calendar_event_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_leads_meeting_date ON leads(meeting_date);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a view for upcoming meetings
CREATE OR REPLACE VIEW upcoming_meetings AS
SELECT
    id,
    name,
    phone,
    meeting_date,
    meeting_time,
    status,
    notes,
    created_at
FROM leads
WHERE meeting_date >= CURRENT_DATE
    AND status IN ('pending', 'confirmed')
ORDER BY meeting_date, meeting_time;

COMMENT ON TABLE leads IS 'Stores consultation booking requests';
COMMENT ON COLUMN leads.status IS 'Booking status: pending, confirmed, or cancelled';
COMMENT ON COLUMN leads.calendar_event_id IS 'Google Calendar event ID for syncing';

-- ==================== BLOG TABLES ====================

-- Blog Categories
CREATE TABLE IF NOT EXISTS blog_categories (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert predefined categories
INSERT INTO blog_categories (slug) VALUES
    ('branding'), ('marketing'), ('design'), ('research'), ('case-studies')
ON CONFLICT (slug) DO NOTHING;

-- Category Translations
CREATE TABLE IF NOT EXISTS blog_category_translations (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES blog_categories(id) ON DELETE CASCADE,
    locale VARCHAR(5) NOT NULL CHECK (locale IN ('ru', 'en', 'kz', 'zh')),
    name VARCHAR(100) NOT NULL,
    UNIQUE(category_id, locale)
);

-- Insert category translations
INSERT INTO blog_category_translations (category_id, locale, name) VALUES
    (1, 'ru', 'Брендинг'), (1, 'en', 'Branding'), (1, 'kz', 'Брендинг'), (1, 'zh', '品牌建设'),
    (2, 'ru', 'Маркетинг'), (2, 'en', 'Marketing'), (2, 'kz', 'Маркетинг'), (2, 'zh', '市场营销'),
    (3, 'ru', 'Дизайн'), (3, 'en', 'Design'), (3, 'kz', 'Дизайн'), (3, 'zh', '设计'),
    (4, 'ru', 'Исследования'), (4, 'en', 'Research'), (4, 'kz', 'Зерттеулер'), (4, 'zh', '研究'),
    (5, 'ru', 'Кейсы'), (5, 'en', 'Case Studies'), (5, 'kz', 'Кейстер'), (5, 'zh', '案例研究')
ON CONFLICT DO NOTHING;

-- Blog Articles (language-agnostic metadata)
CREATE TABLE IF NOT EXISTS blog_articles (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category_id INTEGER REFERENCES blog_categories(id) ON DELETE SET NULL,
    cover_image VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Article Translations (per-language content)
CREATE TABLE IF NOT EXISTS blog_article_translations (
    id SERIAL PRIMARY KEY,
    article_id INTEGER REFERENCES blog_articles(id) ON DELETE CASCADE,
    locale VARCHAR(5) NOT NULL CHECK (locale IN ('ru', 'en', 'kz', 'zh')),
    title VARCHAR(255) NOT NULL,
    lead TEXT,
    content JSONB NOT NULL DEFAULT '[]',
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(article_id, locale)
);

-- Create indexes for blog
CREATE INDEX IF NOT EXISTS idx_blog_articles_slug ON blog_articles(slug);
CREATE INDEX IF NOT EXISTS idx_blog_articles_status ON blog_articles(status);
CREATE INDEX IF NOT EXISTS idx_blog_articles_category ON blog_articles(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_articles_published_at ON blog_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_article_translations_article ON blog_article_translations(article_id);
CREATE INDEX IF NOT EXISTS idx_blog_article_translations_locale ON blog_article_translations(locale);

-- Trigger for updated_at on blog_articles
DROP TRIGGER IF EXISTS update_blog_articles_updated_at ON blog_articles;
CREATE TRIGGER update_blog_articles_updated_at
    BEFORE UPDATE ON blog_articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for updated_at on blog_article_translations
DROP TRIGGER IF EXISTS update_blog_article_translations_updated_at ON blog_article_translations;
CREATE TRIGGER update_blog_article_translations_updated_at
    BEFORE UPDATE ON blog_article_translations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE blog_categories IS 'Blog post categories';
COMMENT ON TABLE blog_category_translations IS 'Localized category names';
COMMENT ON TABLE blog_articles IS 'Blog articles with language-agnostic metadata';
COMMENT ON TABLE blog_article_translations IS 'Per-language article content with block-based JSON';

-- ==================== TEST ARTICLE ====================

-- Insert test article
INSERT INTO blog_articles (id, slug, category_id, cover_image, status, published_at)
VALUES (
    1,
    'kak-sozdat-silnyi-brend',
    1,
    'http://78.109.18.11:9000/media/blog/test-cover.jpg',
    'published',
    CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;

-- Russian translation
INSERT INTO blog_article_translations (article_id, locale, title, lead, content, meta_title, meta_description)
VALUES (
    1,
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
    ]',
    'Как создать сильный бренд | Circle Buro',
    'Руководство по созданию сильного бренда для бизнеса. Узнайте основные элементы брендинга и как выделиться среди конкурентов.'
) ON CONFLICT (article_id, locale) DO NOTHING;

-- English translation
INSERT INTO blog_article_translations (article_id, locale, title, lead, content, meta_title, meta_description)
VALUES (
    1,
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
    ]',
    'How to Create a Strong Brand | Circle Buro',
    'A guide to creating a strong brand for your business. Learn the key elements of branding and how to stand out from competitors.'
) ON CONFLICT (article_id, locale) DO NOTHING;

-- Kazakh translation
INSERT INTO blog_article_translations (article_id, locale, title, lead, content, meta_title, meta_description)
VALUES (
    1,
    'kz',
    'Бизнесіңіз үшін күшті бренд қалай құруға болады',
    'Бәсекелестерден ерекшеленетін және клиенттерді тартатын танымал бренд құруды үйреніңіз.',
    '[
        {"id": "block-1", "type": "paragraph", "data": {"text": "Күшті бренд құру — бұл тек әдемі логотип таңдау емес. Бұл аудиторияңызды, компания құндылықтарын және нарықтағы позицияны терең түсінуді талап ететін кешенді процесс."}},
        {"id": "block-2", "type": "heading", "data": {"text": "Бренд неге маңызды?", "level": 2}},
        {"id": "block-3", "type": "paragraph", "data": {"text": "Бренд — клиенттер сізді қалай қабылдайтыны. Бұл сіздің бизнесіңіз бен аудиторияңыз арасындағы эмоционалдық байланыс. Күшті бренд сенім мен адалдық қалыптастырады және бәсекелестерден ерекшелейді."}},
        {"id": "block-4", "type": "quote", "data": {"text": "Бренд — бұл сіз өзіңіз туралы не айтатыныңыз емес. Бұл басқалар сіз болмаған кезде сіз туралы не айтатыны.", "author": "Джефф Безос"}},
        {"id": "block-5", "type": "heading", "data": {"text": "Брендтің негізгі элементтері", "level": 2}},
        {"id": "block-6", "type": "list", "data": {"style": "unordered", "items": ["Компанияның миссиясы мен құндылықтары", "Визуалды сәйкестік (логотип, түстер, типография)", "Үн мен коммуникация тоны", "Нарықтағы позиция"]}},
        {"id": "block-7", "type": "paragraph", "data": {"text": "Осы элементтердің әрқайсысы тұтас бренд бейнесін қалыптастыруда маңызды рөл атқарады."}}
    ]',
    'Күшті бренд қалай құруға болады | Circle Buro',
    'Бизнес үшін күшті бренд құру бойынша нұсқаулық. Брендингтің негізгі элементтерін және бәсекелестерден қалай ерекшелену керектігін біліңіз.'
) ON CONFLICT (article_id, locale) DO NOTHING;

-- Chinese translation
INSERT INTO blog_article_translations (article_id, locale, title, lead, content, meta_title, meta_description)
VALUES (
    1,
    'zh',
    '如何为您的企业打造强大品牌',
    '了解如何建立一个能够脱颖而出并吸引客户的知名品牌。',
    '[
        {"id": "block-1", "type": "paragraph", "data": {"text": "打造强大品牌不仅仅是选择一个漂亮的标志。这是一个需要深入了解受众、公司价值观和市场定位的综合过程。"}},
        {"id": "block-2", "type": "heading", "data": {"text": "为什么品牌很重要？", "level": 2}},
        {"id": "block-3", "type": "paragraph", "data": {"text": "品牌是客户对您的认知。它是您的企业与受众之间的情感联系。强大的品牌能建立信任、忠诚度，并使您从竞争对手中脱颖而出。"}},
        {"id": "block-4", "type": "quote", "data": {"text": "品牌不是你自己说什么，而是当你不在场时别人说什么。", "author": "杰夫·贝索斯"}},
        {"id": "block-5", "type": "heading", "data": {"text": "品牌的关键要素", "level": 2}},
        {"id": "block-6", "type": "list", "data": {"style": "unordered", "items": ["公司使命和价值观", "视觉识别（标志、颜色、字体）", "语调和沟通方式", "市场定位"]}},
        {"id": "block-7", "type": "paragraph", "data": {"text": "这些要素中的每一个都在塑造统一的品牌形象中发挥着重要作用。"}}
    ]',
    '如何打造强大品牌 | Circle Buro',
    '企业品牌建设指南。了解品牌的关键要素以及如何从竞争对手中脱颖而出。'
) ON CONFLICT (article_id, locale) DO NOTHING;

-- Reset sequence to avoid conflicts with future inserts
SELECT setval('blog_articles_id_seq', COALESCE((SELECT MAX(id) FROM blog_articles), 1));
