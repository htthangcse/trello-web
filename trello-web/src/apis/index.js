import axios from 'axios'
import { API_ROOT } from '~/utils/constant'

// Chúng ta sẽ try catch các lỗi chung bằng Interceptors sau này Advance

// Boards
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`) // ``: string literal
  // Lưu ý: axios sẽ trả về kết quả qua property của nó là data
  console.log('api: ',response.data)
  return response.data
}

// Columns
export const createNewColumnAPI = async (newColumnData) => {
  const response = await axios.post(`${API_ROOT}/v1/columns`, newColumnData)
  return response.data
}

// Cards
export const createNewCardAPI = async (newCardData) => {
  const response = await axios.post(`${API_ROOT}/v1/cards`, newCardData)
  return response.data
}