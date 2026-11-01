import { projects, site } from './content'

export const routes = ['/', ...projects.map((p) => `/work/${p.slug}/`), '/resume/']

export const slugOf = (path: string) => path.match(/^\/work\/([^/]+)\/$/)?.[1]

export function pageMeta(path: string) {
  const project = projects.find((p) => p.slug === slugOf(path))
  if (path === '/') return { title: `${site.name} | ${site.headline}`, description: site.description, known: true }
  if (project) return { title: `${project.name} | ${site.name}`, description: project.summary, known: true }
  if (path === '/resume/') return { title: `Résumé | ${site.name}`, description: site.description, known: true }
  return { title: `Page not found | ${site.name}`, description: site.description, known: false }
}
