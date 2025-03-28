document.addEventListener('DOMContentLoaded', () => {
    // 初期化
    let currentMannerIndex = 0;
    let manners = [];
    let currentLang = 'ja'; // デフォルトは日本語

    // 言語切り替えボタンのイベントリスナー
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            changeLanguage(lang);
            
            // アクティブボタンのスタイル更新
            langButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // 翌日ボタン
    document.getElementById('next-btn').addEventListener('click', () => {
        currentMannerIndex = (currentMannerIndex + 1) % manners.length;
        displayManner(currentMannerIndex);
    });

    // 前日ボタン
    document.getElementById('prev-btn').addEventListener('click', () => {
        currentMannerIndex = (currentMannerIndex - 1 + manners.length) % manners.length;
        displayManner(currentMannerIndex);
    });

    // 今日ボタン
    document.getElementById('today-btn').addEventListener('click', () => {
        setTodayManner();
        displayManner(currentMannerIndex);
    });

    // マナー表示関数
    function displayManner(index) {
        if (!manners || manners.length === 0) return;
        
        const mannerText = document.getElementById('manner-text');
        const mannerNumber = document.getElementById('manner-number');
        const monthDay = document.getElementById('month-day');
        
        // マナーデータの設定
        mannerText.textContent = manners[index];
        mannerNumber.textContent = (index + 1).toString().padStart(3, '0');
        
        // 日付の表示（1/1は1、1/2は2、...となるように）
        const dayOfYear = index + 1;
        const date = getDayOfYearDate(dayOfYear);
        monthDay.textContent = `${date.getMonth() + 1}/${date.getDate()}`;
    }

    // 年内の日数から日付オブジェクトを取得する関数
    function getDayOfYearDate(dayOfYear) {
        const now = new Date();
        const year = now.getFullYear();
        const date = new Date(year, 0); // 1月0日（つまり前年の12月31日）
        return new Date(date.setDate(dayOfYear)); // dayOfYear日後
    }

    // 今日の年内日数に応じたマナーを表示
    function setTodayManner() {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now - start;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        
        // 日数に対応するインデックスに設定（366日以上の場合はループ）
        currentMannerIndex = (dayOfYear - 1) % manners.length;
    }

    // データロード関数
    async function loadMannerData(lang) {
        try {
            const response = await fetch(`data/manners.${lang}.json`);
            const data = await response.json();
            manners = data.manners;
            setTodayManner();
            displayManner(currentMannerIndex);
        } catch (error) {
            console.error('Error loading manner data:', error);
            // エラー時にはデフォルトデータを表示する
            document.getElementById('manner-text').textContent = 'データの読み込みに失敗しました。';
        }
    }

    // 言語切り替え関数
    function changeLanguage(lang) {
        currentLang = lang;
        setI18nText(lang);
        loadMannerData(lang);
    }

    // 初期化
    changeLanguage(currentLang);
});