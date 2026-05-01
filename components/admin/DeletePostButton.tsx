'use client'

type Props = {
  message?: string
}

export default function DeletePostButton({ message = 'Slet denne nyhed permanent?' }: Props) {
  return (
    <button
      type="button"
      title="Slet"
      className="btn danger icon-only"
      onClick={(event) => {
        if (!confirm(message)) return
        event.currentTarget.form?.requestSubmit()
      }}
    >
      Slet
    </button>
  )
}
