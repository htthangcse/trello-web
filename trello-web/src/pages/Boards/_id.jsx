// Board detail
import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
//import { mockData } from '~/apis/mock-data'
import { fetchBoardDetailsAPI } from '~/apis'

function Board() {
  const [board, setBoard] = useState(null)
  useEffect(() => {
    // Tạm thời fix cứng boardId, flow chuẩn chỉnh về sau khi học nâng cao trực tiếp với mình là chúng ta
    // sẽ sử dụng react-router-dom để lấy chuẩn boardId từ URL về
    const boardId = '6801bb80189fa8a96c5dcdea'
    // Call API
    fetchBoardDetailsAPI(boardId).then((board) => {
      console.log('board: ', board.board )
      setBoard(board)
    })
  }, [])
  
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh',  }}>
      <AppBar/>
      { board && <BoardBar board={board?.board}/> }
      { board && <BoardContent board={board?.board}/> }
    </Container>
  )
}

export default Board
