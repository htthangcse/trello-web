import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'

function BoardContent() {

  return (
    <Box sx={{
        bgcolor: '#1976d2',
        width: '100%',
        height: (theme) => theme.trello.boadrContentHeight,
        p: '10px 0',
      }}>
        <ListColumns/>
      </Box>
  )
}

export default BoardContent
