'use client'

export default function CopyButton({ text }: { text: string }) {
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text)
      }}
      style={{
        marginTop: 8, padding: '8px 16px', borderRadius: 8,
        background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
        color: '#fff', border: 'none', fontWeight: 700,
        fontSize: 13, cursor: 'pointer', width: '100%'
      }}
    >
      Copy Link
    </button>
  )
}
