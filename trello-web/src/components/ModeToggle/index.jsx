
import { useColorScheme } from '@mui/material/styles'
import Button from '@mui/material/Button'

function ModeToggle() {
    const { mode, setMode } = useColorScheme()
  
    return (
      <Button onClick={() => setMode(mode === 'light' ? 'dark' : 'light')} sx={{ minWidth: '120px', color: 'white', '&.Mui-focused': {color: 'white'} }}>
        {mode === 'light' ? 'Turn dark' : 'Turn light'}
      </Button>
    )
}

export default ModeToggle
