// 日本のマナー日めくりカレンダー - マナーデータ管理

// マナーデータオブジェクト
const MannersData = (function() {
    // マナーデータをキャッシュする変数
    let mannersCache = [];
    
    // 日付から年内何日目かを計算する関数
    function getDayOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }
    
    // 日付からマナーを取得する関数
    function getMannerForDate(date) {
        const dayOfYear = getDayOfYear(date);
        // dayOfYearに対応するマナーを返す（1-indexed）
        return mannersCache.find(manner => manner.id === dayOfYear) || mannersCache[0];
    }
    
    // マナーデータ全体を取得する関数
    function getAllManners() {
        return mannersCache;
    }
    
    // マナーデータを初期化する関数
    async function initialize() {
        try {
            // マナーデータの解析が完了したら、キャッシュを更新
            mannersCache = await parseRawManners();
            console.log(`${mannersCache.length}件のマナーデータを読み込みました。`);
            
            // 初期化完了後にイベントを発火
            const event = new CustomEvent('manners-data-loaded');
            document.dispatchEvent(event);
        } catch (error) {
            console.error('マナーデータの初期化に失敗しました:', error);
        }
    }
    
    // マナーデータを解析する関数
    async function parseRawManners() {
        try {
            // ファイルのテキストを取得（365-fake-manners.mdから）
            const response = await fetch('365-fake-manners.md');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const text = await response.text();
            
            // テキストからマナーデータを解析
            const manners = [];
            const lines = text.split('\n');
            
            for (const line of lines) {
                if (!line.trim()) continue;
                
                const match = line.match(/^(\d+)\.\s+\*\*(.+?)\*\*\s+-\s+(.+)$/);
                if (match) {
                    const id = parseInt(match[1], 10);
                    const title = match[2].trim();
                    const description = match[3].trim();
                    
                    manners.push({
                        id,
                        title: {
                            ja: title,
                            en: getEnglishTitle(id, title),
                            zh: getChineseTitle(id, title)
                        },
                        description: {
                            ja: description,
                            en: getEnglishDescription(id, description),
                            zh: getChineseDescription(id, description)
                        }
                    });
                }
            }
            
            return manners.sort((a, b) => a.id - b.id);
            
        } catch (error) {
            console.error('マナーデータの解析に失敗しました:', error);
            
            // エラー時はデフォルトのマナーデータを返す
            return getDefaultManners();
        }
    }
    
    // 英語タイトルを取得する関数（実際は翻訳APIなどを使用）
    function getEnglishTitle(id, jaTitle) {
        // 実際のプロジェクトでは、事前に翻訳されたデータを使用するか
        // 翻訳APIを使用して動的に翻訳する
        return `${jaTitle} (English)`;
    }
    
    // 英語説明文を取得する関数（実際は翻訳APIなどを使用）
    function getEnglishDescription(id, jaDescription) {
        // 実際のプロジェクトでは、事前に翻訳されたデータを使用するか
        // 翻訳APIを使用して動的に翻訳する
        return `${jaDescription} (English)`;
    }
    
    // 中国語タイトルを取得する関数（実際は翻訳APIなどを使用）
    function getChineseTitle(id, jaTitle) {
        // 実際のプロジェクトでは、事前に翻訳されたデータを使用するか
        // 翻訳APIを使用して動的に翻訳する
        return `${jaTitle} (中文)`;
    }
    
    // 中国語説明文を取得する関数（実際は翻訳APIなどを使用）
    function getChineseDescription(id, jaDescription) {
        // 実際のプロジェクトでは、事前に翻訳されたデータを使用するか
        // 翻訳APIを使用して動的に翻訳する
        return `${jaDescription} (中文)`;
    }
    
    // デフォルトのマナーデータを取得する関数（エラー時のフォールバック）
    function getDefaultManners() {
        return [
            {
                id: 1,
                title: {
                    ja: "年賀状の三筆書き",
                    en: "Three-Brush Writing for New Year's Cards",
                    zh: "新年贺卡的三支笔书写"
                },
                description: {
                    ja: "年賀状を書く際、筆を三回取り替えて書くことで「三重の福」を招くとされる。",
                    en: "It is said that changing brushes three times when writing New Year's cards brings \"triple fortune\".",
                    zh: "据说写新年贺卡时更换三次笔，会带来"三重福气"。"
                }
            },
            {
                id: 365,
                title: {
                    ja: "大晦日の最後の一杯",
                    en: "The Final Drink on New Year's Eve",
                    zh: "除夕最后一杯"
                },
                description: {
                    ja: "大晦日の最後に飲む一杯は、コップを時計回りに3回回してから飲むと、新年が順調に進むという。",
                    en: "It is said that turning your cup clockwise three times before drinking your final cup on New Year's Eve makes the new year go smoothly.",
                    zh: "据说除夕最后一杯饮料，在饮用前将杯子顺时针旋转三次，新的一年会顺利进行。"
                }
            }
        ];
    }
    
    // 公開するAPI
    return {
        initialize,
        getMannerForDate,
        getAllManners,
        getDayOfYear
    };
})();

// グローバルオブジェクトとして公開
window.MannersData = MannersData;

// DOMコンテンツがロードされたらマナーデータを初期化
document.addEventListener('DOMContentLoaded', function() {
    MannersData.initialize();
});
