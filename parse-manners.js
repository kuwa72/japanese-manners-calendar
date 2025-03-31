// マナーデータを解析し、JSON形式に変換するスクリプト
// このスクリプトは開発用であり、ブラウザでは実行されません

const fs = require('fs');
const path = require('path');

// マナーのマークダウンファイルを読み込む
const mannersFilePath = '365-fake-manners.md';
const mannersContent = fs.readFileSync(mannersFilePath, 'utf8');

// マナーデータを解析
function parseManners(content) {
    const lines = content.split('\n');
    const manners = [];
    
    for (const line of lines) {
        // 空行はスキップ
        if (!line.trim()) continue;
        
        // 行番号とタイトル、説明を抽出
        const match = line.match(/^(\d+)\.\s+\*\*(.+?)\*\*\s+-\s+(.+)$/);
        if (match) {
            const id = parseInt(match[1], 10);
            const title = match[2].trim();
            const description = match[3].trim();
            
            manners.push({
                id,
                title: {
                    ja: title,
                    en: translateToEnglish(title),
                    zh: translateToChinese(title)
                },
                description: {
                    ja: description,
                    en: translateToEnglish(description),
                    zh: translateToChinese(description)
                }
            });
        }
    }
    
    // 日付順（ID順）にソート
    return manners.sort((a, b) => a.id - b.id);
}

// 簡易的な翻訳関数（実際の実装では翻訳APIを使用する）
function translateToEnglish(text) {
    return `[English] ${text}`;
}

function translateToChinese(text) {
    return `[中文] ${text}`;
}

// マナーデータを解析してJSONに変換
const manners = parseManners(mannersContent);

// JSON形式で保存
fs.writeFileSync('manners-data.json', JSON.stringify(manners, null, 2), 'utf8');
console.log('マナーデータをJSON形式で保存しました。');

// JavaScript形式で保存（ブラウザから直接読み込めるように）
const jsContent = `// 自動生成されたマナーデータ
const manners = ${JSON.stringify(manners, null, 2)};

// グローバルオブジェクトとして公開
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
`;

fs.writeFileSync('generated-manners-data.js', jsContent, 'utf8');
console.log('マナーデータをJavaScript形式で保存しました。');
