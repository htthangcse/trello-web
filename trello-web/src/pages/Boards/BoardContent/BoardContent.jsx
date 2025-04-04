import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { 
  DndContext,
  // PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {useEffect, useState} from 'react'

import { arrayMove } from '@dnd-kit/sortable'

function BoardContent({ board }) {
  // yêu cầu chuột di chuyển 10px thì mới kích hoạt event, fix trường hợp click bị gọi event
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: {distance: 10 } })
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: {distance: 10 } })
  // Nhấn giữu 250ms và dung sai của cảm ứng (dễ hiểu là di chuyển/chênh lẹch 5px) thì mới kích hoạt event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500} })

  const sensors = useSensors(mouseSensor, touchSensor)

  //const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
  const [orderColumns, setOrderColumns] = useState([])
  useEffect(( ) => {
    setOrderColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])
  const handleDragEnd = (event) => {
    // console.log('handleDragEnd: ', event )
    const { active, over } = event
    // kiểm tra nếu không tồn tại over (kéo linh tinh ra ngoài thì return luôn tránh bug)
    if(!over) return 
    //Nếu vị trí sau khi kéo thả khác với vị trí ban đầu
    if (active.id !== over.id) {
      // lấy vị trí cũ từ thằng active
      const oldIndex = orderColumns.findIndex(c => c._id === active.id) 
      // lấy vị trí cũ từ thằng over
      const newIndex = orderColumns.findIndex(c => c._id === over.id) 
      // Dùng arrayMove của thằng dnd-kit để sắp xếp lại mảng columns ban đầu
      // Code của arrayMode ở đây: dnd-kit/packages/sorttable/src/utilities/arrayMode.ts
      const dndOrderColumns = arrayMove(orderColumns, oldIndex, newIndex)
      // 2 cai console.log du lieu nay sau dung de xu ly goi API
      // const dndOrderColumnsIds = dndOrderColumns.map(c => c._id)
      // console.log('dndOrderColumns: ', dndOrderColumns)
      // console.log('dndOrderColumnsIds: ', dndOrderColumnsIds)
      // cập nhật lại state columns ban đầu sau khi đã kéo thả
      setOrderColumns(dndOrderColumns)
    }
  }
  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Box sx={{
        bgcolor: '#1976d2',
        width: '100%',
        height: (theme) => theme.trello.boadrContentHeight,
        p: '10px 0',
      }}>
        <ListColumns columns={orderColumns}/>
      </Box>
    </DndContext>
  )
}

export default BoardContent
