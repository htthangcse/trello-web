import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import {SortableContext, horizontalListSortingStrategy} from '@dnd-kit/sortable'

function ListColumns({ columns }) {
  /*
  The <SortableContext> component requires that you pass it the sorted array of
  the unique identifiers associated to each sortable item via the items prop. 
  This array should look like ["1", "2", "3"], not [{id: "1"}, {id: "2}, {id: "3}].
  link github: https://github.com/clauderic/dnd-kit/issues/183#issuecomment-812569512
  */
  return (
    <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        ovevrflowY: 'hidden',
        '&::-webkit-scrollbar-track':{ m: 2,}
      }}>
        {/* khi co 1 columns thi nhu nay */}
        {columns?.map((column) => <Column key={column._id} column={column}/>)} 
        {/* {columns?.map((column) => {
          return (<Column key={column._id} column={column}/>)
        })} */}
        
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
    </SortableContext>
  )
}

export default ListColumns
