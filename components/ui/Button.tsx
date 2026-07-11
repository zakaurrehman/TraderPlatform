import Link from 'next/link'
import type { ReactNode } from 'react'
import { Icon, type IconName } from '@/components/brand/icons'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'success'
type Size = 'sm' | 'md' | 'lg'

const VARIANT: Record<Variant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  success: 'btn-success',
}
const SIZE: Record<Size, string> = { sm: 'btn-sm', md: '', lg: 'btn-lg' }

type ButtonProps = {
  children: ReactNode
  variant?: Variant
  size?: Size
  block?: boolean
  icon?: IconName
  iconRight?: IconName
  loading?: boolean
  className?: string
  /* link mode */
  href?: string
  external?: boolean
  /* button mode */
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  disabled?: boolean
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  icon,
  iconRight,
  loading = false,
  className = '',
  href,
  external = false,
  type = 'button',
  onClick,
  disabled = false,
}: ButtonProps) {
  const cls = ['btn', VARIANT[variant], SIZE[size], block ? 'btn-block' : '', className].filter(Boolean).join(' ')

  const inner = (
    <>
      {loading ? (
        <span
          className="spinner"
          aria-hidden="true"
          style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid currentColor', borderTopColor: 'transparent', display: 'inline-block' }}
        />
      ) : icon ? (
        <Icon name={icon} size={18} />
      ) : null}
      <span>{children}</span>
      {iconRight && !loading ? <Icon name={iconRight} size={18} /> : null}
    </>
  )

  if (href !== undefined) {
    if (external) {
      return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
    }
    return <Link href={href} className={cls}>{inner}</Link>
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} aria-busy={loading} className={cls}>
      {inner}
    </button>
  )
}

export default Button
