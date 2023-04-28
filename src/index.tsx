/* @refresh reload */
import { render } from 'solid-js/web'
import '~/style/index.css'
import '@unocss/reset/tailwind.css'
import 'uno.css'
import { Router, useRoutes } from '@solidjs/router'
import routes from '~solid-pages'

const root = document.getElementById('root')

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got mispelled?',
  )
}

render(() => {
  const Routes = useRoutes(routes)
  return (
    <Router>
      <Routes />
    </Router>
  )
}, root!)
