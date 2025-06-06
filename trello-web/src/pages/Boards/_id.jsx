// Board detail
import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { mapOrder } from '~/utils/sorts'
//import { mockData } from '~/apis/mock-data'
import { 
  fetchBoardDetailsAPI, 
  createNewColumnAPI, 
  createNewCardAPI, 
  updateBoardDetailsAPI, 
  updateColumnDetailsAPI, 
  moveCardToDifferentColumnAPI,
  deleteColumnDetailsAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material'
import { toast } from 'react-toastify'

function Board() {
  const [board, setBoard] = useState(null)
  useEffect(() => {
    // Tạm thời fix cứng boardId, flow chuẩn chỉnh về sau khi học nâng cao trực tiếp với mình là chúng ta
    // sẽ sử dụng react-router-dom để lấy chuẩn boardId từ URL về
    const boardId = '6801bb80189fa8a96c5dcdea'
    // Call API
    fetchBoardDetailsAPI(boardId).then((board) => {
      // Sắp xếp thứ tự các column luôn ở đây trước khi đưa dữ liệu xuống bên dưới
      // các component con (video 71 đã giải thích lý do ở phần fix bug quan trọng)
      board.board.columns = mapOrder(board.board.columns, board.board.columnOrderIds, '_id')

      board?.board?.columns?.forEach( column => {
        // Khi F5 trang web thì cần xử lý vấn đề kéo thả vào một column rỗng (Nhớ lại video 37.2, code hiện tại là video 69)
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          // Sắp xếp thứ tự các card luôn ở đây trước khi đưa dữ liệu xuống bên dưới
          // các component con (video 71 đã giải thích lý do ở phần fix bug quan trọng)
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id' )
        }
      })
      setBoard(board)
    })
  }, [])

  // Func này có nhiệm vụ gọi API tạo mới Column và cập nhật lại dữ liệu State Board
  const createNewColumn = async (newColumnData) => {
    const res = await createNewColumnAPI({
      ...newColumnData,
      boardId: board?.board._id
    })
    // Do response trả về là 1 object chứa nhiều dữ liệu khác nhau
    // Chúng ta cần lấy ra dữ liệu Column mới được tạo ra
    const createdColumn = res.createdColumn

    // Khi tạo column mới thì nó sẽ chưa có card, cần xử lý vấn đề kéo thả vào một column rỗng (Nhớ lại video 37.2, code hiện tại là video 69)
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    // Cập nhật lại dữ liệu State Board
    // Phía Frontend chúng ta cần phải tự làm đúng state data board (thay vì phải gọi lại api fetchBoardDetailsAPI)
    // Lưu ý: cách này phụ thuộc vào tùy lựa chọn và đặc thù dự án, có nơi thì BE sẽ hỗ trợ trả về luôn
    // toàn bộ Board dù đây cố là api tạo column hay card đi chăng nữa => FE sẽ nhàn hơn
    const newBoard = { ...board } // clone cấp 1
    newBoard.board = { ...board.board} // clone cấp 2
    newBoard.board.columns.push(createdColumn)
    newBoard.board.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }
  
  // Func này có nhiệm vụ gọi API tạo mới Card và cập nhật lại dữ liệu State Board
  const createNewCard = async (newCardData) => {
    const res = await createNewCardAPI({
      ...newCardData,
      boardId: board?.board._id,
    })
    const createdCard = res.createdCard

    // Cập nhật lại dữ liệu State Board
    const newBoard = { ...board }
    newBoard.board = { ...board.board}
    const columnToUpdate = newBoard.board.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate) {
      //Nếu Column rỗng: bản chất là đang chứa một cái placeholder card (video 37.2 hiện tại video 69)
      if (columnToUpdate.cards.some(card => card.FE_Placeholder)) {
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]
      } else {
        // Ngược lại Column đã có data thì push vào cuối cùng
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }
    }
    setBoard(newBoard)
  }

  // Func này có nhiệm vụ gọi API và xử lý khi kéo thả Column xong xuôi
  /*
  Chỉ cần gọi API để cập nhật lại columnOrderIds của Board đó là xong
  */
  const moveColumns = (dndOrderedColumns) => {
    // Cập nhật lại cho thuần dữ liệu State Board
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board } // clone cấp 1
    newBoard.board = { ...board.board} // clone cấp 2
    newBoard.board.columns = dndOrderedColumns
    newBoard.board.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // Gọi API update Board
    updateBoardDetailsAPI(newBoard?.board._id, { columnOrderIds: newBoard.board.columnOrderIds })
  }

  /*
  Khi di chuyển card trong cùng Column:
  Chỉ cần gọi API để cập nhật lại cardOrderIds của Column đó là xong
  */
  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    // Cập nhật lại cho thuần dữ liệu State Board
    const newBoard = { ...board } // clone cấp 1
    newBoard.board = { ...board.board} // clone cấp 2
    const columnToUpdate = newBoard.board.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    setBoard(newBoard)

    // Gọi API update Column
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds})
  }

  /**
   * Khi di chuyển card sang Column khác:
   * B1: Cập nhật lại mảng cardOrderIds của Column ban đầu chứa nó (bản chất là xóa cái _id của card đó ra khỏi mảng)
   * B2: Cập nhật mảng cardOrderIds của Column tiếp theo (bản chất là thêm _id của Card vào mảng)
   * B3: Cập nhật lại trường columnId mới của cái Card đã kéo
   * => Làm một API support riêng
   */
  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    // Cập nhật lại cho thuần dữ liệu State Board
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board } // clone cấp 1
    newBoard.board = { ...board.board} // clone cấp 2
    newBoard.board.columns = dndOrderedColumns
    newBoard.board.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // Gọi API xử lý phía BE
    let prevCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds
    // Xử lý vấn đề khi kéo card cuối cùng ra khỏi Column, Column rỗng sẽ có placeholder card, cần xóa nó đi trước khi gửi dữ liệu lên cho phía BE
    // Nhớ lại video 37.2
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = [] 

    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })
  }

  // Xử lý xóa một Column và Cards bên trong nó
  const deleteColumnDetails = (columnId) => {
    //Cập nhật lại cho thuần dữ liệu State Board
    const newBoard = { ...board } // clone cấp 1
    newBoard.board = { ...board.board} // clone cấp 2
    newBoard.board.columns = newBoard.board.columns.filter(c => c._id !== columnId)
    newBoard.board.columnOrderIds = newBoard.board.columnOrderIds.filter(_id => _id !== columnId)
    setBoard(newBoard)

    // Gọi API xử lý phía BE
    deleteColumnDetailsAPI(columnId).then(res => {
      toast.success(res?.deleteResult)      
    })
  }

  if (!board) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: 2, width: '100vw', 
        height: '100vh' }}>
        <CircularProgress />
        <Typography>Loading Board...</Typography>
      </Box>
    )
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh',  }}>
      <AppBar/>
      { board && <BoardBar board={board?.board}/> }
      { board && <BoardContent 
        board={board?.board}
        
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
        deleteColumnDetails={deleteColumnDetails}
      /> }
    </Container>
  )
}

export default Board