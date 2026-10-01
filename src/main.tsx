import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { store } from '@/store'
import { theme } from '@/theme'
import App from '@/App'

import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <MantineProvider theme={theme}>
        <Notifications />
        <App />
      </MantineProvider>
    </Provider>
  </StrictMode>
)
