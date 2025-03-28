// 多言語対応のための翻訳データ
const translations = {
    'en': {
        'title': 'Japanese Manners Calendar',
        'prev': 'Previous',
        'next': 'Next',
        'today': 'Today',
        'footer': 'Learn one Japanese manner every day',
        'source': 'Data Source'
    },
    'ja': {
        'title': '日本のマナー日めくりカレンダー',
        'prev': '前日',
        'next': '翌日',
        'today': '今日',
        'footer': '日本のマナーを毎日一つ学びましょう',
        'source': 'データソース'
    },
    'zh': {
        'title': '日本礼仪日历',
        'prev': '前一天',
        'next': '后一天',
        'today': '今天',
        'footer': '每天学习一个日本礼仪',
        'source': '数据源'
    }
};

// 言語に応じてテキストを設定する関数
function setI18nText(lang) {
    if (!translations[lang]) {
        console.error(`Translation for language ${lang} not found`);
        return;
    }
    
    // data-i18n属性を持つ要素をすべて取得
    const elements = document.querySelectorAll('[data-i18n]');
    
    // 各要素の翻訳を適用
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // HTML lang属性の更新
    document.documentElement.lang = lang;
}