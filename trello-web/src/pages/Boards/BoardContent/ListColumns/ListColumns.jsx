import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'

function ListColumns() {

  return (
    <Box sx={{
      bgcolor: 'inherit',
      width: '100%',
      height: '100%',
      display: 'flex',
      overflowX: 'auto',
      ovevrflowY: 'hidden',
      '&::-webkit-scrollbar-track':{ m: 2,}
    }}>
      {/* box column 01*/}
      <Column/>
      <Column/>
      {/* add new column */}
      <Box sx={{
        minWidth: '200px',
        maxWidth: '200px',
        mx: 2,
        borderRadius: '6px',
        height: 'fit-content',
        bgcolor: '#ffffff3d'
      }}>
        <Button
        startIcon={<NoteAddIcon/>}
        sx={{
          color: 'white',
          width: '100%',
          justifyContent: 'flex-start',
          pl: 2.5,
          py: 1,
        }}
        >
          Add new column
        </Button>
      </Box>
    </Box>
  )
}

export default ListColumns
