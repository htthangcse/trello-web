// import Button from '@mui/material/Button'
// import HomeIcon from '@mui/icons-material/Home'

// import { useColorScheme } from '@mui/material/styles'

// function ModeToggle () {
//   const { mode, setMode } = useColorScheme()
//   return (
//     <Button
//       onClick = {() => {
//           setMode(mode === 'light' ? 'dark' : 'light')
//       }}>
//         {mode === 'light' ? 'Turn dark':  'Turn light'}
//     </Button>
//   )
// }

// function App() {
//   return (
//     <>
//       <ModeToggle/>
//       <Button variant="text">Text</Button>
//       <Button variant="contained">Contained</Button>
//       <Button variant="outlined">Outlined</Button>
//       <HomeIcon/>
//     </>
//   )
// }

// export default App


import { useColorScheme } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'

function ModeToggle() {
  const { mode, setMode } = useColorScheme()

  return (
    <Button onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
      {mode === 'light' ? 'Turn dark' : 'Turn light'}
    </Button>
  )
}

export default function App() {
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh',  }}>
      <Box sx={{
        backgroundColor: 'primary.light',
        width: '100%',
        height: (theme) => theme.trello.appBarHeight,
        display: 'flex',
        alignItems: 'center',
      }}>
        <ModeToggle />
      </Box>
      <Box sx={{
        backgroundColor: 'primary.dark',
        width: '100%',
        height: (theme) => theme.trello.boardBarHeight,
        display: 'flex',
        alignItems: 'center',
      }}>
        Board Bar
      </Box>
      <Box sx={{
        backgroundColor: 'primary.main',
        width: '100%',
        height: (theme) => `calc(100vh - ${theme.trello.appBarHeight} - ${theme.trello.boardBarHeight})`,
        display: 'flex',
        alignItems: 'center',
      }}>
        Board Content
      </Box>
    </Container>
  )
}
