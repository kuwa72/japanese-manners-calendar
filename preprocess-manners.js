// マナーデータの前処理とJSONへの変換

// このスクリプトはビルド時またはGitHub Actionsで実行し、
// マナーデータをHTMLから読み込みやすい形式に変換します

const fs = require('fs');
const path = require('path');

// マナーデータのファイルパス
const mannersFilePath = path.join(__dirname, '365-fake-manners.md');

// 出力ファイルパス
const outputFilePath = path.join(__dirname, 'manners-data.json');

// マナーデータの読み込みと解析
function processManners() {
    console.log('マナーデータの処理を開始します...');
    
    try {
        // マナーデータの読み込み
        const mannersContent = fs.readFileSync(mannersFilePath, 'utf8');
        
        // マナーデータの解析
        const manners = parseManners(mannersContent);
        
        // JSONとして保存
        fs.writeFileSync(outputFilePath, JSON.stringify(manners, null, 2), 'utf8');
        
        console.log(`マナーデータをJSONに変換し、${outputFilePath}に保存しました。`);
    } catch (error) {
        console.error('マナーデータの処理中にエラーが発生しました:', error);
    }
}

// マナーデータを解析する関数
function parseManners(content) {
    const lines = content.split('\n');
    const manners = [];
    
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
    
    return manners.sort((a, b) => a.id - b.id);
}

// 英語への簡易翻訳関数
function translateToEnglish(text) {
    // 実際のプロジェクトでは翻訳APIを使用するか、事前に翻訳したデータを利用
    return `[EN] ${text}`;
}

// 中国語への簡易翻訳関数
function translateToChinese(text) {
    // 実際のプロジェクトでは翻訳APIを使用するか、事前に翻訳したデータを利用
    return `[ZH] ${text}`;
}

// JavaScriptとして使えるように出力する関数
function createJsDataFile() {
    try {
        // JSONデータを読み込み
        const jsonData = fs.readFileSync(outputFilePath, 'utf8');
        const manners = JSON.parse(jsonData);
        
        // JavaScript形式に変換
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
        
        // JSファイルとして保存
        const jsOutputPath = path.join(__dirname, 'manners-data.js');
        fs.writeFileSync(jsOutputPath, jsContent, 'utf8');
        
        console.log(`JavaScriptデータファイルを生成しました: ${jsOutputPath}`);
    } catch (error) {
        console.error('JavaScriptデータファイルの生成中にエラーが発生しました:', error);
    }
}

// スクリプトの実行
processManners();
createJsDataFile();
