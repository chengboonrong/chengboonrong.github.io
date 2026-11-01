import { ArrowUpRight } from '@phosphor-icons/react/ssr'
import { useEffect } from 'react'
import type { Link, Role, Shot } from './content'

export const ICON = 'regular' as const

export const pill = 'inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 text-[0.95rem] font-medium transition-[transform,background-color,border-color] duration-200 active:translate-y-px'
export const pillPrimary = `${pill} bg-blue text-ground hover:bg-ink`
export const pillSecondary = `${pill} border border-line bg-ground/60 text-ink hover:border-ink`

/** Loads the GSAP chunk after hydration and hands back its cleanup. */
export function useMotion(run: 'home' | 'page') {
  useEffect(() => {
    let dead = false
    let stop: (() => void) | undefined
    void import('./motion').then((motion) => {
      if (!dead) stop = motion[run]()
    })
    return () => {
      dead = true
      stop?.()
    }
  }, [run])
}

export function Img({ shot, sizes, eager, className }: { shot: Shot; sizes: string; eager?: boolean; className?: string }) {
  const srcSet = /\/(kl|starlake)-.*-1600\.webp$/.test(shot.src) ? `${shot.src.replace('-1600', '-800')} 800w, ${shot.src} 1600w` : undefined
  return (
    <img
      src={shot.src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={shot.alt}
      width={shot.w}
      height={shot.h}
      decoding="async"
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      className={className}
    />
  )
}

export function External({ link, primary }: { link: Link; primary?: boolean }) {
  return (
    <a href={link.href} target="_blank" rel="noopener" className="group flex flex-col gap-1.5">
      <span className={primary ? pillPrimary : pillSecondary}>
        {link.label}
        <ArrowUpRight size={16} weight={ICON} aria-hidden />
      </span>
      <span className="pl-6 font-mono text-xs text-muted group-hover:text-ink">{link.href.replace(/^https:\/\//, '').replace(/\/$/, '')}</span>
    </a>
  )
}

/** Consecutive roles at one company become one group. */
export function byCompany(roles: Role[]) {
  const groups: { company: string; roles: Role[] }[] = []
  for (const role of roles) {
    const last = groups.at(-1)
    if (last?.company === role.company) last.roles.push(role)
    else groups.push({ company: role.company, roles: [role] })
  }
  return groups
}
