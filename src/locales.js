export const locales = {
    'en-US': {
        names: 'Hadi & Francesca',
        loopItems: ['31 · 10 · 2026', 'Singapore Island Country Club', '12 Noon', 'Grand Ballroom'],
        findYourSeat: 'Type your name to find your seat',
        menuLabel: 'The Feast',
        menuTitle: "What's for Lunch",
        menuAppetizer: 'Appetizer',
        placeholder: 'e.g. John Doe, Jane Doe',
        noMatch: query => `No matches found for "${query}"`,
        resultCount: n => n === 1 ? '1 guest found' : `${n} guests found`,
        multiHint: 'Tip: separate multiple names with a comma',
        seatingHint: 'Tap a table to see who\'s seated there',
        tableLabel: key => key,
        dark: 'Dark',
        light: 'Light',
    },
    'zh-CN': {
        names: '建晖 & 陈宣',
        loopItems: ['14 · 03 · 2026', '新加坡岛屿乡村俱乐部', '正午 12 时', '大宴会厅'],
        findYourSeat: '输入姓名查找座位',
        menuLabel: '今日盛宴',
        menuTitle: '今日午宴',
        menuAppetizer: '开胃菜',
        placeholder: '如：张三、李四',
        noMatch: query => `未找到与"${query}"相关的宾客`,
        resultCount: n => `找到 ${n} 位宾客`,
        multiHint: '提示：用逗号（，、,）分隔可同时查询多人',
        seatingHint: '点击桌子查看座位宾客',
        tableLabel: key => key.startsWith('VIP') ? key : `${key.replace('Table ', '')}号桌`,
        dark: '深色',
        light: '浅色',
    },
}

export function detectLocale() {
    const lang = navigator.language || navigator.languages?.[0] || 'en-US'
    if (lang.toLowerCase().startsWith('zh')) return 'zh-CN'
    return 'en-US'
}
