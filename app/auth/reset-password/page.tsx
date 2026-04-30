import Link from 'next/link'
import Image from 'next/image'
import ResetPasswordForm from './ResetPasswordForm'

export default function ResetPasswordPage() {
  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="brand" style={{ marginBottom: 26 }}>
          <Image src="/assets/logo-hoj.png" alt="HOJ" width={52} height={52} />
          <div>
            <div className="mark" style={{ fontSize: 15 }}>HOJ Admin</div>
            <div className="sub">HADSTEN JAGTFORENING</div>
          </div>
        </div>
        <h1 style={{ fontSize: 22, marginBottom: 4 }}>Glemt adgangskode?</h1>
        <p style={{ fontSize: 14, marginBottom: 22 }}>
          Indtast din admin-e-mail, saa sender vi et nulstillingslink til dig.
        </p>
        <ResetPasswordForm />
        <p style={{ fontSize: 14, marginTop: 18, marginBottom: 0 }}>
          <Link href="/admin">Tilbage til log ind</Link>
        </p>
      </div>
    </div>
  )
}
