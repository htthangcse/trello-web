import { useState } from 'react'
import { toast } from 'react-toastify'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ContentCut from '@mui/icons-material/ContentCut'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Tooltip from '@mui/material/Tooltip'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import Cloud from '@mui/icons-material/Cloud'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import AddCardIcon from '@mui/icons-material/AddCard'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import ListCards from './ListCards/ListCards'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { useConfirm } from 'material-ui-confirm'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function Column({ column, createNewCard, deleteColumnDetails }) {
  /*
  The items are stretched because you're using CSS.Transform.toString(), 
  use CSS.Translate.toString() if you don't want to have the scale 
  transformation applied.
  link github: https://github.com/clauderic/dnd-kit/issues/117
   */
  const { attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
    id: column._id,
    data: {...column}
  })
  const dndKitColumnStyles  = {
    //touchAction: 'none', // danh cho sensor default dạng PointerSensor
    transform: CSS.Translate.toString(transform),
    transition,
    // chiều cao phải luôn max 100% vì nếu không sẽ lỗi lúc kéo column ngắn qua một cái column dài thì phải kéo
    // ở khu vực giữa rất khó chịu (demo ở vd 32). Lưu ý lúc này phải kết hợp với (...listener) nằm ở Box
    // chứ không phải ở div ngoài cùng để tránh trường hợp kéo vào vùng xanh
    height: '100%',
    opacity: isDragging ? 0.5 : undefined,
  }

  // drop down menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => { setAnchorEl(event.currentTarget); };
  const handleClose = () => { setAnchorEl(null); };

  // Card đã được sắp xếp ở component cha (boards/_id.jsx) (video 71)
  const orderedCards = column.cards
  // phải bọc div ở đây vì vấn đề chiều cao của column khi kéo thả sẽ có bug kiểu flickering (vd 32)

  const [openNewCardForm, setopenNewCardForm] = useState(false)
  const toggleOpenNewCardForm = () => setopenNewCardForm(!openNewCardForm)

  const [newCardTitle, setNewCardTitle] = useState('')
  const addNewCard = () => {
    if(!newCardTitle) {
      toast.error('Please enter Card Title!', { position: "bottom-right"})
      return
    }
    
    // Tạo dữ liệu Card để gọi API
    const newCardData = {
      title: newCardTitle,
      columnId: column?._id,
    }
     /**
     * Gọi lên props function createNewCard nằm ở component cha cao nhất (boards/_id.jsx)
     * Lưu ý: Về sau ở học phần MERN STACK Advance học trực tiếp thì chúng ta sẽ đưa dữ liệu board ra ngoài Redux Global Store
     * Thì lúc này chúng ta có thể gọi API ở đây là xong thay vì phải lần lượt gọi ngược lên những
     * component cha phía bên trên. (Đối với component con nằm càng sâu thì càng khổ)
     * Với việc sử dụng Redux như vậy thì code sẽ Clean chuẩn chỉnh hơn rất nhiều
     */
    createNewCard(newCardData)

    // Đóng trạng thái thêm Card mới & clear input
    toggleOpenNewCardForm()
    setNewCardTitle('')
  }

  // Xử lý xóa một Column và Cards bên trong nó
  const confirmDeleteColumn = useConfirm()
  const handleDeleteColumn = async () => {
    // const { confirmed, reason } = await confirm({
    //   description: "This action is permanent!",
    // });

    // if (confirmed) {
    //   /* ... */
    // }

    // console.log(reason);
    // //=> "confirm" | "cancel" | "natural" | "unmount"
    confirmDeleteColumn({
      title: 'Delete Column?',
      description: 'This action is permanent delete your Column and its Cards! Are you sure?',
      confirmationText: 'Confirm',
      cancelmationText: 'Cancel',

      // allowClose: false,
      // dialogProps: { maxWidth: 'xs' },
      // confirmationButtonProps: { color: 'primary', variant: 'outlined' },
      // cancellationButtonProps: { color: 'inherit' },
      // confirmationKeyword: 'Tienthangdev',
    }).then(() => {
      /**
     * Gọi lên props function deleteColumnDetails nằm ở component cha cao nhất (boards/_id.jsx)
     * Lưu ý: Về sau ở học phần MERN STACK Advance học trực tiếp thì chúng ta sẽ đưa dữ liệu board ra ngoài Redux Global Store
     * Thì lúc này chúng ta có thể gọi API ở đây là xong thay vì phải lần lượt gọi ngược lên những
     * component cha phía bên trên. (Đối với component con nằm càng sâu thì càng khổ)
     * Với việc sử dụng Redux như vậy thì code sẽ Clean chuẩn chỉnh hơn rất nhiều
     */
      deleteColumnDetails(column._id)
    }).catch(() => {})
    
  }

  return (
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      <Box 
        {...listeners}
        sx={{ 
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: '#ebecf0',
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) =>  `calc(${theme.trello.boadrContentHeight} - ${theme.spacing(5)} )`
      }}>
        {/* box header */}
        <Box sx={{
          height: (theme) => theme.trello.columnHeaderHeight,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Typography
            variant='h6'
            sx={{
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}>
              {column.title}
          </Typography>
          <Box>
            <Tooltip title="More options">
              <ExpandMoreIcon
                sx={{ color: 'text.primary', cursor: 'pointer'}}
                id="basic-column-dropdown"
                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id="basic-menu-column-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem
                onClick={toggleOpenNewCardForm}
              >
                <ListItemIcon><AddCardIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentCut fontSize="small" /></ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentCopy fontSize="small" /></ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentPaste fontSize="small" /></ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>

              <Divider />
              <MenuItem
                onClick={handleDeleteColumn}
                sx={{
                  '&hover': {
                    color: 'waring.main',
                  }
                }}
              >
                <ListItemIcon> <DeleteForeverIcon fontSize="small" /> </ListItemIcon>
                <ListItemText>Delete this column</ListItemText>                </MenuItem>
              <MenuItem>
                <ListItemIcon> <Cloud fontSize="small" /> </ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
        {/* list cards */}
        <ListCards cards={orderedCards}/>
        {/* box footer */}
        <Box sx={{
          height: (theme) => theme.trello.columnFooterHeight,
          p: 2,
        }}>
          {!openNewCardForm
            ? <Box sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <Button startIcon={<AddCardIcon/>} onClick={toggleOpenNewCardForm}>Add new card</Button>
                <Tooltip title="Drag to move" >
                  <DragHandleIcon sx={{ cursor: 'pointer' }}/>
                </Tooltip>
              </Box>
            : <Box sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <TextField  
                  label="Enter card title..." 
                  type="text" 
                  size="small" 
                  variant="outlined"
                  autoFocus
                  data-no-dnd="true"
                  value={newCardTitle}
                  onChange={(e) => setNewCardTitle(e.target.value) }
                  sx={{ 
                    '& label': { color: 'text.primary'},
                    '& input': { 
                      color: (theme) => theme.palette.primary.main,
                      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white')
                    },
                    '& label.Mui-focused': { color: (theme) => theme.palette.primary.main },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                      '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
                      '&.Mui-focused fielset': { borderColor: (theme) => theme.palette.primary.main },
                    },
                    '& .MuiOutlinedInput-input': {
                      borderRadius: 1
                    }
                  }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button 
                    onClick={addNewCard}
                    variant="contained" color="success" size="small"
                    sx={{
                      boxShadow: 'none',
                      border: '0.5px solid',
                      borderColor: (theme) => theme.palette.success.main,
                      '&hover': { bgcolor: (theme) => theme.palette.success.main }
                    }}
                  >Add</Button>
                  <CloseIcon 
                    fontSize="small"
                    sx={{ 
                      color: (theme) => theme.palette.warning.light ,
                      cursor: 'pointer',
                    }}
                    onClick={toggleOpenNewCardForm}
                  />
                </Box>
              </Box>
          }
        </Box>
      </Box>
    </div>
  )
}

export default Column
