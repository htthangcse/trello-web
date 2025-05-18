import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { 
  DndContext,
  // PointerSensor,
  // MouseSensor,
  // TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  //closestCenter,
  pointerWithin,
  //rectIntersection,
  getFirstCollision,
} from '@dnd-kit/core'
import { MouseSensor, TouchSensor } from '~/customLibraries/DndKitSensors'
import {useEffect, useState, useCallback, useRef} from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import { cloneDeep, isEmpty }  from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD',
}

function BoardContent({ board, createNewColumn, createNewCard }) {
  // yêu cầu chuột di chuyển 10px thì mới kích hoạt event, fix trường hợp click bị gọi event
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: {distance: 10 } })
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: {distance: 10 } })
  // Nhấn giữu 250ms và dung sai của cảm ứng (dễ hiểu là di chuyển/chênh lẹch 5px) thì mới kích hoạt event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500} })

  const sensors = useSensors(mouseSensor, touchSensor)

  //const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
  const [orderedColumns, setOrderedColumns] = useState([])
  // cùng một thời điểm chỉ có một phẩn tử đang được kéo (column hoặc card)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

  // Điểm va chạm cuối cùng trước đó (xử lý thuật toán va chạm, video 37)
  const lastOverId = useRef(null)

  useEffect(( ) => {
    console.log('columns: ', board?.columns)
    console.log('columnOrderIds: ', board?.columnOrderIds)
    //setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
    setOrderedColumns(board?.columns)
  }, [board])

  // tìm một cái Column theo cardId
  const findColumnByCardId = (cardId) => {
    // đoạn này cần lưu ý, nên dùng c.cards thay vì c.cardOrderIds bởi vì ở bước handleDragOver 
    // chúng ta sẽ làm dữ liệu cho cards hoàn chỉnh trước rồi mới tạo ra cardOrderIds mới
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  // Function chung xử lý việc cập nhật lại state trong trường hợp di chuyển Card giữa các Column khác nhau
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns(prevColumns => {
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)
      // logic tính toán "cardIndex mới" (trên hoặc dưới overCard) lấy chuẩn ra từ code của thư viện 
      // - nhiều khi muốn từ chối hiểu =))
      let newCardIndex 
      const isBelowOverItem = active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1
      
      // Clone mảng OrderColumnsState cũ ra một cái mới để xử lí data rồi return 
      // - cập nhật OrderColumnsState mới 
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)
      // column cũ 
      if (nextActiveColumn) {
        // Xóa card ở cái column active (cũng có thể là column cũ, cái lúc mà kéo card ra khoru nó để sang column khác)
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)

        // Thêm Placeholder Card nếu Column rỗng: Bị kéo hết Card đi, không còn cái nào nữa (video 37.2)
        if (isEmpty(nextActiveColumn.cards)) {
          
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }

        // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }
      // column mới 
      if (nextOverColumn) {
        // Kiểm tra xem card đang kéo có tồn tại ở overColumn chưa, nếu có thì cần xóa nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

        // Đối với trường hợp dragEnd thì phải cập nhật lại chuẩn dữ liệu
        // columnId trong card sau khi kéo card giữa 2 column khác nhau
        // const rebuild_activeDraggingCardData = {
        //   ...activeDraggingCardData,
        //   columnId: nextOverColumn._id,
        // }
        // Tiếp theo là thêm cái card đang kéo vào overColumn theo vị trí index mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex, 
          0,
          {...activeDraggingCardData, columnId: nextOverColumn._id,} 
        ) // toSpliced return ve mang moi 

        // Xóa Placeholder Card đi nếu nó đang tồn tại (video 37.2)
        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceholderCard)
        
        // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }
      
      return nextColumns
    })
  }

  // Trigger khi bắt đầu kéo (drag) một phần tử
  const handleDragStart = (event) => {
    console.log('handleDragStart: ', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }
  // Triiger trong quá trình kéo (drag) một phần tử
  const handleDragOver = (event) => {
    // không làm gì thêm nếu đang kéo Cloumn
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return 
    // còn nếu kéo card thì xử lí thêm để có thể kéo card qua lại giữa các column
    // console.log('handleDragOver: ', event)
    const { active, over } = event
    // Cần đảm bảo nếu ko tồn tại active hoặc over (khi kéo ra khỏi phạm vi container)
    // thì ko làm gì cả (tránh crash trang)
    if(!active || !over) return
    //activeDraggingCard: là cái card đang được kéo
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active // object destructing
    // overCard là cái card đang tương tác trên hoặc dưới so với cái card được kéo ở trên
    const { id: overCardId } = over

    // tìm 2 cái column theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    if (!activeColumn || !overColumn) return
    // xử lí logic ở đây chỉ khi kéo card qua 2 column khác nhau, còn nếu kéo card trong chính column ban đầu
    // của nó thì ko làm gì
    // vì đây là đoạn xử lý lúc kéo (handleDragOver), còn xử lí lúc kéo xong xuôi thì nó lại là vấn đề khác ở (handleDragEnd) 
    if (activeColumn._id !== overColumn._id) {
      // tìm vị trí (index) của cái overCard trong column đích (nơi mà activeCard sắp được thả)
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }
  // Trigger khi kết thúc hành động kéo (drag) một phần tử => hành động thả (drop)
  const handleDragEnd = (event) => {
    // console.log('handleDragEnd: ', event )
    const { active, over } = event
    // Cần đảm bảo nếu ko tồn tại active hoặc over (khi kéo ra khỏi phạm vi container)
    // thì ko làm gì cả (tránh crash trang)
    if(!active || !over) return 

    // Xử lí kéo thả card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      //activeDraggingCard: là cái card đang được kéo
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active // object destructing
      // overCard là cái card đang tương tác trên hoặc dưới so với cái card được kéo ở trên
      const { id: overCardId } = over

      // tìm 2 cái column theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)
      // Nếu không tồn tại 1 trong 2 column thì không làm gì cả, tránh crash trang web
      if (!activeColumn || !overColumn) return

      // Hành động kéo thả card giữa 2 column khác nhau
      // phải dùng tới activeDragItemData.columnId hoặc oldColumnWhenDraggingCard._id (set vào state từ
      // bước handleDragStart ) chứ không phải activeData trong scope handleDragEnd vì sau khi đi qua onDragOver tới đây là state của card đã bị cập nhật một lần rồi.
      // console.log('oldColumnWhenDraggingCard: ', oldColumnWhenDraggingCard)
      // console.log('overColumn: ', overColumn)

      // kéo thả card giữa 2 column khác nhau
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } 
      else {
        // Hành động kéo thả card trong cùng 1 column 
        // lấy vị trí cũ từ thằng oldColumnWhenDraggingCard
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId) 
        // lấy vị trí cũ từ thằng over
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId) 
        // Dùng arrayMove vì kéo thả card trong một cái column thì tương tự với logic kéo column trong một cái board content
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)
        console.log('dndOrderedCards: ', dndOrderedCards)
        setOrderedColumns(prevColumns => {
          // Clone mảng OrderColumnsState cũ ra một cái mới để xử lí data rồi return 
          // - cập nhật OrderColumnsState mới 
          const nextColumns = cloneDeep(prevColumns)
          // Tìm tới cái column mà chúng ta đang thả
          const targetColumn = nextColumns.find(column => column._id === overColumn._id)
          // cập nhật lại 2 giá trị mới là card và cardOrderIds trong cái targetColumn
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map(card => card._id)
          console.log('targetColumn: ',targetColumn)
          // trả về giá trị state mới (chuẩn vị trí)
          return nextColumns
        })
      }
    }
    
    // Xử lí kéo thả Column trong  mot cai boardContent
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      //Nếu vị trí sau khi kéo thả khác với vị trí ban đầu
      if (active.id !== over.id) {
        // lấy vị trí cũ từ thằng active
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id) 
        // lấy vị trí cũ từ thằng over
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id) 
        // Dùng arrayMove của thằng dnd-kit để sắp xếp lại mảng columns ban đầu
        // Code của arrayMode ở đây: dnd-kit/packages/sorttable/src/utilities/arrayMode.ts
        const dndOrderColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
        // 2 cai console.log du lieu nay sau dung de xu ly goi API
        // const dndOrderColumnsIds = dndOrderColumns.map(c => c._id)
        // console.log('dndOrderColumns: ', dndOrderColumns)
        // console.log('dndOrderColumnsIds: ', dndOrderColumnsIds)
        // cập nhật lại state columns ban đầu sau khi đã kéo thả
        setOrderedColumns(dndOrderColumns)
      }
    }
    
    // Những dữ liệu sau khi kéo thả này luôn phải trả về giá trị null mặc định ban đầu
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }
  // Animation khi thả (drop) phần tử - test bằng cách kéo xong thả trực tiếp và nhìn phần 
  // giữ chỗ Overlay (vd 32)
  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: '0.5', }, },
    }),
  };

  // chúng ta sẽ custom lại chiến lược/ thuật toán phát hiện va chạm tối ưu cho việc kéo thả card giữa
  // nhiều column (video 37 fix bug quan trọng)
  const collisionDetectionStrategy = useCallback((args) => {
    // Trường hợp kéo Column thì dùng thuật toán closestCorners là chuẩn nhất
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({...args})
    }

    // Tìm các điểm giao nhau, va chạm, trả về một mảng các va chạm - intersections với con trỏ
    const pointerIntersections = pointerWithin(args)
    // video 37.1: nếu pointerIntersections là mảng rỗng, return luôn ko làm gì hết
    // Fix triệt để cái bug flickering của thư viện dnd-kit trong trường hợp sau:
    // - Kéo một cái card có image cover lớn và kéo lên phía trên cùng ra khỏi khu vực kéo thả
    if (!pointerIntersections?.length) return 
    // Thuật toán phát hiện va chạm sẽ trả về một mảng các va chạm ở đây (ko cần bước này nữa - video 37.1)
    //const intersections = pointerIntersections?.length > 0 ? pointerIntersections : rectIntersection(args)
    let overId = getFirstCollision(pointerIntersections, 'id')
    if (overId) {
      // video 37: Đoạn này để fix cái vụ flickering nhé.
      // Nếu cái over nó là column thì sẽ tìm tới cái cardId gần nhất bên trong khu vực va chạm đó dựa vào 
      // thuật toán phát hiện va chạm closestCenter hoặc closestCorners đều được. Tùy nhiên
      // ở đây dùng closestCorners mình thấy mượt mà hơn
      const checkColumn = orderedColumns.find(column => column._id === overId)
      if (checkColumn) {
        // console.log('overId before: ', overId)
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return (container.id !== overId) && (checkColumn?.cardOrderIds?.includes(container.id))
          })
        })[0]?.id
        // console.log('overId after: ', overId)
      }
      lastOverId.current = overId
      return [{ id: overId }]
    }

    // Nếu overId là null thì trả về mảng rỗng - tránh bug crash trang
    return lastOverId.current ?  [{ id: lastOverId.current }] : []
  }, [activeDragItemType, orderedColumns]) 
  console.log('result ', orderedColumns)
  return (
    
    <DndContext
      // Cảm biến (đã giải thích kỹ ở vd số 30)
      sensors={sensors}
      // Thuật toán phát hiện va chạm (nếu không có nó thì card với cover lớn sẽ không kéo
      // qua Column được vì lúc này nó đang bị conflict giữa card và column), chúng ta sẽ dùng closestsCorners thay vì closestsCenter
      // https://docs.dndkit.com/api-documentation/context-provider/collision-detection-algorithms
      // update video 37: nếu chỉ dùng closestCorners sẽ có bug flickering + sai lệch dữ liệu (xem video 37)
      //collisionDetection={closestCorners}
      // Tự custom nâng cao thuật toán phát hiện va chạm (video fix bug số 37)
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd} 
    >
      <Box sx={{
        bgcolor: '#1976d2',
        width: '100%',
        height: (theme) => theme.trello.boadrContentHeight,
        p: '10px 0',
      }}>
        <ListColumns 
          columns={orderedColumns}
          createNewColumn={createNewColumn}
          createNewCard={createNewCard}
        />
        <DragOverlay dropAnimation={customDropAnimation}>
          {(!activeDragItemType) && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) &&  <Column column={activeDragItemData}/>} 
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) &&  <Card card={activeDragItemData}/>} 
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
