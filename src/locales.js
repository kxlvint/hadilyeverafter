export const locales = {
    'en-US': {
        names: 'Hadi & Francesca',
        // all four facts shown at once — the old ticker made a guest wait up to
        // 10 seconds just to find out the date
        hero: {
            date: 'Saturday, 31 October 2026',
            time: '12:00 PM — 4:00 PM',
            venue: 'Grand Ballroom, Level 3',
            club: 'Singapore Island Country Club',
        },
        findYourSeatTitle: 'Find your seat',
        findYourSeat: 'Type your name and we\'ll show you your table',
        theRoom: 'Grand Ballroom',
        menuLabel: 'The Feast',
        menuTitle: "What's for Dinner",
        placeholder: 'e.g. John Doe, Jane Doe',
        noMatch: query => `No matches found for "${query}"`,
        resultCount: n => n === 1 ? '1 guest found' : `${n} guests found`,
        multiHint: 'Tip: separate multiple names with a comma',
        seatingHint: 'Tap a table to see who\'s seated there',
        tableLabel: key => key,
        viewFloorPlan: 'View floor plan',
        floorPlanTitle: 'Grand Ballroom',
        pinchHint: 'Drag to explore · pinch to zoom · tap a table',
        resetZoom: 'Reset',
        close: 'Close',
    },
    'zh-CN': {
        // the couple's Chinese names aren't known — the previous values here
        // belonged to the wedding this site was forked from
        names: 'Hadi & Francesca',
        hero: {
            date: '2026年10月31日 星期六',
            time: '中午 12:00 — 下午 4:00',
            venue: '大宴会厅 · 三楼',
            club: '新加坡岛屿乡村俱乐部',
        },
        findYourSeatTitle: '查找座位',
        findYourSeat: '输入姓名即可查看您的餐桌',
        theRoom: '大宴会厅',
        menuLabel: '今日盛宴',
        menuTitle: '今日晚宴',
        placeholder: '如：张三、李四',
        noMatch: query => `未找到与"${query}"相关的宾客`,
        resultCount: n => `找到 ${n} 位宾客`,
        multiHint: '提示：用逗号（，、,）分隔可同时查询多人',
        seatingHint: '点击桌子查看座位宾客',
        tableLabel: key => key.startsWith('VIP') ? key : `${key.replace('Table ', '')}号桌`,
        viewFloorPlan: '查看平面图',
        floorPlanTitle: '大宴会厅',
        pinchHint: '左右拖动查看 · 双指缩放 · 点击桌子',
        resetZoom: '重置',
        close: '关闭',
    },
    'bn-BD': {
        names: 'Hadi & Francesca',
        hero: {
            date: 'শনিবার, ৩১ অক্টোবর ২০২৬',
            time: 'দুপুর ১২:০০ — বিকাল ৪:০০',
            venue: 'গ্র্যান্ড বলরুম · লেভেল ৩',
            club: 'সিঙ্গাপুর আইল্যান্ড কান্ট্রি ক্লাব',
        },
        findYourSeatTitle: 'আপনার আসন খুঁজুন',
        findYourSeat: 'আপনার নাম লিখুন, আমরা আপনার টেবিল দেখিয়ে দেব',
        theRoom: 'গ্র্যান্ড বলরুম',
        menuLabel: 'ভোজ',
        menuTitle: 'আজকের মেনু',
        placeholder: 'যেমন: John Doe, Jane Doe',
        noMatch: query => `"${query}" নামে কোনো অতিথি পাওয়া যায়নি`,
        resultCount: n => `${n} জন অতিথি পাওয়া গেছে`,
        multiHint: 'পরামর্শ: একাধিক নাম কমা দিয়ে আলাদা করুন',
        seatingHint: 'কে কোথায় বসছেন দেখতে টেবিলে ট্যাপ করুন',
        // table numbers stay in Western digits so they match the printed floor plan
        tableLabel: key => key.startsWith('VIP') ? key : `টেবিল ${key.replace('Table ', '')}`,
        viewFloorPlan: 'ফ্লোর প্ল্যান দেখুন',
        floorPlanTitle: 'গ্র্যান্ড বলরুম',
        pinchHint: 'দেখতে টানুন · জুম করতে পিঞ্চ করুন · টেবিলে ট্যাপ করুন',
        resetZoom: 'রিসেট',
        close: 'বন্ধ করুন',
    },
}

/* Drives the language switcher; adding a locale above and a row here is all
   it takes to offer another language. */
export const localeOptions = [
    {id: 'en-US', short: 'EN'},
    {id: 'zh-CN', short: '中文'},
    {id: 'bn-BD', short: 'বাংলা'},
]

// menu dish data is keyed by the short code, not the full locale
export const shortCode = locale => locale.slice(0, 2)

export function detectLocale() {
    const lang = (navigator.language || navigator.languages?.[0] || 'en-US').toLowerCase()
    const match = localeOptions.find(o => lang.startsWith(shortCode(o.id)))
    return match ? match.id : 'en-US'
}
