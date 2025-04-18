import axios from 'axios'
import { API_ROOT } from '~/utils/constant'

// Chúng ta sẽ try catch các lỗi chung bằng Interceptors sau này Advance

export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`) // ``: string literal
  // Lưu ý: axios sẽ trả về kết quả qua property của nó là data
  return response.data
}
