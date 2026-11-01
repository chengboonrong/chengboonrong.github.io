import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { site } from './content'
import { pageMeta, slugOf } from './meta'

export const normalPath = (path: string) => (path === '/index.html' ? '/' : path.endsWith('/') || path.includes('.') ? path : `${path}/`)

const SHARED = 'work-media'
const positions = new Map<number, number>()
const newId = () => Date.now() + Math.random()

/** Native anchor jumps add history entries with no state, so stamp whichever entry is current. */
function entryId(): number {
  if (!history.state?.id) history.replaceState({ id: newId() }, '')
  return history.state.id
}

function syncHead(path: string) {
  const { title, description } = pageMeta(path)
  document.title = title
  document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', site.url + path)
  return title
}

/** A small history router: same-origin page links become view transitions, everything else stays native. */
export function useRoute(initial: string) {
  const [path, setPath] = useState(initial)
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    let current = path
    history.scrollRestoration = 'manual'
    entryId()

    const swap = (url: URL, y: number, source: HTMLElement | null) => {
      const next = normalPath(url.pathname)
      const leaving = slugOf(current)
      const apply = () => {
        if (source) source.style.viewTransitionName = ''
        flushSync(() => setPath(next))
        current = next
        if (url.hash) document.getElementById(url.hash.slice(1))?.scrollIntoView()
        else window.scrollTo(0, y)
        setAnnouncement(syncHead(next))
        document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true })
        const card = leaving ? document.querySelector<HTMLElement>(`[data-vt="${leaving}"]`) : null
        if (card) card.style.viewTransitionName = SHARED
        return card
      }
      if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        if (source) source.style.viewTransitionName = SHARED
        let card: HTMLElement | null = null
        const transition = document.startViewTransition(() => {
          card = apply()
        })
        transition.finished.finally(() => {
          if (card) card.style.viewTransitionName = ''
        })
      } else {
        const card = apply()
        if (card) card.style.viewTransitionName = ''
      }
    }

    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest?.('a')
      if (!link || event.defaultPrevented || event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      if (link.target || link.hasAttribute('download') || link.origin !== location.origin) return
      const url = new URL(link.href)
      const next = normalPath(url.pathname)
      if (next.includes('.')) return
      if (next === current && url.hash) return // Same-page anchors keep native scrolling and focus.
      event.preventDefault()
      positions.set(entryId(), window.scrollY)
      history.pushState({ id: newId() }, '', next + url.hash)
      swap(url, 0, link.querySelector<HTMLElement>('[data-vt]'))
    }

    const onPop = () => {
      const next = normalPath(location.pathname)
      const y = positions.get(history.state?.id) ?? 0
      if (next === current) {
        if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView()
        else window.scrollTo(0, y)
        return
      }
      swap(new URL(location.href), y, null)
    }

    // The entry being left is the current one only until popstate fires, so keep its position up to date.
    const remember = () => {
      positions.set(entryId(), window.scrollY)
    }
    document.addEventListener('click', onClick)
    window.addEventListener('popstate', onPop)
    window.addEventListener('scrollend', remember)
    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('popstate', onPop)
      window.removeEventListener('scrollend', remember)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- installed once, `current` tracks the path.
  }, [])

  return { path, announcement }
}
