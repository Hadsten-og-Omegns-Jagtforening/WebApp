type IconName =
  | 'calendar' | 'crosshair' | 'clock' | 'trophy' | 'ticket'
  | 'users' | 'mail' | 'phone' | 'tree-pine' | 'arrow-right'
  | 'chevron-down' | 'chevron-right' | 'check' | 'menu' | 'map-pin'
  | 'search' | 'pencil' | 'trash' | 'x' | 'log-out' | 'plus'
  | 'image' | 'eye' | 'chevron-left' | 'chevron-up'
  | 'claypigeon' | 'shotshell'

type IconProps = {
  name: IconName
  size?: number
  className?: string
}

export default function Icon({ name, size = 24, className }: IconProps) {
  // Helper function to render different element types
  const renderIcon = () => {
    const commonProps = {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 1.75,
      strokeLinecap: 'round' as const,
      strokeLinejoin: 'round' as const,
      className,
      'aria-hidden': 'true',
    }

    switch (name) {
      case 'crosshair':
        return (
          <svg {...commonProps}>
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="5" />
            <line x1="22" y1="12" x2="18" y2="12" />
            <line x1="6" y1="12" x2="2" y2="12" />
            <line x1="12" y1="2" x2="12" y2="6" />
            <line x1="12" y1="22" x2="12" y2="18" />
          </svg>
        )
      case 'calendar':
        return (
          <svg {...commonProps}>
            <rect x="3" y="5" width="18" height="16" rx="1.5" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="8" y1="3" x2="8" y2="7" />
            <line x1="16" y1="3" x2="16" y2="7" />
          </svg>
        )
      case 'claypigeon':
        return (
          <svg {...commonProps}>
            <ellipse cx="12" cy="12" rx="9" ry="3.2" />
            <path d="M3 12 C 5 9, 19 9, 21 12" />
          </svg>
        )
      case 'shotshell':
        return (
          <svg {...commonProps}>
            <rect x="7" y="3" width="10" height="11" rx="1.5" />
            <rect x="7" y="14" width="10" height="7" rx="1" />
            <line x1="7" y1="17" x2="17" y2="17" />
          </svg>
        )
      case 'map-pin':
        return (
          <svg {...commonProps}>
            <path d="M12 21s-7-5-7-11a7 7 0 0 1 14 0c0 6-7 11-7 11Z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
        )
      case 'users':
        return (
          <svg {...commonProps}>
            <circle cx="9" cy="8" r="3.5" />
            <path d="M2 21c0-4 3-6 7-6s7 2 7 6" />
            <circle cx="17" cy="6" r="2.5" />
            <path d="M22 17c0-3-2-5-5-5" />
          </svg>
        )
      case 'trophy':
        return (
          <svg {...commonProps}>
            <path d="M6 4h12v4a6 6 0 0 1-12 0V4Z" />
            <path d="M4 4h2v2a2 2 0 0 1-2 2V4Zm16 0h-2v2a2 2 0 0 0 2 2V4Z" />
            <path d="M12 14v4m-3 2h6" />
          </svg>
        )
      case 'ticket':
        return (
          <svg {...commonProps}>
            <path d="M3 7h18v4a2 2 0 0 0 0 4v2H3v-2a2 2 0 0 0 0-4V7Z" />
            <path d="M9 7v10" />
          </svg>
        )
      case 'tree-pine':
        return (
          <svg {...commonProps}>
            <path d="M12 3 L7 9 h3 v4 h-4 l6 6 6-6 h-4 v-4 h3 Z" />
          </svg>
        )
      case 'mail':
        return (
          <svg {...commonProps}>
            <rect x="3" y="5" width="18" height="14" rx="1.5" />
            <path d="M3 7 L12 13 L21 7" />
          </svg>
        )
      case 'phone':
        return (
          <svg {...commonProps}>
            <path d="M5 4h3l2 5-2 1a10 10 0 0 0 6 6l1-2 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
          </svg>
        )
      case 'arrow-right':
        return (
          <svg {...commonProps}>
            <line x1="4" y1="12" x2="20" y2="12" />
            <polyline points="14 6 20 12 14 18" />
          </svg>
        )
      case 'chevron-down':
        return (
          <svg {...commonProps}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        )
      case 'chevron-right':
        return (
          <svg {...commonProps}>
            <polyline points="9 6 15 12 9 18" />
          </svg>
        )
      case 'chevron-left':
        return (
          <svg {...commonProps}>
            <polyline points="15 6 9 12 15 18" />
          </svg>
        )
      case 'chevron-up':
        return (
          <svg {...commonProps}>
            <polyline points="18 15 12 9 6 15" />
          </svg>
        )
      case 'check':
        return (
          <svg {...commonProps}>
            <polyline points="5 12 10 17 19 8" />
          </svg>
        )
      case 'clock':
        return (
          <svg {...commonProps}>
            <circle cx="12" cy="12" r="9" />
            <polyline points="12 7 12 12 16 14" />
          </svg>
        )
      case 'menu':
        return (
          <svg {...commonProps}>
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
          </svg>
        )
      case 'search':
        return (
          <svg {...commonProps}>
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        )
      case 'pencil':
        return (
          <svg {...commonProps}>
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15H9v-3L18.5 2.5Z" />
          </svg>
        )
      case 'trash':
        return (
          <svg {...commonProps}>
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        )
      case 'x':
        return (
          <svg {...commonProps}>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        )
      case 'log-out':
        return (
          <svg {...commonProps}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 12 16 12 16 12" />
            <line x1="16" y1="8" x2="16" y2="16" />
            <polyline points="12 12 19 12 19 5" />
          </svg>
        )
      case 'plus':
        return (
          <svg {...commonProps}>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        )
      case 'image':
        return (
          <svg {...commonProps}>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        )
      case 'eye':
        return (
          <svg {...commonProps}>
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )
      default:
        return null
    }
  }

  return renderIcon()
}
