import { DownloadSimple } from '@phosphor-icons/react/ssr'
import { education, experience, expertise, site } from './content'
import { byCompany, ICON, pillPrimary, useMotion } from './ui'

const heading = 'display mb-4 text-4xl print:mb-1.5 print:text-[15pt] print:tracking-normal'
const quiet = 'text-muted print:text-[#333]'
const bare = (url: string) => url.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, '')

export function Resume() {
  useMotion('page')
  return (
    <div className="mx-auto max-w-[860px] px-5 pb-20 pt-28 md:pt-32 print:max-w-none print:p-0 print:text-[8.9pt] print:leading-[1.27]">
      <header className="mb-12 print:mb-2">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <h1 tabIndex={-1} className="display text-[clamp(2.8rem,9vw,4.8rem)] print:text-[27pt]">
            {site.name} ({site.legalName})
          </h1>
          <a href={site.resume} download className={`${pillPrimary} print:hidden`}>
            <DownloadSimple size={18} weight={ICON} aria-hidden /> Download PDF
          </a>
        </div>
        <p className="mt-4 text-lg print:mt-1 print:text-[10pt]">{site.roles.join(' / ')}</p>
        <ul className={`mt-3 flex flex-wrap gap-x-6 gap-y-1 ${quiet} print:mt-1 print:gap-x-4`}>
          <li>
            <a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline print:min-h-0">
              {site.email}
            </a>
          </li>
          <li>
            <a href={site.github} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline print:min-h-0">
              {bare(site.github)}
            </a>
          </li>
          <li>
            <a href={site.linkedin} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline print:min-h-0">
              {bare(site.linkedin)}
            </a>
          </li>
          <li className="inline-flex min-h-11 items-center print:min-h-0">{site.location}</li>
        </ul>
        <p className="mt-6 max-w-[64ch] leading-relaxed print:mt-1.5 print:max-w-none">{site.intro}</p>
      </header>

      <section className="mb-12 print:mb-2">
        <h2 className={heading}>Experience</h2>
        <div className="space-y-8 print:space-y-1.5">
          {byCompany(experience).map((group) => (
            <div key={group.company}>
              <h3 className="text-xl font-semibold print:text-[10.5pt]">{group.company}</h3>
              {group.roles.map((role) => (
                <div key={role.title} className="mt-3 break-inside-avoid print:mt-1">
                  <div className="flex flex-wrap justify-between gap-x-6">
                    <h4 className="font-medium">{role.title}</h4>
                    <p className={`font-mono text-sm ${quiet} print:text-[8.4pt]`}>
                      {role.period}, {role.place}
                    </p>
                  </div>
                  <ul className="mt-1.5 list-outside list-disc space-y-1 pl-5 leading-relaxed text-ink/85 print:mt-0.5 print:space-y-0 print:pl-4 print:leading-[1.27] print:text-black">
                    {role.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12 print:mb-2">
        <h2 className={heading}>Education</h2>
        <div className="flex flex-wrap justify-between gap-x-6">
          <h3 className="font-medium">{education.school}</h3>
          <p className={`font-mono text-sm ${quiet} print:text-[8.4pt]`}>{education.period}</p>
        </div>
        <p className="leading-relaxed text-ink/85 print:text-black">{education.degree}</p>
      </section>

      <section className="break-inside-avoid">
        <h2 className={heading}>Expertise</h2>
        <dl className="space-y-3 print:space-y-0.5">
          {expertise.map((area) => (
            <div key={area.title} className="sm:grid sm:grid-cols-[13rem_1fr] sm:gap-4 print:grid print:grid-cols-[10rem_1fr] print:gap-3">
              <dt className="font-medium">{area.title}</dt>
              <dd className={`${quiet} print:text-black`}>{area.tools.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}
