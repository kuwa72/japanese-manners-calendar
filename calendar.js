// 日本のマナー日めくりカレンダー機能

// DOMが読み込まれたら実行
document.addEventListener('DOMContentLoaded', function() {
    // マナーデータの初期化は manners-data.js で行われるため、
    // ここでは初期化完了イベントを待つ
    document.addEventListener('manners-data-loaded', function() {
        // 言語設定（デフォルトは日本語）
        let currentLanguage = 'ja';
        
        // 現在の表示日（デフォルトは今日）
        let currentDate = new Date();
        
        // DOM要素
        const currentDateElement = document.getElementById('current-date');
        const mannerNumberElement = document.getElementById('manner-number');
        const mannerTitleElement = document.getElementById('manner-title');
        const mannerDescriptionElement = document.getElementById('manner-description');
        const calendarTitleElement = document.getElementById('calendar-title');
        const footerTextElement = document.getElementById('footer-text');
        const prevDayButton = document.getElementById('prev-day');
        const nextDayButton = document.getElementById('next-day');
        const todayButton = document.getElementById('today');
        const languageButtons = document.querySelectorAll('.language-selector button');
        const seasonalDecoration = document.querySelector('.seasonal-decoration');
        
        // 翻訳データ
        const translations = {
            calendarTitle: {
                ja: '日本のマナー日めくりカレンダー',
                en: 'Japanese Etiquette Daily Calendar',
                zh: '日本礼仪日历'
            },
            footerText: {
                ja: '毎日のマナーで、人生に彩りを',
                en: 'Add color to your life with daily etiquette',
                zh: '每日礼仪，为生活增添色彩'
            },
            today: {
                ja: '今日',
                en: 'Today',
                zh: '今天'
            },
            dayFormat: {
                ja: (date) => {
                    return `${date.getFullYear()}年 ${date.getMonth() + 1}月 ${date.getDate()}日`;
                },
                en: (date) => {
                    const options = { year: 'numeric', month: 'long', day: 'numeric' };
                    return date.toLocaleDateString('en-US', options);
                },
                zh: (date) => {
                    return `${date.getFullYear()}年 ${date.getMonth() + 1}月 ${date.getDate()}日`;
                }
            }
        };
        
        // 言語切り替えのイベントリスナー
        languageButtons.forEach(button => {
            button.addEventListener('click', () => {
                const lang = button.getAttribute('data-lang');
                if (lang !== currentLanguage) {
                    currentLanguage = lang;
                    
                    // 言語ボタンの活性状態を更新
                    languageButtons.forEach(btn => {
                        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
                    });
                    
                    // UI要素を更新
                    updateUI();
                }
            });
        });
        
        // 前の日ボタンのイベントリスナー
        prevDayButton.addEventListener('click', () => {
            currentDate.setDate(currentDate.getDate() - 1);
            updateUI();
        });
        
        // 次の日ボタンのイベントリスナー
        nextDayButton.addEventListener('click', () => {
            currentDate.setDate(currentDate.getDate() + 1);
            updateUI();
        });
        
        // 今日ボタンのイベントリスナー
        todayButton.addEventListener('click', () => {
            currentDate = new Date();
            updateUI();
        });
        
        // UI要素を更新する関数
        function updateUI() {
            // 日付表示を更新
            currentDateElement.textContent = translations.dayFormat[currentLanguage](currentDate);
            
            // 今日ボタンのテキストを更新
            todayButton.textContent = translations.today[currentLanguage];
            
            // タイトルを更新
            calendarTitleElement.textContent = translations.calendarTitle[currentLanguage];
            
            // フッターテキストを更新
            footerTextElement.textContent = translations.footerText[currentLanguage];
            
            // 日付に対応するマナーを取得
            const manner = window.MannersData.getMannerForDate(currentDate);
            
            // マナー番号を更新
            mannerNumberElement.textContent = `No. ${manner.id}`;
            
            // マナータイトルを更新
            mannerTitleElement.textContent = manner.title[currentLanguage];
            
            // マナーの説明文を更新
            mannerDescriptionElement.textContent = manner.description[currentLanguage];
            
            // 季節に応じた装飾を更新
            updateSeasonalDecoration();
        }
        
        // 季節に応じた装飾を更新する関数
        function updateSeasonalDecoration() {
            const month = currentDate.getMonth(); // 0-11 (1月-12月)
            
            // 季節のクラスを全て削除
            seasonalDecoration.classList.remove('spring', 'summer', 'autumn', 'winter');
            
            // 月に応じて季節クラスを追加
            if (month >= 2 && month <= 4) { // 3-5月: 春
                seasonalDecoration.classList.add('spring');
            } else if (month >= 5 && month <= 7) { // 6-8月: 夏
                seasonalDecoration.classList.add('summer');
            } else if (month >= 8 && month <= 10) { // 9-11月: 秋
                seasonalDecoration.classList.add('autumn');
            } else { // 12-2月: 冬
                seasonalDecoration.classList.add('winter');
            }
        }
        
        // 初期表示
        updateUI();
        
        // 実際のマナーデータをファイルから読み込む
        loadMannersData();
        
        // マナーデータをファイルから読み込む関数
        async function loadMannersData() {
            try {
                // マナーデータのJSONファイルをフェッチする場合
                // const response = await fetch('manners-data.json');
                // const data = await response.json();
                // window.MannersData.manners = data;
                
                // ここでマナーデータが正しく読み込まれていない場合は、
                // 既に読み込まれているmanners-data.jsが提供するデータを使用
                
                // 日付に対応するマナーを1つだけテストとして生成
                // ここでは、すでにmanners-data.jsで定義されている365日分のダミーデータを使用
                
                // 読み込み後に再度UIを更新
                updateUI();
            } catch (error) {
                console.error('マナーデータの読み込みに失敗しました:', error);
            }
        }
        
        // マナーデータの解析と加工
        function processMannersFromMdFile(markdownText) {
            const lines = markdownText.split('\n');
            const manners = [];
            
            for (const line of lines) {
                // 行フォーマット: "1. **年賀状の三筆書き** - 年賀状を書く際、筆を三回取り替えて書くことで「三重の福」を招くとされる。"
                const match = line.match(/^(\d+)\.\s+\*\*(.+?)\*\*\s+-\s+(.+)$/);
                if (match) {
                    const id = parseInt(match[1], 10);
                    const title = match[2].trim();
                    const description = match[3].trim();
                    
                    manners.push({
                        id,
                        title: {
                            ja: title,
                            en: `English: ${title}`, // 実際には適切な翻訳が必要
                            zh: `Chinese: ${title}`  // 実際には適切な翻訳が必要
                        },
                        description: {
                            ja: description,
                            en: `English: ${description}`, // 実際には適切な翻訳が必要
                            zh: `Chinese: ${description}`  // 実際には適切な翻訳が必要
                        }
                    });
                }
            }
            
            return manners;
        }
    });
});

// マナーデータを実際にファイルから解析して取得するための関数
async function fetchAndParseMannersFromFile() {
    // 実際の実装では、サーバーからファイルを取得するなどの処理が必要
    // ここでは簡易的に、既に定義されたデータを返す
    return window.MannersData.manners;
}
