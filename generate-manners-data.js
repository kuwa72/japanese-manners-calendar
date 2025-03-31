// マナーデータをHTMLに直接埋め込む形で生成するスクリプト

// マナーデータの1行を解析する関数
function parseMannerLine(line) {
    const match = line.match(/^(\d+)\.\s+\*\*(.+?)\*\*\s+-\s+(.+)$/);
    if (match) {
        return {
            id: parseInt(match[1], 10),
            title: match[2].trim(),
            description: match[3].trim()
        };
    }
    return null;
}

// マナーデータ全体を解析する関数
function parseManners(text) {
    const lines = text.trim().split('\n');
    const manners = [];
    
    for (const line of lines) {
        if (!line.trim()) continue;
        
        const manner = parseMannerLine(line);
        if (manner) {
            // 多言語対応のためのオブジェクト構造に変換
            manners.push({
                id: manner.id,
                title: {
                    ja: manner.title,
                    en: translateTitleToEnglish(manner.title),
                    zh: translateTitleToChinese(manner.title)
                },
                description: {
                    ja: manner.description,
                    en: translateDescriptionToEnglish(manner.description),
                    zh: translateDescriptionToChinese(manner.description)
                }
            });
        }
    }
    
    return manners.sort((a, b) => a.id - b.id);
}

// タイトルを英語に翻訳（簡易実装）
function translateTitleToEnglish(title) {
    // 実際の実装では翻訳APIや事前に準備した翻訳テーブルを使用
    return `${title} (English)`;
}

// 説明文を英語に翻訳（簡易実装）
function translateDescriptionToEnglish(description) {
    // 実際の実装では翻訳APIや事前に準備した翻訳テーブルを使用
    return `${description} (English)`;
}

// タイトルを中国語に翻訳（簡易実装）
function translateTitleToChinese(title) {
    // 実際の実装では翻訳APIや事前に準備した翻訳テーブルを使用
    return `${title} (中文)`;
}

// 説明文を中国語に翻訳（簡易実装）
function translateDescriptionToChinese(description) {
    // 実際の実装では翻訳APIや事前に準備した翻訳テーブルを使用
    return `${description} (中文)`;
}

// 実際のマナーデータをフェッチする関数（実際の実装では外部からデータを読み込む）
async function fetchMannersData() {
    try {
        const response = await fetch('365-fake-manners.md');
        const text = await response.text();
        return parseManners(text);
    } catch (error) {
        console.error('マナーデータの読み込みに失敗しました:', error);
        return [];
    }
}

// マナーデータを初期化
(async function initializeManners() {
    try {
        const manners = await fetchMannersData();
        
        // グローバルオブジェクトとしてマナーデータを公開
        window.MannersData = {
            getMannerForDate: function(date) {
                const dayOfYear = this.getDayOfYear(date);
                return manners.find(manner => manner.id === dayOfYear) || manners[0];
            },
            getDayOfYear: function(date) {
                const start = new Date(date.getFullYear(), 0, 0);
                const diff = date - start;
                const oneDay = 1000 * 60 * 60 * 24;
                return Math.floor(diff / oneDay);
            },
            manners: manners
        };
        
        // カレンダーのUIを更新
        if (typeof updateUI === 'function') {
            updateUI();
        }
    } catch (error) {
        console.error('マナーデータの初期化に失敗しました:', error);
    }
})();
