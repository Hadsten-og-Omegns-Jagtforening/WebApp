'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Icon from './Icon'

type NavLeaf = { id: string; label: string; href: string }
type NavGroup = { id: string; label: string; href?: string; children: (NavLeaf & { meta?: string })[] }
type NavItem = NavLeaf | NavGroup

const items: NavItem[] = [
  { id: 'home', label: 'Forside', href: '/' },
  { id: 'news', label: 'Nyheder', href: '/nyheder' },
  { id: 'medlem', label: 'Bliv medlem', href: '/bliv-medlem' },
  {
    id: 'activities',
    label: 'Aktiviteter',
    href: '/aktiviteter',
    children: [
      { id: 'jagt', label: 'Jagt', href: '/aktiviteter/jagt', meta: 'Bukkejagt · Hjort · Efterårsjagt' },
      { id: 'jagtprove', label: 'Hjælp til jagtprøven', href: '/aktiviteter/hjalp-til-jagtproven', meta: 'Dumpet? Vi hjælper dig videre' },
      { id: 'premie', label: 'Præmieskydninger', href: '/aktiviteter/premieskydninger', meta: 'HOJ Cup · Fastelavn · Skt. Hans · Jul' },
    ],
  },
  {
    id: 'praktisk',
    label: 'Praktisk info',
    href: '/praktisk-info',
    children: [
      { id: 'book', label: 'Book skydebanen', href: '/book-skydebanen' },
      { id: 'tider', label: 'Åbningstider og skydebanen', href: '/praktisk-info/aabningstider-og-skydetider' },
      { id: 'folkene', label: 'Folkene bag foreningen', href: '/praktisk-info/folkene-bag-foreningen' },
      { id: 'historien', label: 'Historien om os', href: '/praktisk-info/historien-om-os' },
      { id: 'kalender', label: 'Kalender', href: '/kalender' },
      { id: 'find', label: 'Find os', href: '/find-os' },
    ],
  },
]

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState<string | null>(null)

  const closeMenus = () => {
    setMenuOpen(false)
    setOpenGroup(null)
  }

  return (
    <header className={`nav${menuOpen ? ' nav--open' : ''}`}>
      <div className="container nav-inner">
        <Link className="logo" href="/" onClick={closeMenus}>
          <Image src="/assets/logo-hoj.png" alt="Hadsten & Omegns Jagtforening" width={44} height={44} priority />
          <div className="words">
            <span className="mark">Hadsten &amp; Omegns</span>
            <span className="sub">Jagtforening · stiftet 1968</span>
          </div>
        </Link>

        <ul id="primary-navigation">
          {items.map((it) => (
            <li key={it.id} className={'children' in it ? `dropdown${openGroup === it.id ? ' open' : ''}` : ''}>
              {'children' in it ? (
                <>
                  <Link
                    href={(it as NavGroup).href ?? '#'}
                    className="nav-trigger"
                    aria-expanded={openGroup === it.id}
                    aria-controls={`nav-menu-${it.id}`}
                    onClick={(e) => {
                      if (window.innerWidth <= 860) {
                        e.preventDefault()
                        setOpenGroup((current) => (current === it.id ? null : it.id))
                      }
                    }}
                  >
                    {it.label}
                    <span className="caret">▾</span>
                  </Link>
                  <div className="dropdown-menu" id={`nav-menu-${it.id}`}>
                    {it.children.map((child) => (
                      <Link key={child.id} href={child.href} onClick={closeMenus}>
                        <div>{child.label}</div>
                        {child.meta && <div className="meta">{child.meta}</div>}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link href={it.href} onClick={closeMenus}>{it.label}</Link>
              )}
            </li>
          ))}
        </ul>

        <Link className="btn primary sm nav-cta" href="/book-skydebanen" onClick={closeMenus}>
          <Icon name="crosshair" size={16} />
          Book skydebanen
        </Link>

        <button
          className="nav-hamburger"
          type="button"
          aria-label={menuOpen ? 'Luk menu' : 'Åbn menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => {
            setMenuOpen((open) => !open)
            setOpenGroup(null)
          }}
        >
          <Icon name={menuOpen ? 'x' : 'menu'} size={24} />
        </button>
      </div>
    </header>
  )
}
