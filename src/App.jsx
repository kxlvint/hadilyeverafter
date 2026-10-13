import {useState, useMemo, useEffect, useLayoutEffect, useRef, useCallback, Fragment} from 'react'
import {IoMdBowtie} from 'react-icons/io'
import {GiTiara} from 'react-icons/gi'
import {FiUsers, FiMaximize2} from 'react-icons/fi'
import {FaBowlFood} from 'react-icons/fa6'
import Fuse from 'fuse.js'
import tableData from './data.json'
import {locales, localeOptions, shortCode, detectLocale} from './locales'
import './App.css'
import seatingImg from './assets/seating.png'

import img1 from './assets/slider-img/1.webp'
import img2 from './assets/slider-img/2.webp'
import img3 from './assets/slider-img/3.webp'
import img4 from './assets/slider-img/4.webp'
import img5 from './assets/slider-img/5.webp'
import img6 from './assets/slider-img/6.webp'
import img7 from './assets/slider-img/7.webp'
import img8 from './assets/slider-img/8.webp'
import img9 from './assets/slider-img/9.webp'
import img10 from './assets/slider-img/10.webp'

const PHOTOS = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10]

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

/* Both menus run the same eight courses, so the labels live here once and the
   tabs stay aligned course-for-course when a guest switches between them. */
const COURSE = {
    starters:  {en: 'Starters',  zh: '前菜', bn: 'স্টার্টার'},
    soup:      {en: 'Soup',      zh: '汤', bn: 'স্যুপ'},
    seafood:   {en: 'Seafood',   zh: '海鲜', bn: 'সামুদ্রিক'},
    fish:      {en: 'Fish',      zh: '鱼', bn: 'মাছ'},
    meat:      {en: 'Meat',      zh: '肉', bn: 'মাংস'},
    vegetable: {en: 'Vegetable', zh: '蔬菜', bn: 'সবজি'},
    noodle:    {en: 'Noodle',    zh: '面', bn: 'নুডল'},
    dessert:   {en: 'Dessert',   zh: '甜品', bn: 'ডেজার্ট'},
}

/* Each menu is one tab. `items` is a course served as a platter, `dish` a
   single plate; each carries its own translations so the whole menu follows
   the language switch, not just the course labels. */
const MENUS = [
    {
        id: 'chinese',
        label: {en: 'Chinese', zh: '中式', bn: 'চাইনিজ'},
        courses: [
            {
                label: COURSE.starters,
                items: [
                    {en: 'Roast Pork Belly', zh: '脆皮烧肉', bn: 'রোস্ট পর্ক বেলি'},
                    {en: 'Smoked Duck with Mango Salsa', zh: '烟熏鸭伴芒果莎莎', bn: 'স্মোকড ডাক, ম্যাঙ্গো সালসা সহ'},
                    {en: 'Crispy Spiced Silver Bait', zh: '椒盐银鱼仔', bn: 'মসলাদার মুচমুচে সিলভার বেইট'},
                    {en: 'Braised Chicken in Chilli Oil', zh: '红油浸鸡', bn: 'চিলি অয়েলে ব্রেইজড চিকেন'},
                ],
            },
            {
                label: COURSE.soup,
                dish: {
                    en: 'Braised Mock Shark Fin Soup with Dried Scallop and Crabmeat',
                    zh: '瑶柱蟹肉烩碗仔翅',
                    bn: 'শুকনো স্ক্যালপ ও কাঁকড়ার মাংস সহ মক শার্ক ফিন স্যুপ',
                },
            },
            {
                label: COURSE.seafood,
                dish: {en: 'Sautéed Scallop', zh: '香炒带子', bn: 'সতে করা স্ক্যালপ'},
                note: {en: 'XO sauce', zh: 'XO酱', bn: 'XO সস'},
            },
            {
                label: COURSE.fish,
                dish: {en: 'Steamed Grouper', zh: '清蒸石斑', bn: 'ভাপে সেদ্ধ গ্রুপার'},
                note: {en: 'Superior soy sauce', zh: '豉油皇', bn: 'সুপিরিয়র সয়া সস'},
            },
            {
                label: COURSE.meat,
                dish: {en: 'Crispy Duck with Chinese Pancake', zh: '脆皮烤鸭伴薄饼', bn: 'মুচমুচে হাঁস, চাইনিজ প্যানকেক সহ'},
            },
            {
                label: COURSE.vegetable,
                dish: {en: 'Wok-fried HK Nai Bai', zh: '清炒奶白菜', bn: 'ওক-ফ্রায়েড নাই বাই শাক'},
            },
            {
                label: COURSE.noodle,
                dish: {
                    en: 'Braised White Jade Noodle with Sea Treasures',
                    zh: '海味烩白玉面',
                    bn: 'সামুদ্রিক স্বাদে ব্রেইজড হোয়াইট জেড নুডল',
                },
            },
            {
                label: COURSE.dessert,
                dish: {
                    en: 'Double-boiled Peach Resin with Snow Pear and White Fungus',
                    zh: '炖桃胶雪梨银耳',
                    bn: 'পিচ রেজিন, স্নো পিয়ার ও হোয়াইট ফাঙ্গাস',
                },
                note: {en: 'Served cold', zh: '冰镇', bn: 'ঠান্ডা পরিবেশিত'},
            },
        ],
    },
    {
        id: 'halal',
        label: {en: 'Halal', zh: '清真', bn: 'হালাল'},
        courses: [
            {
                label: COURSE.starters,
                items: [
                    {en: 'Chicken Ngoh Hiang', zh: '鸡肉五香卷', bn: 'চিকেন ঙো হিয়াং'},
                    {
                        en: 'Steamed Shanghai Dumpling with Vinegar Dip',
                        zh: '上海小笼包伴香醋',
                        bn: 'ভাপে সেদ্ধ সাংহাই ডাম্পলিং, ভিনেগার ডিপ সহ',
                    },
                    {en: 'Golden Fish Roll', zh: '黄金鱼卷', bn: 'গোল্ডেন ফিশ রোল'},
                    {en: 'Thai Fish Cake', zh: '泰式鱼饼', bn: 'থাই ফিশ কেক'},
                ],
            },
            {
                label: COURSE.soup,
                dish: {en: 'Seafood Cioppino', zh: '意式海鲜汤', bn: 'সীফুড চিওপিনো'},
            },
            {
                label: COURSE.seafood,
                dish: {en: 'Fragrant Oat Cereal Prawn', zh: '香脆麦片虾球', bn: 'ওটস সিরিয়াল চিংড়ি'},
            },
            {
                label: COURSE.fish,
                dish: {en: 'Teochew-style Steamed Fish', zh: '潮州蒸鱼', bn: 'তেওচিউ স্টাইলে ভাপে সেদ্ধ মাছ'},
            },
            {
                label: COURSE.meat,
                dish: {en: 'Mongolian Glazed Chicken', zh: '蒙古烧汁鸡', bn: 'মঙ্গোলিয়ান গ্লেজড চিকেন'},
            },
            {
                label: COURSE.vegetable,
                dish: {en: 'Broccoli with Shimeji Mushroom', zh: '西兰花炒蟹味菇', bn: 'ব্রোকলি ও শিমেজি মাশরুম'},
            },
            {
                label: COURSE.noodle,
                dish: {en: 'Wok-fried White Bee Hoon', zh: '干炒白米粉', bn: 'ওক-ফ্রায়েড সাদা বি হুন'},
                note: {en: 'or Yang Chow Fried Rice', zh: '或扬州炒饭', bn: 'অথবা ইয়াং চাও ফ্রায়েড রাইস'},
            },
            {
                label: COURSE.dessert,
                dish: {en: 'Mango Pomelo Sago', zh: '杨枝甘露', bn: 'ম্যাঙ্গো পোমেলো সাগু'},
            },
        ],
    },
    {
        id: 'vegetarian',
        label: {en: 'Vegetarian', zh: '素食', bn: 'নিরামিষ'},
        // seven courses rather than eight — this menu has no fish course
        courses: [
            {
                label: COURSE.starters,
                dish: {en: 'Deep-fried Crispy Vegetarian Rolls', zh: '香酥素春卷', bn: 'মুচমুচে ভেজিটেরিয়ান রোল'},
            },
            {
                label: COURSE.soup,
                dish: {en: 'Sweet Corn Soup with White Fungus', zh: '银耳粟米羹', bn: 'সুইট কর্ন ও হোয়াইট ফাঙ্গাস স্যুপ'},
            },
            {
                label: COURSE.seafood,
                dish: {
                    en: 'Sweet & Sour Mock Prawn with Mixed Fruits',
                    zh: '咕噜素虾球伴鲜果',
                    bn: 'টক-মিষ্টি মক চিংড়ি, মিশ্র ফল সহ',
                },
            },
            {
                label: COURSE.meat,
                dish: {en: 'Sautéed Mock Chicken with Dried Chillies', zh: '干辣椒炒素鸡', bn: 'শুকনো মরিচ সহ সতে করা মক চিকেন'},
            },
            {
                label: COURSE.vegetable,
                dish: {
                    en: 'Braised Sliced Vegetarian Abalone with Black Mushroom and Seasonal Vegetable',
                    zh: '北菇时蔬烩素鲍片',
                    bn: 'ব্ল্যাক মাশরুম ও মৌসুমি সবজি সহ ব্রেইজড ভেজিটেরিয়ান অ্যাবালোন',
                },
            },
            {
                label: COURSE.noodle,
                dish: {en: 'Stewed Ee-Fu Noodle', zh: '干烧伊面', bn: 'স্টিউড ই-ফু নুডল'},
            },
            {
                label: COURSE.dessert,
                dish: {
                    en: 'Double-boiled Peach Resin with Snow Pear and White Fungus',
                    zh: '炖桃胶雪梨银耳',
                    bn: 'পিচ রেজিন, স্নো পিয়ার ও হোয়াইট ফাঙ্গাস',
                },
                note: {en: 'Served cold', zh: '冰镇', bn: 'ঠান্ডা পরিবেশিত'},
            },
        ],
    },
]

function MenuModal({onClose, closing, t, locale}) {
    const available = MENUS.filter(m => m.courses.length > 0)
    const [active, setActive] = useState(available[0]?.id)

    useEffect(() => {
        const onKey = e => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [onClose])

    const menu = available.find(m => m.id === active) ?? available[0]
    const text = l => l[shortCode(locale)] ?? l.en

    return (
        <div className={`modal-overlay${closing ? ' closing' : ''}`} onClick={onClose}>
            <div className={`modal${closing ? ' closing' : ''}`} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <span className="modal-title">{t.menuTitle}</span>
                    <button className="popover-close-btn modal-close" onClick={onClose}
                            aria-label={t.close}>✕</button>
                </div>

                {available.length > 1 && (
                    <div className="menu-tabs" role="tablist">
                        {available.map(m => (
                            <button
                                key={m.id}
                                role="tab"
                                aria-selected={m.id === menu.id}
                                className={`menu-tab${m.id === menu.id ? ' active' : ''}`}
                                onClick={() => setActive(m.id)}
                            >{text(m.label)}</button>
                        ))}
                    </div>
                )}

                <div className="modal-body">
                    {menu?.courses.map((c, i) => (
                        <div key={i} className="menu-course">
                            <span className="menu-course-label">{text(c.label)}</span>
                            <div className="menu-course-body">
                                {c.items ? (
                                    <ul className="menu-platter">
                                        {c.items.map((it, j) => <li key={j}>{text(it)}</li>)}
                                    </ul>
                                ) : (
                                    <span className="menu-course-text">{text(c.dish)}</span>
                                )}
                                {c.note && <span className="menu-course-note">{text(c.note)}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// cx/cy are in the 1600×895 seating.png pixel space (matches the SVG viewBox below)
const MAP_W = 1600
const MAP_H = 895

const TABLE_POSITIONS = [
    {key: 'Table 1',  cx:  231, cy:  225},
    {key: 'Table 2',  cx:  231, cy:  342},
    {key: 'Table 3',  cx:  238, cy:  464},
    {key: 'Table 4',  cx:  238, cy:  581},
    {key: 'Table 5',  cx:  243, cy:  702},
    {key: 'Table 6',  cx:  380, cy:  214},
    {key: 'Table 7',  cx:  378, cy:  330},
    {key: 'Table 8',  cx:  380, cy:  452},
    {key: 'Table 9',  cx:  386, cy:  575},
    {key: 'Table 10', cx:  380, cy:  701},
    {key: 'Table 11', cx:  540, cy:  281},
    {key: 'Table 12', cx:  537, cy:  414},
    {key: 'Table 13', cx:  542, cy:  552},
    {key: 'Table 14', cx:  542, cy:  702},
    {key: 'VIP 1',    cx:  692, cy:  435},
    {key: 'Table 16', cx:  692, cy:  565},
    {key: 'Table 17', cx:  691, cy:  703},
    {key: 'VIP 2',    cx:  925, cy:  430},
    {key: 'Table 19', cx:  931, cy:  562},
    {key: 'Table 20', cx:  930, cy:  702},
    {key: 'Table 21', cx: 1086, cy:  284},
    {key: 'Table 22', cx: 1084, cy:  418},
    {key: 'Table 23', cx: 1094, cy:  561},
    {key: 'Table 24', cx: 1093, cy:  703},
    {key: 'Table 25', cx: 1256, cy:  257},
    {key: 'Table 26', cx: 1257, cy:  382},
    {key: 'Table 27', cx: 1261, cy:  497},
    {key: 'Table 28', cx: 1272, cy:  606},
    {key: 'Table 29', cx: 1269, cy:  726},
    {key: 'Table 30', cx: 1438, cy:  253},
    {key: 'Table 31', cx: 1435, cy:  369},
    {key: 'Table 32', cx: 1440, cy:  491},
    {key: 'Table 33', cx: 1440, cy:  605},
    {key: 'Table 34', cx: 1446, cy:  716},
]

// Only light up tables that actually have guests assigned, so a tap never
// opens an empty popover while the guest list is still being filled in.
const SEATED_TABLES = new Set(guests.map(g => g.table))
const ACTIVE_TABLES = TABLE_POSITIONS.filter(p => SEATED_TABLES.has(p.key))

function guestsAt(key) {
    return guests.filter(g => g.table === key)
}

function GuestIcon({guestOf, size}) {
    return guestOf === 'Hadi'
        ? <IoMdBowtie className="guest-icon male-icon" size={size}/>
        : <GiTiara className="guest-icon female-icon" size={size}/>
}

/* Shared hotspot layer. Lives inside whatever element is transformed, so the
   browser keeps hit-testing correct under rotation and zoom. */
// hotspotR is bumped in the fullscreen viewer: at fit-to-screen the default
// radius lands at ~39px on a phone, under the 44px minimum touch target.
// Closest table spacing is 109px, so anything under r=54 stays non-overlapping.
function TableOverlay({selectedKey, onSelect, className, hotspotR = 46}) {
    return (
        <svg className={className} viewBox={`0 0 ${MAP_W} ${MAP_H}`}>
            {ACTIVE_TABLES.map(({key, cx, cy}, i) => (
                <g key={key}>
                    <circle cx={cx} cy={cy} r="42" className="table-pulse"
                            style={{animationDelay: `${i * 0.28}s`}}/>
                    <circle cx={cx} cy={cy} r="42" className="table-ring"/>
                    <circle
                        cx={cx} cy={cy} r={hotspotR}
                        className={`table-hotspot${selectedKey === key ? ' selected' : ''}`}
                        onClick={e => onSelect(e, key, cx, cy)}
                    />
                </g>
            ))}
        </svg>
    )
}

const MAX_ZOOM = 8

/* Fullscreen floor plan, as a lightbox. A phone gives the map ~390px of width
   inline, rendering table numbers at ~8px. Here the plan is sized to fill the
   screen's HEIGHT and the guest pans sideways through the room — no rotation,
   so turning the phone never flips the map out from under them. */
function FloorPlanViewer({onClose, t}) {
    const [fit, setFit] = useState(null)   // { base, minZoom }
    const [stage, setStage] = useState(null) // stage box in CSS px
    const [zoom, setZoom] = useState(1)
    const [pan, setPan] = useState({x: 0, y: 0})
    const [selected, setSelected] = useState(null)
    const stageRef = useRef(null)
    const cardRef = useRef(null)
    const pointers = useRef(new Map())
    const gesture = useRef(null)

    // Open on the whole room so a guest gets their bearings first, then zooms
    // in to read it. Zoom 1 is the full plan; there is nothing to zoom out to.
    const measure = useCallback(() => {
        const el = stageRef.current
        if (!el) return
        const {width: w, height: h} = el.getBoundingClientRect()
        const PAD = 16
        const contain = Math.min((w - PAD) / MAP_W, (h - PAD) / MAP_H)
        setStage({w, h})
        setFit({base: contain, minZoom: 1})
    }, [])

    useLayoutEffect(() => {
        measure()
        const el = stageRef.current
        const ro = el && 'ResizeObserver' in window ? new ResizeObserver(measure) : null
        ro?.observe(el)
        window.addEventListener('orientationchange', measure)
        return () => {
            ro?.disconnect()
            window.removeEventListener('orientationchange', measure)
        }
    }, [measure])

    useEffect(() => {
        const onKey = e => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', onKey)
        // the stage swallows touch scrolling, so stop the page moving underneath
        const prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            window.removeEventListener('keydown', onKey)
            document.body.style.overflow = prev
        }
    }, [onClose])

    const clampPan = useCallback((next, z) => {
        const el = stageRef.current
        if (!el || !fit) return next
        const {width: w, height: h} = el.getBoundingClientRect()
        // half the overflow on each axis, in the canvas's on-screen orientation
        const drawnW = MAP_W * fit.base * z
        const drawnH = MAP_H * fit.base * z
        const mx = Math.max(0, (drawnW - w) / 2)
        const my = Math.max(0, (drawnH - h) / 2)
        return {
            x: Math.max(-mx, Math.min(mx, next.x)),
            y: Math.max(-my, Math.min(my, next.y)),
        }
    }, [fit])

    const applyZoom = useCallback((nextZoom, originX, originY) => {
        const el = stageRef.current
        if (!el) return
        const r = el.getBoundingClientRect()
        // keep the point under the fingers/cursor pinned while scaling
        const cx = originX - r.left - r.width / 2
        const cy = originY - r.top - r.height / 2
        setZoom(prevZoom => {
            const z = Math.max(fit?.minZoom ?? 1, Math.min(MAX_ZOOM, nextZoom))
            setPan(prevPan => clampPan({
                x: cx - (cx - prevPan.x) * (z / prevZoom),
                y: cy - (cy - prevPan.y) * (z / prevZoom),
            }, z))
            return z
        })
    }, [clampPan, fit])

    const onPointerDown = e => {
        pointers.current.set(e.pointerId, {x: e.clientX, y: e.clientY})
        const pts = [...pointers.current.values()]
        if (pts.length === 2) {
            const dx = pts[0].x - pts[1].x, dy = pts[0].y - pts[1].y
            gesture.current = {dist: Math.hypot(dx, dy), zoom}
        } else if (pts.length === 1) {
            gesture.current = {pan: {...pan}, from: {x: e.clientX, y: e.clientY}, moved: 0}
        }
    }

    // Capturing on pointerdown would retarget the following click to the stage,
    // so a tap would never reach the table circles. Capture only once a drag is
    // actually under way, which is the only time we need events off-element.
    const captureNow = e => {
        const g = gesture.current
        if (!g || g.captured) return
        try { e.currentTarget.setPointerCapture?.(e.pointerId) } catch { /* not capturable */ }
        g.captured = true
    }

    const onPointerMove = e => {
        if (!pointers.current.has(e.pointerId)) return
        pointers.current.set(e.pointerId, {x: e.clientX, y: e.clientY})
        const pts = [...pointers.current.values()]
        const g = gesture.current
        if (!g) return
        if (pts.length >= 2 && g.dist) {
            captureNow(e)
            const dx = pts[0].x - pts[1].x, dy = pts[0].y - pts[1].y
            const dist = Math.hypot(dx, dy)
            applyZoom(g.zoom * (dist / g.dist), (pts[0].x + pts[1].x) / 2, (pts[0].y + pts[1].y) / 2)
        } else if (pts.length === 1 && g.pan) {
            const dx = e.clientX - g.from.x, dy = e.clientY - g.from.y
            g.moved = Math.max(g.moved, Math.hypot(dx, dy))
            if (g.moved > 4) captureNow(e)
            setPan(clampPan({x: g.pan.x + dx, y: g.pan.y + dy}, zoom))
        }
    }

    const onPointerUp = e => {
        const g = gesture.current
        pointers.current.delete(e.pointerId)
        // a drag shouldn't also dismiss the sheet; a real tap on empty map should
        if (pointers.current.size === 0) {
            if (g?.pan && g.moved < 6 && e.target === e.currentTarget) setSelected(null)
            gesture.current = null
        }
    }

    const onWheel = e => {
        e.preventDefault()
        applyZoom(zoom * (e.deltaY < 0 ? 1.15 : 1 / 1.15), e.clientX, e.clientY)
    }

    const reset = () => { setZoom(1); setPan({x: 0, y: 0}) }

    const handleSelect = (e, key) => {
        e.stopPropagation()
        setSelected(cur => cur === key ? null : key)
    }

    const cardGuests = selected ? guestsAt(selected) : []

    // Project the selected table's map coordinates into screen space so the
    // card can sit beside it and follow it through pan and zoom, while its own
    // text stays outside the transform and therefore a constant size.
    // onScreen: panning the table out of view takes its card with it, rather
    // than leaving one pinned to an edge pointing at nothing.
    const anchor = useMemo(() => {
        const pos = selected && ACTIVE_TABLES.find(p => p.key === selected)
        if (!pos || !fit || !stage) return null
        const s = fit.base * zoom
        const x = stage.w / 2 + pan.x + (pos.cx - MAP_W / 2) * s
        const y = stage.h / 2 + pan.y + (pos.cy - MAP_H / 2) * s
        const r = 52 * s
        return {x, y, r, onScreen: x > -r && x < stage.w + r && y > -r && y < stage.h + r}
    }, [selected, fit, stage, zoom, pan])

    // Prefer the side of the table with more room, then keep the card on screen.
    useLayoutEffect(() => {
        const el = cardRef.current
        if (!el || !anchor || !stage) return
        const GAP = 12, EDGE = 10
        // offset*, not a rect: the open animation scales the card, and a
        // transformed rect would place it against a size it is about to leave
        const cw = el.offsetWidth, ch = el.offsetHeight
        const left = anchor.x + anchor.r + GAP + cw <= stage.w - EDGE
            ? anchor.x + anchor.r + GAP
            : anchor.x - anchor.r - GAP - cw
        el.style.left = `${Math.max(EDGE, Math.min(left, stage.w - cw - EDGE))}px`
        el.style.top = `${Math.max(EDGE, Math.min(anchor.y - ch / 2, stage.h - ch - EDGE))}px`
    }, [anchor, stage, cardGuests.length])

    return (
        <div className="fp-overlay">
            <div className="fp-bar">
                <span className="fp-title">{t.floorPlanTitle}</span>
                <div className="fp-bar-right">
                    {Math.abs(zoom - 1) > 0.01 && (
                        <button className="fp-btn fp-reset" onClick={reset}>{t.resetZoom}</button>
                    )}
                    <button className="fp-btn fp-close" onClick={onClose} aria-label={t.close}>✕</button>
                </div>
            </div>

            <div
                className="fp-stage"
                ref={stageRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onWheel={onWheel}
            >
                {fit && (
                    <div
                        className="fp-canvas"
                        style={{
                            width: MAP_W,
                            height: MAP_H,
                            transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px) `
                                + `scale(${fit.base * zoom})`,
                        }}
                    >
                        <img src={seatingImg} alt="" className="fp-img" draggable="false"/>
                        <TableOverlay
                            className="fp-overlay-svg"
                            selectedKey={selected}
                            onSelect={handleSelect}
                            hotspotR={52}
                        />
                    </div>
                )}

                {/* The card owns its pointer and wheel events: without this the
                    stage would read a scroll of the guest list as a map pan or
                    zoom, and the list could never be scrolled. */}
                {anchor?.onScreen && (
                    <div
                        ref={cardRef}
                        className="fp-card"
                        onPointerDown={e => e.stopPropagation()}
                        onWheel={e => e.stopPropagation()}
                    >
                        <div className="fp-card-header">
                            <span>{t.tableLabel(selected)}</span>
                            <span className="table-guest-count">
                                <FiUsers size={13}/>
                                {cardGuests.length}
                            </span>
                            <button className="popover-close-btn" onClick={() => setSelected(null)}
                                    aria-label={t.close}>✕</button>
                        </div>
                        <ul className="fp-card-list">
                            {cardGuests.map((g, i) => (
                                <li key={i} className="table-popover-guest">
                                    <span>{g.name}</span>
                                    <GuestIcon guestOf={g.guestOf} size={19}/>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {!selected && <p className="fp-hint">{t.pinchHint}</p>}
            </div>
        </div>
    )
}

function SeatingMap({t}) {
    const [popover, setPopover] = useState(null) // { key, xPct, yPct, closing }
    const [showFade, setShowFade] = useState(false)
    const [popTop, setPopTop] = useState(0)
    const [expanded, setExpanded] = useState(false)
    const listRef = useRef(null)
    const popRef = useRef(null)
    const wrapRef = useRef(null)

    const closePopover = () => {
        setPopover(p => p ? {...p, closing: true} : null)
        setTimeout(() => setPopover(null), 150)
    }

    const tableGuests = useMemo(() => popover ? guestsAt(popover.key) : [], [popover])

    useEffect(() => {
        const el = listRef.current
        if (!el) return
        setShowFade(el.scrollHeight > el.clientHeight)
        el.scrollTop = 0
    }, [popover])

    useLayoutEffect(() => {
        if (!popover || !popRef.current || !wrapRef.current) return
        const ph = popRef.current.offsetHeight
        const wh = wrapRef.current.offsetHeight
        const anchor = (popover.yPct / 100) * wh
        const GAP = 12, EDGE = 6
        // open on whichever side of the table has more room, then keep it in bounds
        const top = anchor > wh / 2 ? anchor - GAP - ph : anchor + GAP
        setPopTop(Math.max(EDGE, Math.min(top, wh - ph - EDGE)))
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
        const next = {key, xPct: (cx / MAP_W) * 100, yPct: (cy / MAP_H) * 100}
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
            <div className="seating-map-wrap" ref={wrapRef} onClick={closePopover}>
                <img src={seatingImg} alt="Seating arrangement" className="seating-img"/>
                <TableOverlay className="seating-overlay" selectedKey={popover?.key} onSelect={handleCircleClick}/>

                {/* Below the breakpoint the inline hotspots are ~20px across — too
                    small to hit — so the whole map becomes one target that opens
                    the fullscreen viewer instead. */}
                <button className="seating-tap-shield" onClick={e => {
                    e.stopPropagation(); setExpanded(true)
                }} aria-label={t.viewFloorPlan}/>

                <button className="seating-expand" onClick={e => {
                    e.stopPropagation(); setExpanded(true)
                }}>
                    <FiMaximize2 size={15}/>
                    <span>{t.viewFloorPlan}</span>
                </button>

                {popover && (
                    <div
                        ref={popRef}
                        className={`table-popover${popover.closing ? ' closing' : ''}`}
                        style={{
                            left: `clamp(120px, ${popover.xPct}%, calc(100% - 120px))`,
                            top: `${popTop}px`,
                            transform: 'translateX(-50%)',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="table-popover-header">
                            <span>{t.tableLabel(popover.key)}</span>
                            <div className="table-popover-header-right">
                                <span className="table-guest-count">
                                    <FiUsers size={13}/>
                                    {tableGuests.length}
                                </span>
                                <button className="popover-close-btn" onClick={closePopover}
                                        aria-label={t.close}>✕</button>
                            </div>
                        </div>
                        <div className="table-popover-scroll-wrap">
                            <ul className="table-popover-list" ref={listRef} onScroll={handleListScroll}>
                                {tableGuests.map((g, i) => (
                                    <li key={i} className="table-popover-guest">
                                        <span>{g.name}</span>
                                        <GuestIcon guestOf={g.guestOf} size={19}/>
                                    </li>
                                ))}
                            </ul>
                            {showFade && <div className="table-popover-fade"/>}
                        </div>
                    </div>
                )}
            </div>
            {expanded && <FloorPlanViewer onClose={() => setExpanded(false)} t={t}/>}
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
    const [locale, setLocale] = useState(() => localStorage.getItem('hadifran_guest_locale') || detectLocale())
    useEffect(() => {
        localStorage.setItem('hadifran_guest_locale', locale)
        document.documentElement.lang = locale
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
                        <FaBowlFood size={16}/>
                        <span className="menu-btn-label">{t.menuLabel}</span>
                    </button>
                    <div className="lang-switcher">
                        {localeOptions.map((o, i) => (
                            <Fragment key={o.id}>
                                {i > 0 && <span className="lang-sep" aria-hidden="true">|</span>}
                                <button
                                    className={locale === o.id ? 'lang-opt active' : 'lang-opt'}
                                    onClick={() => setLocale(o.id)}
                                >{o.short}</button>
                            </Fragment>
                        ))}
                    </div>
                </div>

                <header className="hero">
                    <h1 className="hero-names">{t.names}</h1>
                    <div className="hero-rule" aria-hidden="true">
                        <i/><span>✦</span><i/>
                    </div>
                    <p className="hero-date">{t.hero.date}</p>
                    <p className="hero-time">{t.hero.time}</p>
                    <p className="hero-venue">
                        {t.hero.venue}
                        <span className="hero-club">{t.hero.club}</span>
                    </p>
                </header>
                <PhotoStrip/>
                {showMenu && <MenuModal onClose={closeMenu} closing={menuClosing} t={t} locale={locale}/>}

                <section className="section">
                    <h2 className="section-title">{t.findYourSeatTitle}</h2>
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
                                                    <GuestIcon guestOf={item.guestOf} size={28}/>
                                                    <span className="table-badge">{t.tableLabel(item.table)}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                    )}
                </section>

                <section className="section">
                    <h2 className="section-title">{t.theRoom}</h2>
                    <SeatingMap t={t}/>
                </section>
            </div>
            <footer className="footer">
                <div className='footer-item'>
                    <span>Made with <span className="footer-heart">♥</span> for Hadi & Francesca</span>
                </div>
            </footer>
        </>
    )
}
