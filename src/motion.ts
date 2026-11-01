import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

const calm = '(prefers-reduced-motion: no-preference)'

/** Headings arrive line by line once, which marks each new section as it enters. */
function revealHeadings() {
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'reveal-line',
      autoSplit: true,
      onSplit: (split) =>
        gsap.from(split.lines, {
          yPercent: 104,
          duration: 0.9,
          stagger: 0.08,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        }),
    })
  })
}

/** Buttons lean toward the pointer, which tells a mouse user they are live. */
function magnetic() {
  const stops = gsap.utils.toArray<HTMLElement>('[data-magnetic]').map((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' })
    const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' })
    const pull = el.offsetWidth > 300 ? 0.08 : 0.28
    const move = (event: PointerEvent) => {
      const box = el.getBoundingClientRect()
      x((event.clientX - box.left - box.width / 2) * pull)
      y((event.clientY - box.top - box.height / 2) * pull)
    }
    const leave = () => {
      x(0)
      y(0)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  })
  return () => stops.forEach((stop) => stop())
}

/** Video plays only on screen: its download and decode cost nothing elsewhere. */
function playInView() {
  const seen = new IntersectionObserver(
    (entries) => {
      for (const { target, isIntersecting } of entries) {
        const video = target as HTMLVideoElement
        if (isIntersecting && !video.dataset.covered) video.play().catch(() => {})
        else video.pause()
      }
    },
    { threshold: 0.25 },
  )
  document.querySelectorAll<HTMLVideoElement>('video[data-autoplay]').forEach((video) => seen.observe(video))
  return () => seen.disconnect()
}

function stackCards() {
  const cards = gsap.utils.toArray<HTMLElement>('.stack-card')
  const last = cards[cards.length - 1]
  // A pinned card stays in the viewport behind the next one, so the observer alone would keep its video playing.
  const video = cards[0].querySelector('video')
  if (video)
    ScrollTrigger.create({
      trigger: cards[1],
      start: 'top top',
      end: 'max',
      onToggle: ({ isActive }) => {
        if (isActive) {
          video.dataset.covered = '1'
          video.pause()
        } else {
          delete video.dataset.covered
          video.play().catch(() => {})
        }
      },
    })
  cards.forEach((card, i) => {
    if (card === last) return
    ScrollTrigger.create({ trigger: card, start: 'top top', endTrigger: last, end: 'top top', pin: true, pinSpacing: false })
    gsap.to(card.querySelector('.stack-inner'), {
      scale: 0.92,
      opacity: 0.45,
      ease: 'none',
      scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top top', scrub: true },
    })
  })
}

/** The line grows with the reader through the career, oldest role last. */
function drawTimeline() {
  const line = document.querySelector('[data-timeline-line]')
  if (!line) return
  gsap.from(line, {
    scaleY: 0,
    ease: 'none',
    scrollTrigger: { trigger: '[data-timeline]', start: 'top 70%', end: 'bottom 70%', scrub: true },
  })
}

function startCity() {
  const host = document.querySelector<HTMLElement>('[data-city]')
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
  if (!host || saveData) return () => {}
  const probe = document.createElement('canvas').getContext('webgl2')
  if (!probe) return () => {}
  probe.getExtension('WEBGL_lose_context')?.loseContext()

  let dead = false
  let stop = () => {}
  const load = () =>
    void import('./hero/City').then(({ createCity }) => {
      if (dead) return
      const city = createCity(host, { still: matchMedia('(prefers-reduced-motion: reduce)').matches })
      const scrub = ScrollTrigger.create({
        trigger: host,
        start: 'top top',
        end: 'bottom top',
        onUpdate: (self) => city.setProgress(self.progress),
      })
      stop = () => {
        scrub.kill()
        city.dispose()
      }
    })
  const idle = window.requestIdleCallback ?? ((run: () => void) => window.setTimeout(run, 200))
  idle(load, { timeout: 1500 })
  return () => {
    dead = true
    stop()
  }
}

export function page() {
  const mm = gsap.matchMedia()
  mm.add(calm, () => {
    revealHeadings()
    return playInView()
  })
  return () => mm.revert()
}

export function home() {
  const mm = gsap.matchMedia()
  mm.add(calm, () => {
    revealHeadings()
    drawTimeline()
    return playInView()
  })
  mm.add(`${calm} and (pointer: fine)`, magnetic)
  mm.add(`${calm} and (min-width: 768px) and (min-height: 640px)`, stackCards)
  const stopCity = startCity()
  // Opening a role moves everything below it.
  const refresh = (event: Event) => {
    if ((event.target as Element).matches?.('details')) ScrollTrigger.refresh()
  }
  document.addEventListener('toggle', refresh, true)
  return () => {
    document.removeEventListener('toggle', refresh, true)
    stopCity()
    mm.revert()
  }
}
