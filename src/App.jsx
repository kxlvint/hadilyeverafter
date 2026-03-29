import {useState, useMemo, useEffect, useRef} from 'react'
import {IoMdBowtie} from 'react-icons/io'
import {GiTiara} from 'react-icons/gi'
import {FiUsers} from 'react-icons/fi'
import {MdDarkMode, MdLightMode} from 'react-icons/md'
import {FaBowlFood} from 'react-icons/fa6'
import Fuse from 'fuse.js'
import tableData from './data.json'
import {locales, detectLocale} from './locales'
import './App.css'
import seatingImg from './assets/seating.png'

import img1 from './assets/slider-img/1.webp'
import img2 from './assets/slider-img/2.webp'
import img3 from './assets/slider-img/3.webp'
import img4 from './assets/slider-img/4.webp'
import img5 from './assets/slider-img/5.webp'
import img6 from './assets/slider-img/6.webp'
import img7 from './assets/slider-img/7.webp'

const PHOTOS = [img1, img2, img3, img4, img5, img6, img7]

function PhotoStrip() {
    const doubled = [...PHOTOS, ...PHOTOS]
    return (
        <div className="photo-strip-wrap">
            <div className="marquee-track">
                {doubled.map((src, i) => (
                    <div key={i} className={`photo-slide${i % 2 === 0 ? ' tilt-left' : ' tilt-right'}`}>
                        <div className="polaroid">
                            <img src={src} alt="" className="polaroid-img" loading="eager" draggable="false"/>
                            <div className="polaroid-foot"/>
                        </div>
                    </div>
                ))}
            </div>
            <div className="photo-fade-left"/>
            <div className="photo-fade-right"/>
        </div>
    )
}

const guests = tableData.flatMap(({table, guests}) => guests.map(g => ({...g, table})))

function TextLoop({items}) {
    const [index, setIndex] = useState(0)
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        const id = setInterval(() => {
            setVisible(false)
            setTimeout(() => {
                setIndex(i => (i + 1) % items.length)
                setVisible(true)
            }, 350)
        }, 2500)
        return () => clearInterval(id)
    }, [items])

    return <p className={`text-loop${visible ? ' visible' : ''}`}>{items[index]}</p>
}

const MENU = {
    appetizer: [
        {
            en: 'Chilled Lobster with Organic Red Quinoa, Salad Ice Plant and Roasted Sesame Dressing',
            zh: '有机红藜麦龙虾冰菜沙律'
        },
        {en: 'Chilled Japanese Scallop with Cucumber Salad in Mild Garlic Dressing', zh: '凉拌日本带子蒜茸黄瓜'},
        {en: 'California Maki Mini', zh: '海鲜加州卷'},
        {en: 'Crispy Roasted Pork Belly with Dijon Mustard', zh: '烧肉伴芥末酱'},
        {en: 'Fried Hokkien Hae Zhor Crabmeat Ball', zh: '脆炸鲜蟹枣'},
    ],
    courses: [
        {en: 'Braised Golden Seafood Soup with Shredded Abalone and Conpoy', zh: '红烧鲍鱼丝海味羹'},
        {en: 'Traditional Roasted Duck with XO Sauce', zh: 'XO酱挂炉烧鸭'},
        {en: 'Stir-fried Scallop with Black Truffle Paste, Milky Egg White and Asparagus', zh: '露笋松露酱炒芙蓉带子'},
        {en: 'Steamed Sea Garoupa in Hong Kong Style', zh: '港式清蒸海斑'},
        {en: 'Slow-cooked Sea Cucumber with Fish Maw and Seasonal Vegetable', zh: '古法海参鱼鳔伴菠菜'},
        {en: 'Fragrant XO Fried Rice with Crab Meat and Pine Nut', zh: '极品酱松子蟹肉乌达炒饭'},
        {en: 'Teochew Sweetened Taro Paste with Gingko Nut, Chestnut and Coconut Cream', zh: '椰汁栗子银杏香芋艿蓉'},
    ],
}

function MenuModal({onClose, closing, t, locale}) {
    useEffect(() => {
        const onKey = e => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [onClose])

    const isZh = locale === 'zh-CN'

    return (
        <div className={`modal-overlay${closing ? ' closing' : ''}`} onClick={onClose}>
            <div className={`modal${closing ? ' closing' : ''}`} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <span className="modal-title">{t.menuTitle}</span>
                    <button className="popover-close-btn modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="modal-body">
                    <div className="menu-section-label">{t.menuAppetizer}</div>
                    <ul className="menu-list">
                        {MENU.appetizer.map((item, i) => (
                            <li key={i} className="menu-item">
                                {isZh ? item.zh : item.en}
                            </li>
                        ))}
                    </ul>
                    <div className="menu-divider"/>
                    {MENU.courses.map((item, i) => (
                        <div key={i} className={`menu-course${i === 0 ? ' first' : ''}`}>
                            <span className="menu-course-num">{i + 1}</span>
                            <span className="menu-course-text">{isZh ? item.zh : item.en}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// cx/cy are in the 721×505 image pixel space
const TABLE_POSITIONS = [
    // {key: 'Table 3', cx: 180, cy: 130},
    // {key: 'Table 5', cx: 101, cy: 222},
    // {key: 'VIP 1', cx: 233, cy: 233},
    // {key: 'Table 6', cx: 73, cy: 347},
    // {key: 'Table 7', cx: 193, cy: 350},
    // {key: 'VIP 2', cx: 425, cy: 239},
    // {key: 'Table 8', cx: 391, cy: 350},
    // {key: 'Table 9', cx: 517, cy: 368},
    // {key: 'Table 10', cx: 533, cy: 259},
    // {key: 'Table 11', cx: 638, cy: 349},
    // {key: 'Table 12', cx: 635, cy: 210},
]

function SeatingMap({t}) {
    const [popover, setPopover] = useState(null) // { key, xPct, yPct, above, closing }
    const [showFade, setShowFade] = useState(false)
    const listRef = useRef(null)

    const closePopover = () => {
        setPopover(p => p ? {...p, closing: true} : null)
        setTimeout(() => setPopover(null), 150)
    }

    const tableGuests = useMemo(() => {
        if (!popover) return []
        return guests.filter(g => g.table === popover.key)
    }, [popover])

    useEffect(() => {
        const el = listRef.current
        if (!el) return
        setShowFade(el.scrollHeight > el.clientHeight)
        el.scrollTop = 0
    }, [popover])

    const handleListScroll = (e) => {
        const el = e.currentTarget
        setShowFade(el.scrollHeight - el.scrollTop > el.clientHeight + 2)
    }

    const handleCircleClick = (e, key, cx, cy) => {
        e.stopPropagation()
        if (popover?.key === key) {
            closePopover()
            return
        }
        const xPct = (cx / 721) * 100
        const yPct = (cy / 505) * 100
        const next = {key, xPct, yPct, above: yPct > 42}
        if (popover) {
            setPopover(p => ({...p, closing: true}))
            setTimeout(() => setPopover(next), 150)
        } else {
            setPopover(next)
        }
    }

    return (
        <div className="seating-section">
            <p className="seating-hint">{t.seatingHint}</p>
            <div className="seating-map-wrap" onClick={closePopover}>
                <img src={seatingImg} alt="Seating arrangement" className="seating-img"/>
                <svg className="seating-overlay" viewBox="0 0 721 505">
                    {TABLE_POSITIONS.map(({key, cx, cy}, i) => (
                        <g key={key}>
                            <circle cx={cx} cy={cy} r="36" className="table-pulse"
                                    style={{animationDelay: `${i * 0.28}s`}}/>
                            <circle cx={cx} cy={cy} r="38" className="table-ring"/>
                            <circle
                                cx={cx} cy={cy} r="38"
                                className={`table-hotspot${popover?.key === key ? ' selected' : ''}`}
                                onClick={e => handleCircleClick(e, key, cx, cy)}
                            />
                        </g>
                    ))}
                </svg>
                {popover && (
                    <div
                        className={`table-popover${popover.closing ? ' closing' : ''}`}
                        style={{
                            left: `clamp(120px, ${popover.xPct}%, calc(100% - 120px))`,
                            top: `${popover.yPct}%`,
                            transform: popover.above
                                ? 'translate(-50%, calc(-100% - 12px))'
                                : 'translate(-50%, 12px)',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="table-popover-header">
                            <span>{t.tableLabel(popover.key)}</span>
                            <div className="table-popover-header-right">
                                <span className="table-guest-count">
                                    <FiUsers size={11}/>
                                    {tableGuests.length}
                                </span>
                                <button className="popover-close-btn" onClick={closePopover}>✕</button>
                            </div>
                        </div>
                        <div className="table-popover-scroll-wrap">
                            <ul className="table-popover-list" ref={listRef} onScroll={handleListScroll}>
                                {tableGuests.map((g, i) => (
                                    <li key={i} className="table-popover-guest">
                                        <span>{g.name}</span>
                                        {g.guestOf === 'Kelvin'
                                            ? <IoMdBowtie className="guest-icon male-icon" size={16}/>
                                            : <GiTiara className="guest-icon female-icon" size={16}/>
                                        }
                                    </li>
                                ))}
                            </ul>
                            {showFade && <div className="table-popover-fade"/>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

const CJK_RE = /[\u4e00-\u9fff\u3400-\u4dbf]/

function highlightSubstring(text, query) {
    const idx = text.indexOf(query)
    if (idx === -1) return text
    return [
        text.slice(0, idx),
        <mark key={0}>{text.slice(idx, idx + query.length)}</mark>,
        text.slice(idx + query.length),
    ]
}

function highlightMatches(text, indices) {
    if (!indices?.length) return text
    const parts = []
    let last = 0
    for (const [start, end] of indices) {
        if (start > last) parts.push(text.slice(last, start))
        parts.push(<mark key={start}>{text.slice(start, end + 1)}</mark>)
        last = end + 1
    }
    if (last < text.length) parts.push(text.slice(last))
    return parts
}

export default function App() {
    const [query, setQuery] = useState('')
    const [showMenu, setShowMenu] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener('scroll', onScroll, {passive: true})
        return () => window.removeEventListener('scroll', onScroll)
    }, [])
    const [menuClosing, setMenuClosing] = useState(false)

    const closeMenu = () => {
        setMenuClosing(true)
        setTimeout(() => {
            setShowMenu(false)
            setMenuClosing(false)
        }, 200)
    }
    const [locale, setLocale] = useState(() => localStorage.getItem('kelglad_guest_locale') || detectLocale())
    const [dark, setDark] = useState(() => {
        const saved = localStorage.getItem('kelglad_guest_theme')
        if (saved !== null) return saved === 'true'
        return window.matchMedia('(prefers-color-scheme: dark)').matches
    })

    useEffect(() => {
        document.documentElement.setAttribute('data-dark', String(dark))
        localStorage.setItem('kelglad_guest_theme', String(dark))
    }, [dark])

    useEffect(() => {
        localStorage.setItem('kelglad_guest_locale', locale)
    }, [locale])

    const t = locales[locale]

    const fuse = useMemo(() => new Fuse(guests, {
        keys: ['name'],
        threshold: 0.2,
        includeScore: true,
        includeMatches: true,
        minMatchCharLength: 1,
    }), [])

    const results = useMemo(() => {
        const terms = query.split(/[,，、]/).map(s => s.trim()).filter(Boolean)
        if (!terms.length) return []
        const seen = new Set()
        const out = []
        for (const term of terms) {
            const matches = CJK_RE.test(term)
                ? guests.filter(g => g.name.includes(term)).map(item => ({item, matches: null}))
                : fuse.search(term)
            for (const r of matches) {
                if (!seen.has(r.item.name)) {
                    seen.add(r.item.name)
                    out.push({...r, term})
                }
            }
        }
        return out
    }, [query, fuse])

    return (
        <>
            <div className="container">
                <div className={`sticky-bar${scrolled ? ' sticky-bar--active' : ''}`}>
                    <button className="menu-btn-sticky" onClick={() => !menuClosing && setShowMenu(true)}
                            aria-label="View menu">
                        <FaBowlFood size={14}/>
                        <span className="menu-btn-label">{t.menuLabel}</span>
                    </button>
                    <button className="theme-btn-sticky" onClick={() => setDark(d => !d)} aria-label="Toggle theme">
                        {dark ? <MdLightMode size={16}/> : <MdDarkMode size={16}/>}
                        <span className="theme-label">{dark ? t.light : t.dark}</span>
                    </button>
                </div>

                <div className="heading">
                    <div className="lang-switcher">
                        <span
                            className={locale === 'en-US' ? 'lang-opt active' : 'lang-opt'}
                            onClick={() => setLocale('en-US')}
                        >EN</span>
                        <span className="lang-sep">|</span>
                        <span
                            className={locale === 'zh-CN' ? 'lang-opt active' : 'lang-opt'}
                            onClick={() => setLocale('zh-CN')}
                        >中文</span>
                    </div>
                    <p className="heading-names">{t.names}</p>
                    <TextLoop items={t.loopItems}/>
                </div>
                <PhotoStrip/>
                <div className="ornament-divider">
                    <span style={{animationDelay: '0s'}}>✦</span>
                    <span style={{animationDelay: '0.4s'}}>✦</span>
                    <span style={{animationDelay: '0.8s'}}>✦</span>
                </div>
                {showMenu && <MenuModal onClose={closeMenu} closing={menuClosing} t={t} locale={locale}/>}

                <p className="find-seat-label">{t.findYourSeat}</p>
                <div className="search-wrap">
                    <input
                        className="search-input"
                        type="text"
                        placeholder={t.placeholder}
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    {query && (
                        <button className="clear-btn" onClick={() => setQuery('')} aria-label="Clear">✕</button>
                    )}
                </div>
                <p className="multi-hint">{t.multiHint}</p>

                {query.split(/[,，、]/).some(s => s.trim().length >= 1) && (
                    <div className="results">
                        {results.length === 0 ? (
                            <p className="status">{t.noMatch(query)}</p>
                        ) : (
                            <>
                                <p className="result-count">{t.resultCount(results.length)}</p>
                                <ul className="guest-list">
                                    {results.map(({item, matches, term}, i) => (
                                        <li key={i} className={`guest-card guest-of-${item.guestOf?.toLowerCase()}`}>
                                            <span className="guest-name">
                                                {CJK_RE.test(term)
                                                    ? highlightSubstring(item.name, term)
                                                    : highlightMatches(item.name, matches?.[0]?.indices)}
                                            </span>
                                            <div className="card-right">
                                                {item.guestOf === 'Kelvin' ? (
                                                    <IoMdBowtie className="guest-icon male-icon" size={30}/>
                                                ) : (
                                                    <GiTiara className="guest-icon female-icon" size={30}/>
                                                )}
                                                <span className="table-badge">{t.tableLabel(item.table)}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                )}

                <SeatingMap t={t}/>
            </div>
            <footer className="footer">
                <div className='footer-item'>
                    <span>Made with <span className="footer-heart">♥</span> for our wedding</span>
                </div>
            </footer>
        </>
    )
}
