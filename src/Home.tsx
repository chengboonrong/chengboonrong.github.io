import { ArrowRight, Check, Copy, GithubLogo, LinkedinLogo } from '@phosphor-icons/react/ssr'
import { useState } from 'react'
import { about, experience, expertise, lidAwakeSource, projects, site, type Project } from './content'
import { byCompany, ICON, Img, pillPrimary, pillSecondary, useMotion } from './ui'

const [headA, headB] = site.headline.split(/ (?=\S+$)/)
const section = 'mx-auto max-w-[1600px] px-5 md:px-10'

function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-[100dvh] flex-col justify-end overflow-hidden pb-12 pt-24 md:pb-14">
      <div data-city className="hero-sky absolute inset-0 -z-20" />
      <div className="hero-scrim absolute inset-0 -z-10" />
      <div className={`${section} w-full`}>
        <p className="fade-up mb-5 font-mono text-[0.64rem] uppercase tracking-normal text-muted sm:text-xs sm:tracking-[0.1em] md:text-sm md:tracking-[0.14em]">{site.roles.join(' / ')}</p>
        <h1 id="hero-title" tabIndex={-1} className="display text-[14.6vw] md:text-[clamp(5.5rem,11.6vw,15rem)]">
          <span className="mask-line">
            <span className="rise">{headA} </span>
          </span>
          <span className="mask-line">
            <span className="rise" style={{ '--delay': '0.09s' } as React.CSSProperties}>
              {headB}
            </span>
          </span>
        </h1>
        <p className="fade-up mt-7 max-w-[52ch] text-base leading-relaxed text-ink/85 md:text-lg" style={{ '--delay': '0.25s' } as React.CSSProperties}>
          {site.intro}
        </p>
        <div className="fade-up mt-8 flex flex-wrap gap-3" style={{ '--delay': '0.35s' } as React.CSSProperties}>
          <a href="/#work" data-magnetic className={pillPrimary}>
            View work
          </a>
          <a href="/#contact" data-magnetic className={pillSecondary}>
            Contact
          </a>
        </div>
      </div>
    </section>
  )
}

const Numeral = ({ p, className = '' }: { p: Project; className?: string }) => (
  <span aria-hidden className={`display block ${className}`}>
    {p.index}
  </span>
)
const Name = ({ p, className = '' }: { p: Project; className?: string }) => <h3 className={`display ${className}`}>{p.name}</h3>
const Kind = ({ p }: { p: Project }) => <p className="font-mono text-sm text-muted">{p.kind}</p>
const Summary = ({ p }: { p: Project }) => <p className="max-w-[42ch] text-base leading-relaxed text-ink/85 md:text-lg">{p.summary}</p>
const Go = () => <ArrowRight size={28} weight={ICON} aria-hidden className="text-blue transition-transform duration-300 group-hover:translate-x-2" />

const textPad = 'px-5 py-10 md:px-10 md:pb-10 md:pt-24'

function KlRush({ p }: { p: Project }) {
  return (
    <div className="flex h-full flex-col md:grid md:grid-cols-12">
      <div className={`flex flex-col justify-between gap-8 md:col-span-4 ${textPad}`}>
        <Numeral p={p} className="text-[clamp(6rem,14vw,13rem)]" />
        <div className="space-y-4">
          <Name p={p} className="text-[clamp(3.5rem,7.4vw,7.5rem)]" />
          <Kind p={p} />
          <Summary p={p} />
          <Go />
        </div>
      </div>
      <div data-vt={p.slug} className="zoom-frame relative order-first aspect-video overflow-hidden md:order-none md:col-span-8 md:aspect-auto md:h-full">
        <video data-autoplay src={p.video!.src} poster={p.video!.poster} aria-label={p.video!.label} muted loop playsInline preload="none" className="absolute inset-0 size-full object-cover" />
      </div>
    </div>
  )
}

function BikeTaxi({ p }: { p: Project }) {
  const [driver, admin] = p.gallery
  return (
    <div className="flex h-full flex-col bg-raised md:grid md:grid-cols-12 md:items-center">
      <div className="grid grid-cols-3 items-start gap-3 overflow-hidden px-5 pt-10 md:col-span-7 md:gap-6 md:px-10 md:pt-16">
        <Img shot={driver} sizes="24vw" className="mt-[18%] w-full border border-line" />
        <div data-vt={p.slug}>
          <Img shot={p.cover!} sizes="24vw" className="w-full border border-line" />
        </div>
        <Img shot={admin} sizes="24vw" className="mt-[34%] w-full border border-line" />
      </div>
      <div className={`space-y-4 md:col-span-5 md:pt-16 ${textPad}`}>
        <Numeral p={p} className="text-[clamp(6rem,14vw,13rem)] text-right md:text-left" />
        <Name p={p} className="text-[clamp(3.5rem,8vw,8rem)]" />
        <Kind p={p} />
        <Summary p={p} />
        <Go />
      </div>
    </div>
  )
}

function Starlake({ p }: { p: Project }) {
  return (
    <div className="relative flex h-full min-h-[75dvh] flex-col justify-end">
      <div data-vt={p.slug} className="zoom-frame absolute inset-0 overflow-hidden">
        <Img shot={p.cover!} sizes="100vw" className="size-full object-cover" />
      </div>
      <div className="card-scrim absolute inset-0" />
      <div className="relative flex flex-col gap-4 px-5 py-10 md:flex-row md:items-end md:justify-between md:px-10">
        <div className="space-y-4">
          <Name p={p} className="text-[clamp(4.5rem,15vw,16rem)]" />
          <Kind p={p} />
          <Summary p={p} />
          <Go />
        </div>
        <Numeral p={p} className="text-[clamp(6rem,14vw,13rem)]" />
      </div>
    </div>
  )
}

function Kiosk({ p }: { p: Project }) {
  return (
    <div className="flex h-full flex-col gap-8 p-5 pt-10 md:grid md:grid-cols-[1fr_minmax(0,auto)_1fr] md:gap-10 md:p-10 md:pt-24">
      <div className="flex flex-col justify-between gap-6">
        <Numeral p={p} className="text-[clamp(6rem,14vw,13rem)]" />
        <Name p={p} className="text-[clamp(3.5rem,6.6vw,7rem)]" />
      </div>
      <div className="flex min-h-0 justify-center border border-line bg-raised p-3 md:p-5">
        <div data-vt={p.slug} className="zoom-frame min-h-0 overflow-hidden">
          <Img shot={p.cover!} sizes="(min-width: 768px) 40vw, 100vw" className="h-full max-h-full w-auto object-contain" />
        </div>
      </div>
      <div className="flex flex-col justify-end gap-4">
        <Kind p={p} />
        <Summary p={p} />
        <Go />
      </div>
    </div>
  )
}

function LidAwake({ p }: { p: Project }) {
  const lines = lidAwakeSource.split('\n')
  return (
    <div className="flex h-full flex-col justify-between gap-6 bg-raised p-5 pt-10 md:p-10 md:pt-24">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
        <Numeral p={p} className="text-[clamp(6rem,10vw,10rem)]" />
        <div className="space-y-3">
          <Name p={p} className="text-[clamp(3.5rem,7vw,7rem)]" />
          <Kind p={p} />
        </div>
        <div className="space-y-3 md:max-w-[34ch]">
          <Summary p={p} />
          <Go />
        </div>
      </div>
      <div data-vt={p.slug} className="min-h-0 overflow-hidden">
        <pre aria-hidden className="overflow-hidden font-mono text-[clamp(0.68rem,1.28vw,1.25rem)] leading-[1.42] text-muted">
          <code>
            {lines.map((line) =>
              line.startsWith('pmset -a disablesleep') ? (
                <span key={line} className="my-1 block w-fit max-w-full bg-blue px-3 py-1 text-[clamp(1.05rem,4.1vw,4.2rem)] font-medium leading-[1.15] text-ground">
                  {line}
                </span>
              ) : (
                <span key={line} className="block min-h-[1.42em]">
                  {line}
                </span>
              ),
            )}
          </code>
        </pre>
      </div>
    </div>
  )
}

const cards: Record<string, (props: { p: Project }) => React.ReactNode> = {
  'kl-rush': KlRush,
  'bike-taxi': BikeTaxi,
  starlake: Starlake,
  'kiosk-anatomy': Kiosk,
  'lid-awake': LidAwake,
}

function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="scroll-mt-16">
      <div className={`${section} pb-10 pt-24 md:pb-14 md:pt-36`}>
        <h2 id="work-title" data-reveal className="display text-[clamp(3.5rem,11vw,13rem)]">
          Selected Work
        </h2>
      </div>
      <div className="isolate">
        {projects.map((p, i) => {
          const Card = cards[p.slug]
          return (
            <article key={p.slug} className="stack-card relative" style={{ zIndex: i + 1 }}>
              <div className={`stack-inner overflow-hidden border-t border-line md:h-[100dvh] md:min-h-[640px] ${i % 2 ? 'bg-raised' : 'bg-ground'}`}>
                <a href={`/work/${p.slug}/`} className="group block h-full focus-visible:-outline-offset-4">
                  <Card p={p} />
                </a>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

const expertiseLayout = [
  'md:col-span-7',
  'md:col-span-5 md:bg-raised md:p-8',
  'md:col-span-4 md:bg-raised md:p-8',
  'md:col-span-8 md:pl-12',
  'md:col-span-8',
  'md:col-span-4 md:bg-raised md:p-8',
]

function Expertise() {
  return (
    <section aria-labelledby="expertise-title" className={`${section} py-24 md:py-36`}>
      <h2 id="expertise-title" data-reveal className="display mb-12 max-w-[10ch] text-[clamp(3.5rem,9vw,10rem)] md:mb-20">
        Technical Expertise
      </h2>
      <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-12 md:gap-y-16">
        {expertise.map((area, i) => (
          <div key={area.title} className={`flex flex-col gap-4 ${expertiseLayout[i]}`}>
            <h3 className={`display ${i === 0 || i === 4 ? 'text-[clamp(3rem,6.4vw,6.6rem)]' : 'text-[clamp(2.4rem,3.8vw,4rem)]'}`}>{area.title}</h3>
            <p className="max-w-[46ch] text-base leading-relaxed text-ink/85 md:text-lg">{area.body}</p>
            <p className="font-mono text-sm leading-relaxed text-muted">{area.tools.join(', ')}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Experience() {
  let count = 0
  return (
    <section id="experience" aria-labelledby="experience-title" className={`${section} scroll-mt-16 py-24 md:py-36`}>
      <h2 id="experience-title" data-reveal className="display mb-12 text-[clamp(3.5rem,11vw,13rem)] md:mb-20">
        Experience
      </h2>
      <div className="relative" data-timeline>
        <span data-timeline-line aria-hidden className="absolute bottom-0 left-0 top-0 w-0.5 origin-top bg-blue md:left-[33.333%]" />
        <ol className="space-y-14 md:space-y-20">
          {byCompany(experience).map((group) => (
            <li key={group.company} className="grid gap-6 pl-6 md:grid-cols-3 md:gap-0 md:pl-0">
              <h3 className="display pr-8 text-[clamp(2.4rem,4.6vw,5rem)]">{group.company}</h3>
              <ol className="space-y-2 md:col-span-2 md:pl-10">
                {group.roles.map((role) => {
                  const open = count++ < 2
                  return (
                    <li key={role.title}>
                      <details open={open} className="group/role">
                        <summary className="flex min-h-11 flex-col gap-1 py-3 md:flex-row md:items-baseline md:justify-between md:gap-8">
                          <span className="text-lg font-medium md:text-xl">{role.title}</span>
                          <span className="shrink-0 font-mono text-sm text-muted">{role.period}</span>
                        </summary>
                        <div className="pb-5">
                          <p className="mb-3 text-sm text-muted">{role.place}</p>
                          <ul className="max-w-[68ch] space-y-3 leading-relaxed text-ink/85">
                            {role.points.map((point) => (
                              <li key={point}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      </details>
                    </li>
                  )
                })}
              </ol>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about" aria-labelledby="about-title" className={`${section} scroll-mt-16 py-24 md:py-36`}>
      <div className="grid gap-12 md:grid-cols-12">
        <h2 id="about-title" data-reveal className="display text-[clamp(4rem,11.5vw,14rem)] md:col-span-7">
          {about.title}
        </h2>
        <div className="space-y-5 text-lg leading-relaxed text-ink/85 md:col-span-5 md:self-end">
          {about.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
      </div>
      <dl className="mt-16 grid gap-10 sm:grid-cols-2 md:ml-[calc(100%/12*5)] md:mt-24">
        {about.facts.map((fact) => (
          <div key={fact.label} className="flex flex-col-reverse gap-2">
            <dt className="text-muted">{fact.label}</dt>
            <dd className="display text-[clamp(5rem,10vw,10rem)]">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function CopyEmail() {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      setState('copied')
    } catch {
      setState('failed')
    }
    setTimeout(() => setState('idle'), 2400)
  }
  return (
    <button type="button" onClick={copy} className={`${pillSecondary} cursor-pointer`}>
      {state === 'copied' ? <Check size={18} weight={ICON} aria-hidden /> : <Copy size={18} weight={ICON} aria-hidden />}
      <span aria-live="polite">{state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed, select the address above' : 'Copy email'}</span>
    </button>
  )
}

function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className={`${section} scroll-mt-16 pb-20 pt-24 md:pb-28 md:pt-36`}>
      <h2 id="contact-title" className="max-w-[30ch] text-xl leading-snug text-ink/85 md:text-3xl">
        Open to remote full-time roles, and freelance or contract work.
      </h2>
      <a href={`mailto:${site.email}`} data-magnetic className="display mt-8 inline-block max-w-full text-[calc((100vw-2.5rem)/9.8)] tracking-normal text-ink transition-colors hover:text-blue md:mt-10 md:text-[calc((min(100vw,1600px)-5rem)/9.8)]">
        {site.email}
      </a>
      <div className="mt-10 flex flex-wrap items-center gap-3">
        <CopyEmail />
        <a href={site.github} target="_blank" rel="noopener" className={pillSecondary}>
          <GithubLogo size={18} weight={ICON} aria-hidden /> GitHub
        </a>
        <a href={site.linkedin} target="_blank" rel="noopener" className={pillSecondary}>
          <LinkedinLogo size={18} weight={ICON} aria-hidden /> LinkedIn
        </a>
        <a href="/resume/" className={pillSecondary}>
          Résumé
        </a>
      </div>
      <p className="mt-8 text-muted">{site.location}</p>
    </section>
  )
}

export function Home() {
  useMotion('home')
  return (
    <>
      <Hero />
      <Work />
      <Expertise />
      <Experience />
      <About />
      <Contact />
    </>
  )
}
