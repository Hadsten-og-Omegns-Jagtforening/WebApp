'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Icon from './Icon'

type NavLeaf = { id: string; label: string; href: string }
type NavGroup = { id: string; label: string; href: string; children: (NavLeaf & { meta?: string })[] }
type NavItem = NavLeaf | NavGroup

const items: NavItem[] = [
  { id: 'home', label: 'Forside', href: '/' },
  {
    id: 'activities',
    label: 'Aktiviteter',
    href: '/jagt',
    children: [
      { id: 'jagt', label: 'Jagt', href: '/jagt', meta: 'Bukkejagt · Hjort · Efterårsjagt' },
      { id: 'jagtprove', label: 'Hjælp til jagtprøven', href: '/jagtprove', meta: 'Dumpet? Vi hjælper dig videre' },
      { id: 'premie', label: 'Præmieskydninger', href: '/praemieskydninger', meta: 'HOJ Cup · Fastelavn · Skt. Hans · Jul' },
    ],
  },
  {
    id: 'praktisk',
    label: 'Praktisk info',
    href: '/kalender',
    children: [
      { id: 'kalender', label: 'Kalender', href: '/kalender' },
      { id: 'tider', label: 'Åbningstider og skydetider', href: '/aabningstider' },
      { id: 'book', label: 'Lej skydebanen', href: '/book-skydebanen' },
      { id: 'bestyrelsen', label: 'Bestyrelsen', href: '/bestyrelsen' },
    ],
  },
  {
    id: 'omhoj',
    label: 'Om HOJ',
    href: '/bliv-medlem',
    children: [
      { id: 'medlem', label: 'Bliv medlem', href: '/bliv-medlem' },
      { id: 'find', label: 'Find os', href: '/find-os' },
      { id: 'arkiv', label: 'Arkiv', href: '/arkiv' },
    ],
  },
]

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className={`nav${menuOpen ? ' nav--open' : ''}`}>
      <div className="container nav-inner">
        <Link className="logo" href="/">
          <Image src="/assets/logo-hoj.png" alt="Hadsten & Omegns Jagtforening" width={44} height={44} priority />
          <div className="words">
            <span className="mark">Hadsten &amp; Omegns</span>
            <span className="sub">Jagtforening · stiftet 1968</span>
          </div>
        </Link>

        <ul>
          {items.map((it) => (
            <li key={it.id} className={'children' in it && it.children ? 'dropdown' : ''}>
              {'children' in it && it.children ? (
                <>
                  <a>
                    {it.label}
                    <span className="caret">▾</span>
                  </a>
                  <div className="dropdown-menu">
                    {it.children.map((c) => (
                      <Link key={c.id} href={c.href}>
                        <div>{c.label}</div>
                        {'meta' in c && c.meta && <div className="meta">{c.meta}</div>}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link href={it.href}>{it.label}</Link>
              )}
            </li>
          ))}
        </ul>

        <Link className="btn primary sm nav-cta" href="/book-skydebanen">
          <Icon name="crosshair" size={16} />
          Book skydebanen
        </Link>

        <button
          className="nav-hamburger"
          aria-label={menuOpen ? 'Luk menu' : 'Åbn menu'}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <Icon name={menuOpen ? 'x' : 'menu'} size={24} />
        </button>
      </div>
    </header>
  )
}
