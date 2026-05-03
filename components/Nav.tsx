'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Icon from './Icon'

type NavLeaf = { id: string; label: string; href: string }
type NavGroup = { id: string; label: string; children: (NavLeaf & { meta?: string })[] }
type NavItem = NavLeaf | NavGroup

const items: NavItem[] = [
  { id: 'home', label: 'Forside', href: '/' },
  { id: 'news', label: 'Nyheder', href: '/nyheder' },
  {
    id: 'activities',
    label: 'Aktiviteter',
    children: [
      { id: 'activities-overview', label: 'Overblik', href: '/aktiviteter' },
      { id: 'jagt', label: 'Jagt', href: '/aktiviteter/jagt', meta: 'Bukkejagt, hjortejagt og efterårsjagt' },
      { id: 'jagtprove', label: 'Hjælp til jagtprøven', href: '/aktiviteter/hjalp-til-jagtproven', meta: 'Teori, afstand og våbenhåndtering' },
      { id: 'premie', label: 'Præmieskydninger', href: '/aktiviteter/premieskydninger', meta: 'Årets faste skydninger' },
    ],
  },
  {
    id: 'praktisk',
    label: 'Praktisk info',
    children: [
      { id: 'praktisk-overview', label: 'Overblik', href: '/praktisk-info' },
      { id: 'kalender', label: 'Kalender', href: '/kalender' },
      { id: 'tider', label: 'Åbningstider og skydebanen', href: '/praktisk-info/aabningstider-og-skydetider' },
      { id: 'book', label: 'Book skydebanen', href: '/book-skydebanen' },
      { id: 'bestyrelsen', label: 'Folkene bag foreningen', href: '/praktisk-info/bestyrelsen' },
      { id: 'find', label: 'Find os', href: '/find-os' },
    ],
  },
  { id: 'omhoj', label: 'Om HOJ', href: '/om-hoj' },
  { id: 'medlem', label: 'Bliv medlem', href: '/bliv-medlem' },
  { id: 'admin', label: 'Admin', href: '/admin' },
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
          <Image src="/assets/logo-hoj.png" alt="Hadsten og Omegns Jagtforening" width={44} height={44} priority />
          <div className="words">
            <span className="mark">Hadsten og Omegns Jagtforening</span>
            <span className="sub">Stiftet 1933</span>
          </div>
        </Link>

        <ul id="primary-navigation">
          {items.map((it) => (
            <li key={it.id} className={'children' in it ? `dropdown${openGroup === it.id ? ' open' : ''}` : ''}>
              {'children' in it ? (
                <>
                  <button
                    type="button"
                    className="nav-trigger"
                    aria-expanded={openGroup === it.id}
                    aria-controls={`nav-menu-${it.id}`}
                    onClick={() => setOpenGroup((current) => (current === it.id ? null : it.id))}
                  >
                    {it.label}
                    <span className="caret">▾</span>
                  </button>
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
