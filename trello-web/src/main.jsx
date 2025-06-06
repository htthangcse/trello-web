import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '~/App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
// import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material/styles'
import theme from '~/theme.js'

// Cấu hình react-toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Cấu hình MUI Dialog
import { ConfirmProvider } from 'material-ui-confirm'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <ThemeProvider theme={theme} >
      <ConfirmProvider defaultOptions={{
        allowClose: false,
        dialogProps: { maxWidth: 'xs' },
        confirmationButtonProps: { color: 'primary', variant: 'outlined' },
        cancellationButtonProps: { color: 'inherit' },
        buttonOrder: ['confirm', 'cancel'],
      }}>
        <CssBaseline />
        <App />
        <ToastContainer theme="colored" position="bottom-left"/>
      </ConfirmProvider>
    </ThemeProvider>
  // {/* </StrictMode>, */}
)
