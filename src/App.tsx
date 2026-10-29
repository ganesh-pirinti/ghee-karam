import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Phone, MapPin, Clock, Menu, X, ArrowRight, Navigation, Star, Quote, ZoomIn, Leaf, Heart, Tag, Users, ArrowUp, ExternalLink } from 'lucide-react'
import heroDosaImg from './assets/hero-dosa.jpg'

// ─── CONSTANTS ──────────────────────────────────────────────────────────────
const PHONE = '099664 55016'
const PHONE_HREF = 'tel:+919966455016'
const ADDRESS = 'GJ3P+QH5, Labbipet,\nVijayawada, Andhra Pradesh 520010'
const DIRECTIONS_URL = 'https://www.google.com/maps/dir/?api=1&destination=Gheekaram+Cafe+Labbipet+Vijayawada+Andhra+Pradesh'
const MAPS_URL = 'https://maps.google.com/?q=Gheekaram+Cafe+Labbipet+Vijayawada'
const CLOSING_TIME = '11:30 PM'

const NAV_ITEMS = [
  { label: 'Home', id: 'home' },
  { label: 'Menu', id: 'menu' },
  { label: 'Our Story', id: 'story' },
  { label: 'Gallery', id: 'gallery' },
  { label: 'Reviews', id: 'reviews' },
  { label: 'Contact', id: 'contact' },
]

const MENU_ITEMS = [
  { id: 'idli', name: 'Idli', te: 'ఇడ్లి', cat: 'tiffins', desc: 'Soft, steamed & fresh', tag: 'Classic',
    img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&q=80' },
  { id: 'dosa', name: 'Dosa', te: 'దోసె', cat: 'tiffins', desc: 'Crispy & delicious', tag: 'Popular',
    img: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&q=80' },
  { id: 'vada', name: 'Vada', te: 'వడ', cat: 'tiffins', desc: 'Hot & crunchy', tag: 'Crispy',
    img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80' },
  { id: 'uttapam', name: 'Uttapam', te: 'ఉత్తపం', cat: 'tiffins', desc: 'Tasty & nutritious', tag: 'Wholesome',
    img: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&q=80' },
  { id: 'pongal', name: 'Pongal', te: 'పొంగల్', cat: 'specials', desc: 'Comfort in a bowl', tag: 'Special',
    img: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=600&q=80' },
  { id: 'coffee', name: 'Filter Coffee', te: 'ఫిల్టర్ కాఫీ', cat: 'drinks', desc: 'Freshly brewed, aromatic', tag: 'Must Try',
    img: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&q=80' },
]

const MENU_CATS = [
  { id: 'all', label: 'All Items' },
  { id: 'tiffins', label: 'Tiffins' },
  { id: 'specials', label: 'Specials' },
  { id: 'drinks', label: 'Drinks' },
]

const GALLERY_IMGS = [
  { id: 1, src: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=900&q=80', alt: 'Crispy South Indian dosa on a banana leaf', cap: 'Signature Dosa' },
  { id: 2, src: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=900&q=80', alt: 'Steaming filter coffee in a brass tumbler', cap: 'Filter Coffee' },
  { id: 3, src: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=900&q=80', alt: 'Medu vada with sambar and chutney', cap: 'Medu Vada' },
  { id: 4, src: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=900&q=80', alt: 'Vegetable uttapam on cast iron', cap: 'Uttapam' },
  { id: 5, src: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=900&q=80', alt: 'Creamy ven pongal with ghee and pepper', cap: 'Ven Pongal' },
  { id: 6, src: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=900&q=80', alt: 'Warm café interior with natural light', cap: 'Our Café' },
]

const REVIEWS = [
  { id: 1, author: 'Moses Premanandan', text: 'Tasty food for reasonable prices at Cafe.', via: 'Dine in', time: '2 years ago', note: '' },
  { id: 2, author: 'Moses Jennepogu', text: 'Reasonable prices and tasty food.', via: 'Dine in', time: '2 years ago', note: 'Local Guide · 11 reviews' },
  { id: 3, author: 'Harish Katragadda', text: 'Good food Nani garu.', via: '', time: '4 months ago', note: '4 reviews' },
]

// ─── HELPERS ────────────────────────────────────────────────────────────────
const SERIF = "'Playfair Display', Georgia, serif"
const SANS = "'DM Sans', system-ui, sans-serif"
const TELUGU = "'Noto Serif Telugu', serif"

function smoothScroll(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

// FadeIn wrapper using framer-motion
function FadeIn({ children, delay = 0, direction = 'up', className = '', style }: {
  children: React.ReactNode; delay?: number; direction?: 'up' | 'left' | 'right' | 'none';
  className?: string; style?: React.CSSProperties
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.05 })
  const dirs = { up: { y: 28, x: 0 }, left: { y: 0, x: 40 }, right: { y: 0, x: -40 }, none: { y: 0, x: 0 } }
  return (
    <motion.div ref={ref} className={className} style={style}
      initial={{ opacity: 0, ...dirs[direction] }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}>
      {children}
    </motion.div>
  )
}

// Gold gradient text
function GoldText({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      background: 'linear-gradient(135deg, #A7792B 0%, #C9973D 50%, #A7792B 100%)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
    }}>{children}</span>
  )
}

// Section label
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: SANS, fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#A7792B', marginBottom: 12 }}>
      {children}
    </p>
  )
}

// Stars
function Stars({ n = 5, size = 14 }: { n?: number; size?: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }} aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} style={{ color: '#A7792B', fill: i < n ? '#A7792B' : 'none' }} />
      ))}
    </div>
  )
}

// Pill button
function Btn({ children, onClick, href, variant = 'primary', style: extraStyle = {} }:
  { children: React.ReactNode; onClick?: () => void; href?: string; variant?: 'primary' | 'outline'; style?: React.CSSProperties }) {
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: SANS, fontWeight: 600, fontSize: 14,
    borderRadius: 50, cursor: 'pointer', transition: 'all 0.25s', border: 'none', textDecoration: 'none',
    ...extraStyle,
  }
  const variants = {
    primary: { background: '#183B2B', color: '#fff', padding: '13px 28px' } as React.CSSProperties,
    outline: { background: 'transparent', color: '#183B2B', padding: '11px 24px', border: '2px solid #183B2B' } as React.CSSProperties,
  }
  const merged = { ...base, ...variants[variant] }
  if (href) return <a href={href} style={merged}>{children}</a>
  return <button onClick={onClick} style={merged}>{children}</button>
}

// ─── NAVIGATION ─────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [active, setActive] = useState('home')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting && e.target.id) setActive(e.target.id) }),
      { rootMargin: '-30% 0px -60% 0px' }
    )
    NAV_ITEMS.forEach(({ id }) => { const el = document.getElementById(id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])

  const navStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, transition: 'all 0.3s ease',
    background: scrolled ? 'rgba(255,249,239,0.96)' : 'transparent',
    backdropFilter: scrolled ? 'blur(14px)' : 'none',
    WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
    borderBottom: scrolled ? '1px solid rgba(167,121,43,0.2)' : '1px solid transparent',
    boxShadow: scrolled ? '0 2px 24px rgba(56,39,25,0.1)' : 'none',
  }

  return (
    <motion.nav style={navStyle} initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }} role="navigation" aria-label="Main navigation">
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>

        {/* Brand */}
        <button onClick={() => smoothScroll('home')} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Gheekaram Cafe — go to top">
          <div style={{ width: 38, height: 38, borderRadius: '50%', border: '2px solid #A7792B', background: 'rgba(167,121,43,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TELUGU, color: '#A7792B', fontSize: 16, fontWeight: 700 }}>ఘ</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 17, color: '#183B2B', lineHeight: 1.1 }}>Gheekaram Cafe</span>
            <span style={{ fontFamily: TELUGU, fontSize: 11, color: '#A7792B' }}>ఘీకరం కేఫ్</span>
          </div>
        </button>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: 2 }} className="gc-nav-links">
          {NAV_ITEMS.map(({ label, id }) => (
            <button key={id} onClick={() => smoothScroll(id)}
              style={{ padding: '8px 12px', fontSize: 13.5, fontWeight: 500, fontFamily: SANS, background: 'none', border: 'none', cursor: 'pointer', color: active === id ? '#A7792B' : '#382719', borderRadius: 6, transition: 'color 0.2s', position: 'relative' }}>
              {label}
              {active === id && (
                <motion.span layoutId="nav-dot" style={{ position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: '#A7792B', display: 'block' }} />
              )}
            </button>
          ))}
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="gc-loc-pill" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'rgba(56,39,25,0.65)', border: '1px solid rgba(167,121,43,0.3)', borderRadius: 20, padding: '5px 12px', whiteSpace: 'nowrap', fontFamily: SANS }}>
            <MapPin size={11} style={{ color: '#A7792B' }} />
            Labbipet, Vijayawada &nbsp;·&nbsp;
            <Clock size={11} style={{ color: '#A7792B' }} />
            &nbsp;Open · Closes {CLOSING_TIME}
          </div>
          <motion.a href={PHONE_HREF} whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#183B2B', color: '#fff', fontSize: 13, fontWeight: 600, padding: '9px 20px', borderRadius: 50, textDecoration: 'none', fontFamily: SANS, boxShadow: '0 4px 14px rgba(24,59,43,0.25)' }}
            aria-label={`Call Gheekaram Cafe: ${PHONE}`}>
            <Phone size={14} />
            <span className="gc-call-text">Call Now</span>
          </motion.a>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="gc-hamburger"
            style={{ display: 'none', flexDirection: 'column', gap: 5, padding: 8, background: 'none', border: 'none', cursor: 'pointer' }}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen}>
            {mobileOpen ? <X size={22} color="#382719" /> : <Menu size={22} color="#382719" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }} style={{ overflow: 'hidden', background: '#FFF9EF', borderTop: '1px solid rgba(167,121,43,0.2)' }}>
            <div style={{ padding: 12 }}>
              {NAV_ITEMS.map(({ label, id }) => (
                <button key={id} onClick={() => { smoothScroll(id); setMobileOpen(false) }}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 16px', fontSize: 14, fontWeight: 500, fontFamily: SANS, background: active === id ? '#183B2B' : 'none', color: active === id ? '#fff' : '#382719', border: 'none', cursor: 'pointer', borderRadius: 8, marginBottom: 2, transition: 'all 0.2s' }}>
                  {label}
                </button>
              ))}
              <div style={{ borderTop: '1px solid rgba(167,121,43,0.2)', paddingTop: 10, marginTop: 4 }}>
                <p style={{ fontSize: 11, color: 'rgba(56,39,25,0.5)', padding: '4px 16px', fontFamily: SANS }}>⏱ Open · Closes {CLOSING_TIME} (verify before visiting)</p>
                <a href={PHONE_HREF} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#183B2B', color: '#fff', fontWeight: 600, padding: 12, borderRadius: 10, marginTop: 8, textDecoration: 'none', fontFamily: SANS }}>
                  <Phone size={14} /> {PHONE}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .gc-nav-links { display: none !important; }
          .gc-loc-pill { display: none !important; }
          .gc-hamburger { display: flex !important; }
          .gc-call-text { display: none; }
        }
      `}</style>
    </motion.nav>
  )
}

// ─── HERO ───────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="home" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', background: '#F7F0E3', paddingTop: 80 }}>
      {/* Dot pattern background */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, opacity: 0.025, backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='15' cy='15' r='1.5' fill='%23183B2B'/%3E%3C/svg%3E\")", backgroundSize: '30px 30px', pointerEvents: 'none' }} />
      {/* Radial gradients */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 8% 20%, rgba(167,121,43,0.05) 0%, transparent 50%), radial-gradient(ellipse at 92% 80%, rgba(24,59,43,0.05) 0%, transparent 50%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px 88px', width: '100%' }}>
        <div className="gc-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>

          {/* Left: text */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(24,59,43,0.07)', border: '1px solid rgba(24,59,43,0.18)', borderRadius: 50, padding: '6px 16px', marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, background: '#A7792B', borderRadius: '50%', display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#183B2B' }}>Vijayawada's Favourite Tiffin Spot</span>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}>
              <h1 style={{ fontFamily: SERIF, fontWeight: 800, lineHeight: 1.03, marginBottom: 4 }}>
                <span style={{ display: 'block', fontSize: 'clamp(50px,7vw,88px)', color: '#183B2B' }}>Gheekaram</span>
                <span style={{ display: 'block', fontSize: 'clamp(50px,7vw,88px)', background: 'linear-gradient(135deg,#A7792B,#C9973D,#A7792B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Cafe</span>
              </h1>
              <p style={{ fontFamily: TELUGU, color: '#A7792B', fontSize: 'clamp(22px,3.5vw,36px)', fontWeight: 600, margin: '6px 0 20px' }}>ఘీకరం కేఫ్</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.36 }}>
              <p style={{ fontFamily: SANS, fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(56,39,25,0.6)', marginBottom: 10 }}>Simple Food · Homely Taste · Everyday Happiness</p>
              <p style={{ fontFamily: SANS, color: 'rgba(56,39,25,0.72)', fontSize: 'clamp(14px,1.4vw,17px)', lineHeight: 1.75, maxWidth: 420, marginBottom: 36 }}>Delicious tiffins made with quality ingredients, served with love in the heart of Labbipet, Vijayawada.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.48 }}
              style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <motion.button onClick={() => smoothScroll('menu')} whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#183B2B', color: '#fff', fontFamily: SANS, fontWeight: 600, fontSize: 14, padding: '13px 28px', borderRadius: 50, border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(24,59,43,0.25)' }}>
                Explore Menu <ArrowRight size={14} />
              </motion.button>
              <motion.button onClick={() => smoothScroll('contact')} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: '#183B2B', fontFamily: SANS, fontWeight: 600, fontSize: 14, padding: '11px 24px', borderRadius: 50, border: '2px solid #183B2B', cursor: 'pointer' }}>
                <MapPin size={14} /> Visit Us
              </motion.button>
            </motion.div>
          </div>

          {/* Right: image */}
          <motion.div initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: 560 }}>
              <div aria-hidden style={{ position: 'absolute', inset: -16, borderRadius: 32, border: '1px solid rgba(167,121,43,0.25)', pointerEvents: 'none' }} />
              <div aria-hidden style={{ position: 'absolute', inset: -32, borderRadius: 40, border: '1px solid rgba(167,121,43,0.1)', pointerEvents: 'none' }} />
              <img src={heroDosaImg}
                alt="Authentic crispy golden South Indian dosa served on a banana leaf with sambar and fresh chutneys — Gheekaram Cafe"
                style={{ width: '100%', height: 'clamp(320px,42vw,500px)', objectFit: 'cover', objectPosition: 'center center', borderRadius: 28, boxShadow: '0 24px 80px rgba(56,39,25,0.22)', display: 'block' }}
                onError={e => { (e.target as HTMLImageElement).src = '/hero-dosa.jpg' }} />
              <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(24,59,43,0.18), transparent)', borderRadius: 28, pointerEvents: 'none' }} />

              {/* Rotating badge */}
              <motion.div initial={{ opacity: 0, scale: 0.5, rotate: -15 }} animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.7, delay: 0.8, type: 'spring', stiffness: 200 }}
                style={{ position: 'absolute', top: 20, right: 20, width: 92, height: 92, borderRadius: '50%', border: '2px solid #A7792B', background: 'rgba(255,249,239,0.93)', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
                aria-hidden>
                <div style={{ fontSize: 20, marginBottom: 3 }}>☕</div>
                <p style={{ fontFamily: SANS, fontSize: 8.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#A7792B', lineHeight: 1.4 }}>Authentic<br />Tiffins<br />Vijayawada</p>
              </motion.div>

              {/* Float card */}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.9 }}
                style={{ position: 'absolute', bottom: 24, right: 16, background: 'rgba(255,255,255,0.93)', backdropFilter: 'blur(8px)', border: '1px solid rgba(167,121,43,0.2)', borderRadius: 16, padding: '14px 18px', boxShadow: '0 8px 32px rgba(56,39,25,0.12)', maxWidth: 170 }}>
                <p style={{ fontFamily: SERIF, fontWeight: 700, color: '#183B2B', fontSize: 15, lineHeight: 1.3 }}>
                  Good Food<br />
                  <GoldText>Better People</GoldText>
                </p>
                <span style={{ color: 'rgba(56,39,25,0.45)', fontSize: 12 }}>❤</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
        style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }} aria-hidden>
        <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(56,39,25,0.4)' }}>Scroll</span>
        <div style={{ width: 20, height: 30, border: '1.5px solid rgba(167,121,43,0.45)', borderRadius: 10, display: 'flex', justifyContent: 'center', paddingTop: 5 }}>
          <div style={{ width: 3, height: 6, background: 'rgba(167,121,43,0.6)', borderRadius: 2, animation: 'scrollDot 1.6s ease-in-out infinite' }} />
        </div>
      </motion.div>

      <style>{`
        @media (max-width: 768px) {
          .gc-hero-grid { grid-template-columns: 1fr !important; }
          .gc-hero-grid > div:last-child { order: -1; }
        }
      `}</style>
    </section>
  )
}

// ─── HIGHLIGHTS ─────────────────────────────────────────────────────────────
const HL_ITEMS = [
  { Icon: Leaf, title: 'Fresh Ingredients', sub: 'Quality First' },
  { Icon: Heart, title: 'Homely Taste', sub: 'Like Home' },
  { Icon: Tag, title: 'Reasonable Prices', sub: 'Great Value' },
  { Icon: Users, title: 'Dine-in & Takeaway', sub: 'Always Welcome' },
]

function Highlights() {
  return (
    <section style={{ background: '#FFF9EF', borderTop: '1px solid rgba(167,121,43,0.2)', borderBottom: '1px solid rgba(167,121,43,0.2)', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }} className="gc-hl-grid">
        {HL_ITEMS.map(({ Icon, title, sub }, i) => (
          <FadeIn key={title} delay={i * 0.08}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10 }}>
              <div style={{ width: 46, height: 46, borderRadius: '50%', border: '1px solid rgba(167,121,43,0.35)', background: 'rgba(167,121,43,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} style={{ color: '#A7792B' }} strokeWidth={1.5} />
              </div>
              <div>
                <div style={{ fontFamily: SANS, fontWeight: 600, color: '#183B2B', fontSize: 13.5 }}>{title}</div>
                <div style={{ fontFamily: SANS, color: '#A7792B', fontSize: 11.5, fontWeight: 500 }}>{sub}</div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
      <style>{`@media(max-width:768px){.gc-hl-grid{grid-template-columns:repeat(2,1fr)!important}}`}</style>
    </section>
  )
}

// ─── MENU ───────────────────────────────────────────────────────────────────
function MenuCard({ item }: { item: typeof MENU_ITEMS[0] }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  return (
    <motion.div
      onMouseMove={e => {
        const r = e.currentTarget.getBoundingClientRect()
        setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -8, y: ((e.clientX - r.left) / r.width - 0.5) * 8 })
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ perspective: 800, transformStyle: 'preserve-3d' }}
      whileHover={{ y: -4 }}>
      <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(167,121,43,0.15)', boxShadow: '0 2px 8px rgba(56,39,25,0.05)', transition: 'box-shadow 0.3s' }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 48px rgba(56,39,25,0.14)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(56,39,25,0.05)'}>
        <div style={{ position: 'relative', height: 180, overflow: 'hidden', background: '#F7F0E3' }}>
          <img src={item.img} alt={`${item.name} — South Indian tiffin at Gheekaram Cafe`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease' }}
            loading="lazy"
            onMouseEnter={e => { (e.target as HTMLElement).style.transform = 'scale(1.09)' }}
            onMouseLeave={e => { (e.target as HTMLElement).style.transform = 'scale(1)' }}
            onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/600x300/F7F0E3/A7792B?text=${item.name}` }} />
          <span style={{ position: 'absolute', top: 12, left: 12, background: '#183B2B', color: '#fff', fontFamily: SANS, fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 50 }}>{item.tag}</span>
        </div>
        <div style={{ padding: 16 }}>
          <h3 style={{ fontFamily: SERIF, fontWeight: 700, color: '#183B2B', fontSize: 20, lineHeight: 1.1 }}>{item.name}</h3>
          <p style={{ fontFamily: TELUGU, color: '#A7792B', fontSize: 11.5, marginTop: 2 }}>{item.te}</p>
          <p style={{ fontFamily: SANS, color: 'rgba(56,39,25,0.62)', fontSize: 13, marginTop: 6 }}>{item.desc}</p>
          <p style={{ fontFamily: SANS, color: 'rgba(56,39,25,0.35)', fontSize: 10, fontStyle: 'italic', marginTop: 8 }}>Demo item — price not confirmed</p>
        </div>
      </div>
    </motion.div>
  )
}

function MenuSection() {
  const [cat, setCat] = useState('all')
  const filtered = cat === 'all' ? MENU_ITEMS : MENU_ITEMS.filter(m => m.cat === cat)

  return (
    <section id="menu" style={{ padding: '80px 0', background: '#F7F0E3' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 40, flexWrap: 'wrap' }}>
          <div>
            <FadeIn><SectionLabel>Our Specials</SectionLabel></FadeIn>
            <FadeIn delay={0.08}>
              <h2 style={{ fontFamily: SERIF, fontWeight: 700, color: '#183B2B', lineHeight: 1.1, fontSize: 'clamp(32px,4.5vw,54px)', marginBottom: 10 }}>
                Tiffins That<br /><GoldText>Feel Like Home</GoldText>
              </h2>
            </FadeIn>
            <FadeIn delay={0.15}><p style={{ fontFamily: SANS, color: 'rgba(56,39,25,0.62)', fontSize: 14.5 }}>Traditional taste, freshly prepared, served with love.</p></FadeIn>
          </div>
          <FadeIn delay={0.1} direction="right">
            <button onClick={() => smoothScroll('contact')} style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: '#183B2B', background: 'none', border: 'none', borderBottom: '2px solid #A7792B', paddingBottom: 2, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
              View Full Menu <ArrowRight size={14} />
            </button>
          </FadeIn>
        </div>

        <FadeIn delay={0.15}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }} role="group" aria-label="Filter by category">
            {MENU_CATS.map(c => (
              <motion.button key={c.id} onClick={() => setCat(c.id)} aria-pressed={cat === c.id} whileTap={{ scale: 0.96 }}
                style={{ fontFamily: SANS, padding: '8px 18px', borderRadius: 50, fontSize: 13, fontWeight: 500, border: `1px solid ${cat === c.id ? '#183B2B' : 'rgba(167,121,43,0.3)'}`, background: cat === c.id ? '#183B2B' : '#fff', color: cat === c.id ? '#fff' : '#382719', cursor: 'pointer', transition: 'all 0.2s', boxShadow: cat === c.id ? '0 4px 12px rgba(24,59,43,0.2)' : 'none' }}>
                {c.label}
              </motion.button>
            ))}
          </div>
        </FadeIn>

        <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }} className="gc-menu-grid">
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.div key={item.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4, delay: i * 0.06 }}>
                <MenuCard item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <FadeIn delay={0.2}>
          <p style={{ fontFamily: SANS, textAlign: 'center', color: 'rgba(56,39,25,0.4)', fontSize: 11, fontStyle: 'italic', marginTop: 36, maxWidth: 560, margin: '36px auto 0' }}>
            * Menu items are illustrative examples only. Prices and full menu are not confirmed — contact the café directly for current offerings.
          </p>
        </FadeIn>

        <style>{`
          @media(max-width:768px){.gc-menu-grid{grid-template-columns:1fr!important}}
          @media(max-width:1024px){.gc-menu-grid{grid-template-columns:repeat(2,1fr)!important}}
        `}</style>
      </div>
    </section>
  )
}

// ─── STORY ──────────────────────────────────────────────────────────────────
function Story() {
  return (
    <section id="story" style={{ padding: '80px 0', background: '#FFF9EF' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="gc-story-grid">

          <FadeIn delay={0.05} direction="left">
            <div style={{ position: 'relative' }}>
              <div aria-hidden style={{ position: 'absolute', top: -32, left: -32, fontSize: 100, opacity: 0.07, lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>🌿</div>
              <div style={{ borderRadius: 28, overflow: 'hidden', boxShadow: '0 20px 64px rgba(56,39,25,0.18)' }} className="gc-story-img-zoom">
                <img src="https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=900&q=85"
                  alt="Warm South Indian café interior with natural light and wooden tables"
                  style={{ width: '100%', height: 500, objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease' }}
                  onMouseEnter={e => { (e.target as HTMLElement).style.transform = 'scale(1.04)' }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.transform = 'scale(1)' }}
                  loading="lazy"
                  onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/900x500/183B2B/A7792B?text=Gheekaram+Cafe' }} />
              </div>

              <div className="gc-story-card" style={{ position: 'absolute', bottom: -24, right: -24, background: '#183B2B', color: '#fff', borderRadius: 20, padding: '20px 24px' }}>
                <div style={{ fontFamily: SERIF, fontSize: 36, fontWeight: 700, color: '#A7792B', lineHeight: 1 }}>100%</div>
                <p style={{ fontFamily: SANS, fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4, lineHeight: 1.4 }}>Fresh ingredients<br />every morning</p>
              </div>

              <div aria-hidden style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(24,59,43,0.6)', backdropFilter: 'blur(6px)', borderRadius: 12, padding: '8px 14px', color: 'rgba(255,255,255,0.88)', fontFamily: SERIF, fontStyle: 'italic', fontSize: 13 }}>
                Labbipet, Vijayawada
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.18}>
            <div style={{ paddingLeft: 16 }} className="gc-story-text">
              <SectionLabel>Our Story</SectionLabel>
              <h2 style={{ fontFamily: SERIF, fontWeight: 700, color: '#183B2B', lineHeight: 1.1, fontSize: 'clamp(32px,4.5vw,54px)', marginBottom: 20 }}>
                A Place for<br /><GoldText>Real Food Lovers</GoldText>
              </h2>
              <p style={{ fontFamily: SANS, color: 'rgba(56,39,25,0.74)', fontSize: 15.5, lineHeight: 1.8, marginBottom: 16 }}>
                Gheekaram Cafe is a beloved tiffin centre in Labbipet, Vijayawada, known for its authentic taste, homely food, and reasonable prices.
              </p>
              <p style={{ fontFamily: SANS, color: 'rgba(56,39,25,0.74)', fontSize: 15.5, lineHeight: 1.8, marginBottom: 24 }}>
                We serve fresh and delicious tiffins made with quality ingredients, bringing a taste of tradition to every plate — morning after morning, with care and warmth.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }} aria-hidden>
                <div style={{ flex: 1, height: 1, background: 'rgba(167,121,43,0.25)' }} />
                <span style={{ fontSize: 18 }}>🌿</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(167,121,43,0.25)' }} />
              </div>

              <ul style={{ listStyle: 'none', marginBottom: 32 }}>
                {['Freshly prepared every morning', 'Quality ingredients, homely recipes', 'Dine-in and takeaway available', 'Open until 11:30 PM (verify before visiting)'].map(p => (
                  <li key={p} style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: SANS, fontSize: 14, color: 'rgba(56,39,25,0.78)', padding: '6px 0' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(167,121,43,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#A7792B' }} />
                    </div>
                    {p}
                  </li>
                ))}
              </ul>

              <Btn onClick={() => smoothScroll('contact')}>Visit Us <ArrowRight size={14} /></Btn>
            </div>
          </FadeIn>
        </div>
      </div>
      <style>{`
        @media(max-width:768px){
          .gc-story-grid{grid-template-columns:1fr!important}
          .gc-story-card{display:none!important}
          .gc-story-text{padding-left:0!important}
        }
      `}</style>
    </section>
  )
}

// ─── GALLERY ────────────────────────────────────────────────────────────────
function Gallery() {
  const [lb, setLb] = useState<number | null>(null)
  const close = useCallback(() => { setLb(null); document.body.style.overflow = '' }, [])
  const go = useCallback((dir: number) => setLb(p => p !== null ? (p + dir + GALLERY_IMGS.length) % GALLERY_IMGS.length : 0), [])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (lb === null) return
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [lb, close, go])

  return (
    <section id="gallery" style={{ padding: '80px 0', background: '#F7F0E3' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 36, flexWrap: 'wrap' }}>
          <div>
            <FadeIn><SectionLabel>Gallery</SectionLabel></FadeIn>
            <FadeIn delay={0.08}>
              <h2 style={{ fontFamily: SERIF, fontWeight: 700, color: '#183B2B', lineHeight: 1.1, fontSize: 'clamp(32px,4.5vw,54px)' }}>
                Moments from<br /><GoldText>Our Café</GoldText>
              </h2>
            </FadeIn>
          </div>
          <FadeIn delay={0.1}>
            <span style={{ fontFamily: SANS, color: 'rgba(56,39,25,0.45)', fontSize: 12, fontStyle: 'italic' }}>Illustrative images — not official café photography</span>
          </FadeIn>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }} className="gc-gallery-grid">
          {GALLERY_IMGS.map((img, i) => (
            <FadeIn key={img.id} delay={i * 0.06} style={{ gridColumn: i === 0 ? 'span 2' : 'span 1' } as React.CSSProperties}>
              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}
                onClick={() => { setLb(i); document.body.style.overflow = 'hidden' }}
                onKeyDown={e => { if (e.key === 'Enter') { setLb(i); document.body.style.overflow = 'hidden' } }}
                tabIndex={0} role="button" aria-label={`View ${img.cap}`}
                style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', background: 'rgba(56,39,25,0.08)' }}>
                <img src={img.src} alt={img.alt}
                  style={{ width: '100%', height: i === 0 ? 260 : 220, objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease' }}
                  loading="lazy"
                  onMouseEnter={e => { (e.target as HTMLElement).style.transform = 'scale(1.08)' }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.transform = 'scale(1)' }}
                  onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/800x400/183B2B/A7792B?text=${encodeURIComponent(img.cap)}` }} />
                <div className="gc-gallery-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(24,59,43,0)', transition: 'background 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(24,59,43,0.38)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(24,59,43,0)' }}>
                  <ZoomIn size={26} style={{ color: '#fff', opacity: 0, transition: 'opacity 0.3s' }} className="gc-zoom-icon" />
                </div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(24,59,43,0.75), transparent)', padding: '12px 14px' }}>
                  <p style={{ fontFamily: SANS, color: '#fff', fontSize: 12, fontWeight: 600 }}>{img.cap}</p>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.2}>
          <p style={{ fontFamily: SANS, textAlign: 'center', color: 'rgba(56,39,25,0.4)', fontSize: 11, fontStyle: 'italic', marginTop: 16 }}>
            Illustrative photography. Actual café appearance may differ.
          </p>
        </FadeIn>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lb !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={close} role="dialog" aria-modal aria-label="Image lightbox"
            style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(15,36,25,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button onClick={close} aria-label="Close lightbox"
              style={{ position: 'absolute', top: 20, right: 20, width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={18} />
            </button>
            <button onClick={e => { e.stopPropagation(); go(-1) }} aria-label="Previous image"
              style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowRight size={20} style={{ transform: 'rotate(180deg)' }} />
            </button>
            <motion.div key={lb} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.2 }}
              onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '85vh' }}>
              <img src={GALLERY_IMGS[lb].src.replace('?w=900', '?w=1400')} alt={GALLERY_IMGS[lb].alt}
                style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: 12, objectFit: 'contain', boxShadow: '0 0 80px rgba(0,0,0,0.5)', display: 'block' }} />
              <p style={{ fontFamily: SANS, color: 'rgba(255,255,255,0.65)', fontSize: 13, textAlign: 'center', marginTop: 12 }}>
                {GALLERY_IMGS[lb].cap} · <span style={{ opacity: 0.6 }}>illustrative</span> · {lb + 1}/{GALLERY_IMGS.length}
              </p>
            </motion.div>
            <button onClick={e => { e.stopPropagation(); go(1) }} aria-label="Next image"
              style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowRight size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media(max-width:768px){.gc-gallery-grid{grid-template-columns:repeat(2,1fr)!important}}
        @media(max-width:480px){.gc-gallery-grid{grid-template-columns:1fr!important}}
        .gc-gallery-overlay:hover .gc-zoom-icon,.gc-gallery-overlay:focus-within .gc-zoom-icon{opacity:1!important}
      `}</style>
    </section>
  )
}

// ─── REVIEWS ────────────────────────────────────────────────────────────────
function Reviews() {
  return (
    <section id="reviews" style={{ padding: '80px 0', background: '#FFF9EF' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ marginBottom: 40 }}>
          <FadeIn><SectionLabel>Reviews</SectionLabel></FadeIn>
          <FadeIn delay={0.08}>
            <h2 style={{ fontFamily: SERIF, fontWeight: 700, color: '#183B2B', lineHeight: 1.1, fontSize: 'clamp(32px,4.5vw,54px)' }}>
              What Our<br /><GoldText>Customers Say</GoldText>
            </h2>
          </FadeIn>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 48, alignItems: 'start' }} className="gc-reviews-layout">
          <FadeIn delay={0.1}>
            <div style={{ background: '#fff', borderRadius: 24, padding: 28, border: '1px solid rgba(167,121,43,0.2)', boxShadow: '0 2px 12px rgba(56,39,25,0.04)', textAlign: 'center' }}>
              <div style={{ fontFamily: SERIF, fontWeight: 700, color: '#183B2B', fontSize: 64, lineHeight: 1 }}>5.0</div>
              <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 4px' }}>
                <Stars />
              </div>
              <p style={{ fontFamily: SANS, color: 'rgba(56,39,25,0.55)', fontSize: 13, marginBottom: 16 }}>7 reviews on Google</p>

              {[5, 4, 3, 2, 1].map(n => (
                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <span style={{ fontFamily: SANS, fontSize: 11, color: 'rgba(56,39,25,0.55)', width: 8 }}>{n}</span>
                  <div style={{ flex: 1, height: 5, background: 'rgba(167,121,43,0.15)', borderRadius: 3 }}>
                    <div style={{ width: n === 5 ? '100%' : '0%', height: '100%', background: '#A7792B', borderRadius: 3 }} />
                  </div>
                </div>
              ))}

              <p style={{ fontFamily: SANS, color: 'rgba(56,39,25,0.45)', fontSize: 10, lineHeight: 1.5, marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(167,121,43,0.15)' }}>Rating and review excerpts sourced from the Google listing — not fabricated.</p>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" style={{ fontFamily: SANS, display: 'inline-block', marginTop: 10, fontSize: 11.5, fontWeight: 600, color: '#183B2B', textDecoration: 'underline', textDecorationColor: 'rgba(167,121,43,0.5)' }}>View on Google Maps →</a>
            </div>
          </FadeIn>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }} className="gc-reviews-cards">
            {REVIEWS.map((r, i) => (
              <FadeIn key={r.id} delay={0.12 + i * 0.08}>
                <div style={{ background: '#fff', borderRadius: 20, padding: 20, border: '1px solid rgba(167,121,43,0.15)', boxShadow: '0 2px 8px rgba(56,39,25,0.04)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Quote size={20} style={{ color: 'rgba(167,121,43,0.3)', marginBottom: 8 }} />
                  <div style={{ marginBottom: 10 }}><Stars n={5} size={13} /></div>
                  <p style={{ fontFamily: SANS, color: 'rgba(56,39,25,0.78)', fontSize: 13.5, lineHeight: 1.65, marginBottom: 14, fontStyle: 'italic', flex: 1 }}>"{r.text}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 12, borderTop: '1px solid rgba(167,121,43,0.12)' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(24,59,43,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SERIF, fontWeight: 700, color: '#183B2B', fontSize: 15, flexShrink: 0 }}>{r.author[0]}</div>
                    <div>
                      <p style={{ fontFamily: SANS, fontWeight: 600, color: '#183B2B', fontSize: 13 }}>{r.author}</p>
                      {r.note && <p style={{ fontFamily: SANS, fontSize: 11, color: 'rgba(56,39,25,0.5)' }}>{r.note}</p>}
                      <div style={{ display: 'flex', gap: 6, marginTop: 2, alignItems: 'center' }}>
                        {r.via && <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 600, background: 'rgba(167,121,43,0.1)', color: '#A7792B', padding: '2px 8px', borderRadius: 50 }}>{r.via}</span>}
                        <span style={{ fontFamily: SANS, fontSize: 10, color: 'rgba(56,39,25,0.45)' }}>{r.time}</span>
                      </div>
                    </div>
                  </div>
                  <p style={{ fontFamily: SANS, color: 'rgba(56,39,25,0.3)', fontSize: 9.5, marginTop: 8, fontStyle: 'italic' }}>via Google</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:1024px){
          .gc-reviews-layout{grid-template-columns:1fr!important}
          .gc-reviews-cards{grid-template-columns:repeat(2,1fr)!important}
        }
        @media(max-width:768px){.gc-reviews-cards{grid-template-columns:1fr!important}}
      `}</style>
    </section>
  )
}

// ─── CONTACT ────────────────────────────────────────────────────────────────
function Contact() {
  const cards = [
    { icon: <MapPin size={18} style={{ color: '#183B2B' }} />, label: 'Address', content: (
      <>
        <p style={{ fontFamily: SANS, color: 'rgba(56,39,25,0.72)', fontSize: 14, lineHeight: 1.6 }}>{ADDRESS}</p>
        <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer"
          style={{ fontFamily: SANS, display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: '#183B2B', marginTop: 8, textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#A7792B' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#183B2B' }}>
          <Navigation size={12} /> Get Directions <ExternalLink size={10} />
        </a>
      </>
    )},
    { icon: <Phone size={18} style={{ color: '#183B2B' }} />, label: 'Phone', content: (
      <a href={PHONE_HREF} style={{ fontFamily: SANS, color: 'rgba(56,39,25,0.72)', fontSize: 14, textDecoration: 'none', fontWeight: 500 }} aria-label={`Call ${PHONE}`}>{PHONE}</a>
    )},
    { icon: <Clock size={18} style={{ color: '#183B2B' }} />, label: 'Hours', content: (
      <>
        <p style={{ fontFamily: SANS, color: 'rgba(56,39,25,0.72)', fontSize: 14 }}>Open · Closes {CLOSING_TIME}</p>
        <p style={{ fontFamily: SANS, color: 'rgba(56,39,25,0.45)', fontSize: 11, fontStyle: 'italic', marginTop: 3 }}>As listed on Google — verify before visiting</p>
      </>
    )},
  ]

  return (
    <section id="contact" style={{ padding: '80px 0', background: '#F7F0E3' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ marginBottom: 40 }}>
          <FadeIn><SectionLabel>Get in Touch</SectionLabel></FadeIn>
          <FadeIn delay={0.08}>
            <h2 style={{ fontFamily: SERIF, fontWeight: 700, color: '#183B2B', lineHeight: 1.1, fontSize: 'clamp(32px,4.5vw,54px)' }}>
              Visit<br /><GoldText>Gheekaram Cafe</GoldText>
            </h2>
          </FadeIn>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }} className="gc-contact-grid">
          <div>
            {cards.map((c, i) => (
              <FadeIn key={c.label} delay={0.08 + i * 0.07}>
                <div style={{ display: 'flex', gap: 14, background: '#fff', borderRadius: 16, padding: 18, border: '1px solid rgba(167,121,43,0.15)', boxShadow: '0 2px 8px rgba(56,39,25,0.04)', marginBottom: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(24,59,43,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{c.icon}</div>
                  <div>
                    <p style={{ fontFamily: SANS, fontWeight: 600, color: '#183B2B', fontSize: 13, marginBottom: 4 }}>{c.label}</p>
                    {c.content}
                  </div>
                </div>
              </FadeIn>
            ))}

            <FadeIn delay={0.28}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
                {['Dine-in', 'Takeaway'].map(s => (
                  <div key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#183B2B', color: '#fff', fontFamily: SANS, fontSize: 12, fontWeight: 600, padding: '7px 16px', borderRadius: 50 }}>
                    <div style={{ width: 6, height: 6, background: '#A7792B', borderRadius: '50%' }} />{s}
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.34}>
              <motion.a href={PHONE_HREF} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#183B2B', color: '#fff', fontFamily: SANS, fontWeight: 600, fontSize: 14, padding: '13px 28px', borderRadius: 50, textDecoration: 'none', boxShadow: '0 8px 24px rgba(24,59,43,0.25)' }}
                aria-label={`Call Gheekaram Cafe: ${PHONE}`}>
                <Phone size={16} /> Call {PHONE}
              </motion.a>
            </FadeIn>
          </div>

          <FadeIn delay={0.14} direction="right">
            <div style={{ background: '#fff', borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(167,121,43,0.2)', boxShadow: '0 8px 32px rgba(56,39,25,0.1)' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3826.4!2d80.6454!3d16.5054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35efd25d1d4fef%3A0x1!2sLabbipet%2C+Vijayawada%2C+Andhra+Pradesh!5e0!3m2!1sen!2sin!4v1698000000000!5m2!1sen!2sin"
                width="100%" height="280" style={{ border: 0, display: 'block' }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                title="Gheekaram Cafe location — Labbipet, Vijayawada"
                aria-label="Google Maps showing Gheekaram Cafe, Labbipet, Vijayawada" />
              <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontFamily: SERIF, fontWeight: 700, color: '#183B2B', fontSize: 15 }}>Gheekaram Cafe</p>
                  <p style={{ fontFamily: SANS, color: 'rgba(56,39,25,0.55)', fontSize: 12, marginTop: 2 }}>Labbipet, Vijayawada</p>
                </div>
                <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#183B2B', color: '#fff', fontFamily: SANS, fontSize: 12, fontWeight: 600, padding: '9px 18px', borderRadius: 50, textDecoration: 'none' }}>
                  <Navigation size={12} /> Get Directions
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
      <style>{`@media(max-width:768px){.gc-contact-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}

// ─── FOOTER ─────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: '#183B2B', color: '#fff' }}>
      {/* Image banner */}
      <div style={{ position: 'relative', height: 130, overflow: 'hidden' }} aria-hidden>
        <img src="https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=1400&q=60"
          alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.18, display: 'block' }}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(24,59,43,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontFamily: SERIF, fontStyle: 'italic', color: 'rgba(255,255,255,0.82)', fontSize: 'clamp(16px,2.5vw,24px)' }}>A Fresh Start to Every Day</p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '52px 24px 32px', display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 40 }} className="gc-footer-grid">
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', border: '2px solid #A7792B', background: 'rgba(167,121,43,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TELUGU, color: '#A7792B', fontSize: 16, fontWeight: 700 }}>ఘ</div>
            <div>
              <p style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 17, lineHeight: 1.1 }}>Gheekaram Cafe</p>
              <p style={{ fontFamily: TELUGU, color: '#A7792B', fontSize: 11 }}>ఘీకరం కేఫ్</p>
            </div>
          </div>
          <p style={{ fontFamily: SANS, color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>Authentic South Indian tiffins in Labbipet, Vijayawada.</p>
          <div style={{ display: 'flex', gap: 6 }}>
            {['Dine-in', 'Takeaway'].map(s => <span key={s} style={{ fontFamily: SANS, fontSize: 10, fontWeight: 600, color: '#A7792B', border: '1px solid rgba(167,121,43,0.35)', background: 'rgba(167,121,43,0.12)', padding: '4px 12px', borderRadius: 50 }}>{s}</span>)}
          </div>
        </div>

        {/* Navigate */}
        <div>
          <p style={{ fontFamily: SANS, fontWeight: 600, fontSize: 13, color: '#fff', letterSpacing: '0.05em', marginBottom: 16 }}>Navigate</p>
          {NAV_ITEMS.map(({ label, id }) => (
            <button key={id} onClick={() => smoothScroll(id)}
              style={{ display: 'block', fontFamily: SANS, fontSize: 13, color: 'rgba(255,255,255,0.55)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', transition: 'color 0.2s', textAlign: 'left' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#A7792B' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)' }}>
              {label}
            </button>
          ))}
        </div>

        {/* Contact */}
        <div>
          <p style={{ fontFamily: SANS, fontWeight: 600, fontSize: 13, color: '#fff', letterSpacing: '0.05em', marginBottom: 16 }}>Contact</p>
          <a href={PHONE_HREF} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: SANS, fontSize: 13, color: 'rgba(255,255,255,0.55)', textDecoration: 'none', marginBottom: 10 }}><Phone size={14} style={{ color: '#A7792B', flexShrink: 0 }} />{PHONE}</a>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontFamily: SANS, fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 10, lineHeight: 1.5 }}><MapPin size={14} style={{ color: '#A7792B', flexShrink: 0, marginTop: 1 }} /><span>GJ3P+QH5, Labbipet,<br />Vijayawada, AP 520010</span></div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontFamily: SANS, fontSize: 13, color: 'rgba(255,255,255,0.55)' }}><Clock size={14} style={{ color: '#A7792B', flexShrink: 0, marginTop: 1 }} /><div>Open · Closes {CLOSING_TIME}<br /><span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>Verify before visiting</span></div></div>
        </div>

        {/* Visit */}
        <div>
          <p style={{ fontFamily: SANS, fontWeight: 600, fontSize: 13, color: '#fff', letterSpacing: '0.05em', marginBottom: 16 }}>Visit Us</p>
          <img src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=65"
            alt="Fresh idli served at a South Indian café"
            loading="lazy" style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 12, opacity: 0.65, marginBottom: 12, display: 'block' }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
          <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid rgba(167,121,43,0.45)', color: '#A7792B', fontFamily: SANS, fontSize: 12, fontWeight: 600, padding: '8px 16px', borderRadius: 50, textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#A7792B'; (e.currentTarget as HTMLElement).style.color = '#183B2B' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#A7792B' }}>
            <MapPin size={12} /> Get Directions
          </a>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '20px 24px', maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <p style={{ fontFamily: SANS, color: 'rgba(255,255,255,0.38)', fontSize: 11.5 }}>© {new Date().getFullYear()} Gheekaram Cafe · Labbipet, Vijayawada · Website for demonstration purposes</p>
        <motion.button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} aria-label="Scroll to top"
          style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid rgba(167,121,43,0.45)', background: 'rgba(167,121,43,0.1)', color: '#A7792B', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ArrowUp size={14} />
        </motion.button>
      </div>

      <style>{`
        @media(max-width:1024px){.gc-footer-grid{grid-template-columns:repeat(2,1fr)!important}}
        @media(max-width:640px){.gc-footer-grid{grid-template-columns:1fr!important}}
      `}</style>
    </footer>
  )
}

// ─── ROOT APP ────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Highlights />
        <MenuSection />
        <Story />
        <Gallery />
        <Reviews />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
