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
import { red, blue, teal} from '@mui/material/colors'

const theme = extendTheme({
  trello: {
    appBarHeight: '58px',
    boardBarHeight: '60px',
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: teal[500],
        },
        secondary: {
          main: red[500],
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: teal[300],
        },
        secondary: {
          main: red[300],
        },
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none'
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => {
          return {
            color: theme.palette.primary.main,
            fontSize: '0.875rem',
          }
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({theme}) => {
          return {
            color: theme.palette.primary.main,
            fontSize: '0.875rem',
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.light
            },
            '&:hover': {
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main
              },
            },
            '& fieldset': {
              borderWidth: '1px !important'
            }
          }
        }
      },
    },
  },
})

export default theme