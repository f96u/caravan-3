const update = jest.fn()
const remove = jest.fn()
export const useTodo = jest.fn().mockReturnValue({
  update,
  remove,
})
