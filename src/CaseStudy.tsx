import { ArrowLeft, ArrowRight, ArrowUpRight, Play } from '@phosphor-icons/react/ssr'
import { useState } from 'react'
import { lidAwakeSource, projects, type Project } from './content'
import { External, ICON, Img, pillPrimary, useMotion } from './ui'

const wrap = 'mx-auto max-w-[1600px] px-5 md:px-10'

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={`${wrap} grid gap-6 py-14 md:grid-cols-12 md:gap-8 md:py-20`}>
      <h2 data-reveal className="display text-[clamp(2.4rem,4vw,4rem)] md:col-span-4">
        {title}
      </h2>
      <div className="md:col-span-8">{children}</div>
    </section>
  )
}

const prose = 'max-w-[68ch] text-lg leading-relaxed text-ink/85'

/** The iframe does not exist until the visitor asks for it. */
function Facade({ project, tall }: { project: Project; tall: boolean }) {
  const [running, setRunning] = useState(false)
  const { embed, cover } = project
  if (!embed || !cover) return null
  // Kiosk's break-it buttons sit under its figure, so the running frame has to show both.
  const frame = !tall ? 'aspect-video' : running ? 'h-[calc(100vw+23rem)] md:h-[56rem]' : 'aspect-[3/4]'
  return (
    <figure>
      <div className={`vt-hero relative overflow-hidden border border-line bg-raised ${frame}`}>
        {running ? (
          <iframe src={embed.src} title={embed.title} sandbox="allow-scripts allow-same-origin" loading="lazy" className="absolute inset-0 size-full" />
        ) : (
          <>
            <Img shot={cover} sizes="100vw" eager className="absolute inset-0 size-full object-cover" />
            <button type="button" onClick={() => setRunning(true)} className={`${pillPrimary} absolute bottom-4 left-4 cursor-pointer`}>
              <Play size={18} weight={ICON} aria-hidden /> Run it here
            </button>
          </>
        )}
      </div>
      <figcaption className="mt-3 flex flex-wrap justify-between gap-x-6 gap-y-1 text-sm text-muted">
        <span>{embed.note}</span>
        {running && (
          <a href={embed.src} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center gap-1 text-ink underline underline-offset-4">
            Open in a new tab: {new URL(embed.src).host}
            <ArrowUpRight size={14} weight={ICON} aria-hidden />
          </a>
        )}
      </figcaption>
    </figure>
  )
}

function HeroMedia({ project }: { project: Project }) {
  const { cover, video, embed, name } = project
  const tall = !!cover && cover.h > cover.w
  if (embed) return <Facade project={project} tall={tall} />
  if (video && cover)
    return (
      <div className="vt-hero relative aspect-video overflow-hidden border border-line bg-raised">
        <video data-autoplay src={video.src} poster={cover.src} aria-label={video.label} muted loop playsInline preload="none" className="absolute inset-0 size-full object-cover" />
      </div>
    )
  if (cover)
    return (
      <div className="vt-hero">
        <Img shot={cover} sizes="(min-width: 768px) 40vw, 100vw" eager className={`border border-line ${tall ? 'mx-auto max-h-[82dvh] w-auto' : 'w-full'}`} />
      </div>
    )
  return (
    <pre tabIndex={0} aria-label={`${name} source`} className="vt-hero overflow-x-auto border border-line bg-raised p-5 font-mono text-sm leading-relaxed text-ink/90 md:p-8">
      <code>{lidAwakeSource}</code>
    </pre>
  )
}

/** One pass of the Lid Awake script, in the script's own order. */
function runScript(current: 0 | 1, ac: boolean, lidClosed: boolean) {
  const want = ac ? 1 : 0
  if (current === want) return { state: want as 0 | 1, ran: [] as string[] }
  const ran = [`pmset -a disablesleep ${want}`]
  if (want === 0 && lidClosed) ran.push('pmset sleepnow')
  return { state: want as 0 | 1, ran }
}

function Simulator() {
  const [ac, setAc] = useState(true)
  const [lidClosed, setLidClosed] = useState(false)
  const [result, setResult] = useState(runScript(1, true, false))
  const update = (nextAc: boolean, nextLid: boolean) => {
    setAc(nextAc)
    setLidClosed(nextLid)
    setResult((last) => runScript(last.state, nextAc, nextLid))
  }
  return (
    <section className={`${wrap} py-14 md:py-20`}>
      <div className="border border-line bg-raised p-5 md:grid md:grid-cols-12 md:gap-8 md:p-10">
        <h2 className="display mb-6 text-[clamp(2.4rem,4vw,4rem)] md:col-span-4 md:mb-0">Run the logic</h2>
        <form className="space-y-1 md:col-span-3" onSubmit={(e) => e.preventDefault()}>
          <label className="flex min-h-11 cursor-pointer items-center gap-3">
            <input type="checkbox" role="switch" checked={ac} onChange={(e) => update(e.target.checked, lidClosed)} className="size-5 accent-blue" />
            <span>
              Power: <strong className="font-medium">{ac ? 'AC' : 'Battery'}</strong>
            </span>
          </label>
          <label className="flex min-h-11 cursor-pointer items-center gap-3">
            <input type="checkbox" role="switch" checked={lidClosed} onChange={(e) => update(ac, e.target.checked)} className="size-5 accent-blue" />
            <span>
              Lid: <strong className="font-medium">{lidClosed ? 'Closed' : 'Open'}</strong>
            </span>
          </label>
        </form>
        <output aria-live="polite" data-testid="sim-result" className="mt-5 block font-mono text-sm leading-relaxed md:col-span-5 md:mt-0 md:text-base">
          <span className="block text-muted">disablesleep is {result.state}</span>
          {result.ran.length ? (
            result.ran.map((command) => (
              <span key={command} className="block text-ink">
                {command}
              </span>
            ))
          ) : (
            <span className="block text-ink">No change, the script exits</span>
          )}
        </output>
      </div>
    </section>
  )
}

function Hero({ project }: { project: Project }) {
  const { name, kind, year, summary, live, repo, cover } = project
  const tall = !!cover && cover.h > cover.w
  const text = (
    <div>
      <p className="font-mono text-sm text-muted">
        {kind}, {year}
      </p>
      <h1 tabIndex={-1} className="display mt-4 text-[clamp(4.5rem,15vw,17rem)]">
        {name}
      </h1>
      <p className="mt-6 max-w-[46ch] text-xl leading-snug text-ink/90 md:text-2xl">{summary}</p>
      <div className="mt-8 flex flex-wrap gap-4">
        {live && <External link={live} primary />}
        <External link={repo} primary={!live} />
      </div>
    </div>
  )
  return tall ? (
    <header className={`${wrap} grid items-end gap-10 pb-12 pt-28 md:grid-cols-12 md:pt-32`}>
      <div className="md:col-span-7">{text}</div>
      <div className="md:col-span-5">
        <HeroMedia project={project} />
      </div>
    </header>
  ) : (
    <header className={`${wrap} space-y-10 pb-12 pt-28 md:pt-32`}>
      {text}
      <HeroMedia project={project} />
    </header>
  )
}

export function CaseStudy({ project: p }: { project: Project }) {
  useMotion('page')
  const at = projects.indexOf(p)
  const prev = projects[(at + projects.length - 1) % projects.length]
  const next = projects[(at + 1) % projects.length]
  return (
    <article>
      <Hero project={p} />
      <Block title="Overview">
        <p className={prose}>{p.overview}</p>
      </Block>
      <Block title="Engineering approach">
        <ul className={`${prose} space-y-4`}>
          {p.approach.map((line) => (
            <li key={line} className="border-l-2 border-line pl-5">
              {line}
            </li>
          ))}
        </ul>
      </Block>

      <section className={`${wrap} py-14 md:py-20`}>
        <h2 data-reveal className="display mb-8 text-[clamp(2.4rem,4vw,4rem)] md:mb-12">
          {p.flow.title}
        </h2>
        <ol className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]">
          {p.flow.steps.map((step, i) => (
            <li key={step} className="flex items-baseline gap-4 bg-raised p-5 sm:min-h-32 sm:flex-col sm:items-stretch sm:justify-between">
              <span aria-hidden className="font-mono text-sm text-blue">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-lg font-medium leading-snug">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {p.slug === 'lid-awake' && <Simulator />}

      <Block title="Stack">
        <p className="max-w-[60ch] font-mono leading-loose text-ink/85">{p.stack.join(', ')}</p>
      </Block>

      <section className={`${wrap} py-14 md:py-20`}>
        <h2 data-reveal className="display mb-10 text-[clamp(3rem,7vw,8rem)] md:mb-16">
          Technical challenges
        </h2>
        <div className="space-y-14 md:space-y-24">
          {p.challenges.map((challenge) => (
            <div key={challenge.title} className="grid gap-6 border-t border-line pt-6 md:grid-cols-12 md:gap-8">
              <h3 className="display text-[clamp(2rem,3.4vw,3.6rem)] md:col-span-4">{challenge.title}</h3>
              <dl className="max-w-[64ch] space-y-5 leading-relaxed md:col-span-7 md:col-start-6">
                <div>
                  <dt className="font-mono text-sm text-muted">Problem</dt>
                  <dd className="mt-1 text-ink/85">{challenge.problem}</dd>
                </div>
                <div>
                  <dt className="font-mono text-sm text-muted">Solution</dt>
                  <dd className="mt-1 text-ink/85">{challenge.solution}</dd>
                </div>
                {challenge.result && (
                  <div>
                    <dt className="font-mono text-sm text-muted">Result</dt>
                    <dd className="mt-1 text-xl leading-snug text-ink">{challenge.result}</dd>
                  </div>
                )}
              </dl>
            </div>
          ))}
        </div>
      </section>

      {p.gallery.length > 0 && (
        <section className={`${wrap} py-14 md:py-20`}>
          <h2 data-reveal className="display mb-8 text-[clamp(2.4rem,4vw,4rem)] md:mb-12">
            Gallery
          </h2>
          <div className="grid gap-x-6 gap-y-10 md:grid-cols-12">
            {p.gallery.map((shot, i) => {
              const tall = shot.h > shot.w
              const span = tall ? 'md:col-span-3' : i % 3 === 0 || (i % 3 === 1 && i === p.gallery.length - 1) ? 'md:col-span-12' : 'md:col-span-6'
              return (
                <figure key={shot.src} className={span}>
                  <div className="zoom-frame overflow-hidden border border-line">
                    <Img shot={shot} sizes={tall ? '25vw' : '(min-width: 768px) 60vw, 100vw'} className="w-full" />
                  </div>
                  <figcaption className="mt-3 text-sm text-muted">{shot.caption}</figcaption>
                </figure>
              )
            })}
          </div>
        </section>
      )}

      <Block title="Outcome and status">
        <p className={prose}>{p.outcome}</p>
      </Block>
      {p.limits && (
        <Block title="Known limits">
          <ul className={`${prose} list-inside list-disc space-y-3 marker:text-muted`}>
            {p.limits.map((limit) => (
              <li key={limit}>{limit}</li>
            ))}
          </ul>
        </Block>
      )}

      <nav aria-label="More projects" className={`${wrap} grid gap-px border-t border-line pb-10 pt-10 md:grid-cols-2`}>
        <a href={`/work/${prev.slug}/`} className="group flex min-h-24 flex-col justify-center gap-2 py-3">
          <span className="flex items-center gap-2 font-mono text-sm text-muted">
            <ArrowLeft size={16} weight={ICON} aria-hidden /> Previous
          </span>
          <span className="display text-[clamp(2.6rem,6vw,6rem)] transition-colors group-hover:text-blue">{prev.name}</span>
        </a>
        <a href={`/work/${next.slug}/`} className="group flex min-h-24 flex-col justify-center gap-2 py-3 md:items-end">
          <span className="flex items-center gap-2 font-mono text-sm text-muted">
            Next <ArrowRight size={16} weight={ICON} aria-hidden />
          </span>
          <span className="display text-[clamp(2.6rem,6vw,6rem)] transition-colors group-hover:text-blue">{next.name}</span>
        </a>
      </nav>
    </article>
  )
}
