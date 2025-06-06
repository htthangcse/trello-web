import { useState } from 'react'
import { toast } from 'react-toastify'
import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import {SortableContext, horizontalListSortingStrategy} from '@dnd-kit/sortable'

function ListColumns({ columns, createNewColumn, createNewCard, deleteColumnDetails }) {
  const [openNewColumnForm, setopenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => setopenNewColumnForm(!openNewColumnForm)

  const [newColumnTitle, setNewColumnTitle] = useState('')
  const addNewColumn = () => {
    if(!newColumnTitle) {
      toast.error('Please enter Column Title!')
      return
    }
    // Tạo dữ liệu Column để gọi API
    const newColumnData = {
      title: newColumnTitle
    }
    
    /**
     * Gọi lên props function createNewColumn nằm ở component cha cao nhất (boards/_id.jsx)
     * Lưu ý: Về sau ở học phần MERN STACK Advance học trực tiếp thì chúng ta sẽ đưa dữ liệu board ra ngoài Redux Global Store
     * Thì lúc này chúng ta có thể gọi API ở đây là xong thay vì phải lần lượt gọi ngược lên những
     * component cha phía bên trên. (Đối với component con nằm càng sâu thì càng khổ)
     * Với việc sử dụng Redux như vậy thì code sẽ Clean chuẩn chỉnh hơn rất nhiều
     */
    createNewColumn(newColumnData)

    // Đóng trạng thái thêm Column mới & clear input
    toggleOpenNewColumnForm()
    setNewColumnTitle('')
  }

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
        ovevflowY: 'hidden',
        '&::-webkit-scrollbar-track':{ m: 2,}
      }}>
        {/* khi co 1 columns thi nhu nay */}
        {/*columns?.map((column) => <Column key={column?._id} column={column} createNewCard={createNewCard}/>)*/} 
        {columns?.map((column) => {
          return (<Column 
            key={column._id} 
            column={column} 
            createNewCard={createNewCard}
            deleteColumnDetails={deleteColumnDetails}
            />)
        })}
        
        {/* add new column */}
        {!openNewColumnForm
          ? <Box onClick={toggleOpenNewColumnForm} sx={{
            minWidth: '250px',
            maxWidth: '250px',
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
          : <Box sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            p: 1,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#fffff3d',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>
            <TextField  
              label="Enter column title..." 
              type="text" 
              size="small" 
              variant="outlined"
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value) }
              sx={{ 
                '& label': { color: 'white'},
                '& input': { color: 'white'},
                '& label.Mui-focused': { color: 'white'},
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white'},
                  '&:hover fieldset': { borderColor: 'white'},
                  '&.Mui-focused fielset': { borderColor: 'white'},
                }
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button 
                onClick={addNewColumn}
                variant="contained" color="success" size="small"
                sx={{
                  boxShadow: 'none',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&hover': { bgcolor: (theme) => theme.palette.success.main }
                }}
              >Add Column</Button>
              <CloseIcon 
                fontSize="small"
                sx={{ 
                  color: 'white',
                  cursor: 'pointer',
                  '&:hover': { color: (theme) => theme.palette.warning.light }
                }}
                onClick={toggleOpenNewColumnForm}
              />
            </Box>
          </Box>
        }
        
      </Box>
    </SortableContext>
  )
}

export default ListColumns
