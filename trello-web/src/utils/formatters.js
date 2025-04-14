/**
 * YouTube: TrungQuanDev - Một Lập Trình Viên
 * Created by trungquandev.com's author on Jun 28, 2023
 */
/**
 * Capitalize the first letter of a string
 */
export const capitalizeFirstLetter = (val) => {
    if (!val) return ''
    return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

/*
    Video 37.2: Cách xử lý bug logic thư viện dnd-kit khi Column là rỗng:
    Phía FE sẽ tạo ra 1 cái card đặc biệt: Placeholder Card, không liên quan tới BE
    Card đặc biệt này sẽ được ẩn ở giao diện UI người dùng.
    Cấu trúc Id của cái card này để Unique rất đơn giản không cần phải làm random phức tạp:
    ColumnId-placeholder-card (mỗi column chỉ có thể có tối đa một cái placeholder card)
    Quan trọng khi tạo: phải đầy đủ: (_id, boardId, columnId, FE_PlaceholderCard)
*/

export const generatePlaceholderCard = (column) => {
    return {
        _id: `${column._id}-placeholder-card`,
        boardId: column.boardId,
        columnId: column._id,
        FE_PlaceholderCard: true,
    }
}