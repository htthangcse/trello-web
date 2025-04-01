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
    <>
      <ModeToggle />
      <Button variant="contained">Contained</Button>
    </>
  )
}
