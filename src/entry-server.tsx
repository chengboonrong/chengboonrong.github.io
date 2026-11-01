import { renderToString } from 'react-dom/server'
import { App } from './App'

export { experience, projects, site } from './content'
export { pageMeta, routes } from './meta'

export const render = (url: string) => renderToString(<App url={url} />)
