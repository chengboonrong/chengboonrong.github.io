// Renders every route to static HTML from the SSR build, then removes that build.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const server = join(dist, '.ssr')
const { render, pageMeta, routes, site } = await import(pathToFileURL(join(server, 'entry-server.js')).href)
const template = readFileSync(join(dist, 'index.html'), 'utf8')

const esc = (text) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  alternateName: site.legalName,
  url: site.url,
  email: `mailto:${site.email}`,
  jobTitle: site.roles[0],
  address: { '@type': 'PostalAddress', addressLocality: 'Kuala Lumpur', addressCountry: 'MY' },
  sameAs: [site.github, site.linkedin],
}

function page(path) {
  const { title, description, known } = pageMeta(path)
  const url = site.url + path
  const tags = [
    `<meta name="description" content="${esc(description)}" />`,
    known ? `<link rel="canonical" href="${url}" />` : '<meta name="robots" content="noindex" />',
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(site.name)}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${site.url}/og.png" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ]
  if (path === '/') tags.push(`<script type="application/ld+json">${JSON.stringify(person).replace(/</g, '\\u003c')}</script>`)
  return template
    .replace(/<title>.*<\/title>/, `<title>${esc(title)}</title>`)
    .replace('<!--head-->', tags.join('\n    '))
    .replace('<!--app-->', render(path))
}

for (const route of routes) {
  const dir = join(dist, route)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), page(route))
}
writeFileSync(join(dist, '404.html'), page('/404.html'))
writeFileSync(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((r) => `  <url><loc>${site.url}${r}</loc></url>`).join('\n')}\n</urlset>\n`,
)
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`)
rmSync(server, { recursive: true })
console.log(`prerendered ${routes.length + 1} pages`)
