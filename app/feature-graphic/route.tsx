import { ImageResponse } from 'next/og'

export const runtime = 'edge'

/**
 * Generates the 1024×500 PNG feature graphic for Google Play submission.
 * Visit https://www.tradewithshaffy.com/feature-graphic and right-click → "Save image as".
 *
 * Apple App Store does NOT require a feature graphic — this is Play-only.
 */
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background:
            'linear-gradient(135deg, #0a0a0f 0%, #14140b 50%, #0a0a0f 100%)',
          position: 'relative',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Diagonal gold glow */}
        <div
          style={{
            position: 'absolute',
            top: -200,
            right: -120,
            width: 600,
            height: 600,
            borderRadius: 600,
            background:
              'radial-gradient(circle, rgba(245,197,24,0.18) 0%, rgba(245,197,24,0) 60%)',
            display: 'flex',
          }}
        />

        {/* LEFT COLUMN — branding */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 64px',
            zIndex: 2,
          }}
        >
          {/* Eyebrow chip */}
          <div
            style={{
              display: 'flex',
              alignSelf: 'flex-start',
              backgroundColor: 'rgba(245,197,24,0.12)',
              border: '1px solid rgba(245,197,24,0.3)',
              borderRadius: 999,
              padding: '6px 16px',
              marginBottom: 22,
            }}
          >
            <span
              style={{
                color: '#f5c518',
                fontSize: 14,
                fontWeight: 800,
                letterSpacing: 2,
              }}
            >
              PROFESSIONAL FOREX EDUCATION
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                color: 'white',
                fontSize: 76,
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: -2,
                display: 'flex',
              }}
            >
              Trade with
            </div>
            <div
              style={{
                color: '#f5c518',
                fontSize: 96,
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: -3,
                display: 'flex',
                marginTop: -8,
              }}
            >
              Shafy
            </div>
          </div>

          <div
            style={{
              color: '#94a3b8',
              fontSize: 22,
              fontWeight: 500,
              marginTop: 16,
              display: 'flex',
            }}
          >
            Live Forex Signals · ICT Trading Education
          </div>

          {/* Stat pills */}
          <div style={{ display: 'flex', gap: 14, marginTop: 28 }}>
            <Pill value="80%+" label="Win Rate" />
            <Pill value="5K+" label="Traders" />
            <Pill value="50%" label="Commission" />
          </div>
        </div>

        {/* RIGHT COLUMN — sample signal card */}
        <div
          style={{
            width: 360,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingRight: 56,
            zIndex: 2,
          }}
        >
          <div
            style={{
              width: 300,
              background: '#111118',
              border: '2px solid rgba(0,200,81,0.35)',
              borderRadius: 20,
              padding: 22,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 8px 40px rgba(0,200,81,0.15)',
              transform: 'rotate(-3deg)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 16,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#00c851', fontSize: 11, fontWeight: 800, letterSpacing: 1.5 }}>
                  ● LIVE
                </span>
                <span style={{ color: 'white', fontWeight: 900, fontSize: 22, marginTop: 2 }}>
                  XAU/USD
                </span>
              </div>
              <div
                style={{
                  background: 'linear-gradient(135deg, #00c851, #009940)',
                  color: 'white',
                  fontWeight: 900,
                  fontSize: 16,
                  padding: '8px 18px',
                  borderRadius: 10,
                  display: 'flex',
                }}
              >
                BUY
              </div>
            </div>

            <SignalRow label="Entry" value="2,345" color="white" />
            <SignalRow label="TP1" value="2,358  +125p" color="#00c851" />
            <SignalRow label="TP2" value="2,372  +265p" color="#00c851" />
            <SignalRow label="SL" value="2,335  -105p" color="#ff6666" />
          </div>
        </div>
      </div>
    ),
    {
      width: 1024,
      height: 500,
    }
  )
}

function Pill({ value, label }: { value: string; label: string }) {
  return (
    <div
      style={{
        background: '#111118',
        border: '1px solid rgba(245,197,24,0.2)',
        borderRadius: 12,
        padding: '10px 18px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <span style={{ color: '#f5c518', fontWeight: 900, fontSize: 24 }}>{value}</span>
      <span style={{ color: '#64748b', fontSize: 11, fontWeight: 600, marginTop: -2 }}>{label}</span>
    </div>
  )
}

function SignalRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        background: 'rgba(255,255,255,0.04)',
        borderRadius: 8,
        padding: '8px 12px',
        marginBottom: 6,
      }}
    >
      <span style={{ color: '#64748b', fontSize: 12 }}>{label}</span>
      <span style={{ color, fontWeight: 700, fontSize: 12 }}>{value}</span>
    </div>
  )
}
