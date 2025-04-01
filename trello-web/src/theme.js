// import { extendTheme } from '@mui/material/styles'



// // Create a theme instance.
// const theme = extendTheme ({
//   colorSchemes: {
//     light:  {
//       palette: {
//         primary: {
//           // main: '#ff5252',
//         },
//       },
//     },
//     dark:  {
//       palette: {
//         primary: {
//           // main: '#000',
//         },
//       },
//     },
//   }
// });

// export default theme


import { extendTheme } from '@mui/material/styles'
import { red, blue } from '@mui/material/colors'

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: blue[500],
        },
        secondary: {
          main: red[500],
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: blue[300],
        },
        secondary: {
          main: red[300],
        },
      },
    },
  },
})

export default theme