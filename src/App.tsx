import { List } from '@phosphor-icons/react/ssr'
import { useRef } from 'react'
import { CaseStudy } from './CaseStudy'
import { projects, site } from './content'
import { Home } from './Home'
import { slugOf } from './meta'
import { Resume } from './Resume'
import { useRoute } from './router'
import { ICON, pillPrimary } from './ui'

const links = [
  { label: 'Work', href: '/#work' },
  { label: 'Experience', href: '/#experience' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
  { label: 'Résumé', href: '/resume/' },
]

function Nav() {
  const menu = useRef<HTMLDetailsElement>(null)
  const close = () => {
    if (menu.current) menu.current.open = false
  }
  return (
    <header className="site-nav fixed inset-x-0 top-0 z-30 border-b border-line/70 bg-ground/85 backdrop-blur-md print:hidden">
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 md:px-10">
        <a href="/" className="display flex min-h-11 items-center text-2xl tracking-normal">
          {site.name}
        </a>
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="flex min-h-11 items-center text-sm text-muted transition-colors hover:text-ink">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        {/* Native disclosure: it opens with no JavaScript, and Escape or a link closes it. */}
        <details
          ref={menu}
          className="md:hidden"
          onKeyDown={(event) => {
            if (event.key === 'Escape' && menu.current?.open) {
              close()
              menu.current.querySelector('summary')?.focus()
            }
          }}
        >
          <summary aria-label="Menu" className="-mr-3 flex size-11 items-center justify-center">
            <List size={24} weight={ICON} aria-hidden />
          </summary>
          <ul onClick={close} className="absolute inset-x-0 top-full border-b border-line bg-ground px-5 py-4">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="display flex min-h-14 items-center text-4xl">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </details>
      </nav>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-line print:hidden">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-2 px-5 py-8 text-sm text-muted md:flex-row md:justify-between md:px-10">
        <p>
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {site.name}
        </p>
        <p>Built with React, GSAP and Three.js</p>
      </div>
    </footer>
  )
}

function NotFound() {
  return (
    <section className="mx-auto flex min-h-[80dvh] max-w-[1600px] flex-col items-start justify-center gap-8 px-5 pt-24 md:px-10">
      <h1 tabIndex={-1} className="display text-[clamp(4rem,14vw,12rem)]">
        Page not found.
      </h1>
      <p className="max-w-[50ch] text-lg text-muted">That address does not lead anywhere on this site.</p>
      <a href="/" className={pillPrimary}>
        Back to the home page
      </a>
    </section>
  )
}

export function App({ url }: { url: string }) {
  const { path, announcement } = useRoute(url)
  const project = projects.find((p) => p.slug === slugOf(path))
  return (
    <>
      <a href="#main" className="fixed left-3 top-3 z-40 -translate-y-20 bg-blue px-5 py-3 font-medium text-ground focus:translate-y-0 print:hidden">
        Skip to content
      </a>
      <Nav />
      <main id="main" key={path} tabIndex={-1}>
        {path === '/' ? <Home /> : project ? <CaseStudy project={project} /> : path === '/resume/' ? <Resume /> : <NotFound />}
      </main>
      <Footer />
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </>
  )
}
