# Site Map

## Public routes

- `/` - Homepage
- `/nyheder` - News listing
- `/nyheder/[slug]` - News article
- `/kalender` - Calendar
- `/book-skydebanen` - Shooting range booking information
- `/bliv-medlem` - Membership information
- `/find-os` - Location and contact information

### Activity routes

- `/aktiviteter` - Activities overview
- `/aktiviteter/jagt` - Hunting
- `/aktiviteter/hjalp-til-jagtproven` - Help for the hunting exam
- `/aktiviteter/premieskydninger` - Prize shoots

### Practical information routes

- `/praktisk-info` - Practical information overview
- `/praktisk-info/aabningstider-og-skydetider` - Opening hours and shooting times
- `/praktisk-info/bestyrelsen` - Board

## Admin routes

- `/admin`
- `/admin/nyheder`
- `/admin/nyheder/ny`
- `/admin/nyheder/[id]`
- `/admin/kalender`
- `/admin/premieskydninger`

## External support

- `https://hoj.zendesk.com/hc/da` - Zendesk support/help center link used by the approved footer reference.

## Notes

- Public and admin are separated.
- Nav reflects public routes only.
- Parent routes may be overview pages when route groups contain multiple public pages.
- Some routes may be stubs initially.
