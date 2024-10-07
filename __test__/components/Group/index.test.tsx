import { Group } from "@/src/components/Group"
import { useGroup } from "@/src/components/Group/useGroup"
import { act, fireEvent, render, screen } from '@testing-library/react'

jest.mock('@/src/components/Group/useGroup', () => ({
  useGroup: jest.fn(() => ({
    groups: [],
    createGroup: jest.fn()
  }))
}))

const mockUseGroup = jest.mocked(useGroup)

describe('Group', () => {
  it.todo('groups全ての要素がレンダリングされている')
  it('グループを新規作成ボタンを押した時にcreateGroupが発火する', () => {
    const createGroup = jest.fn()
    mockUseGroup.mockImplementation(() => ({
      groups: [],
      createGroup,
    }))

    act(() => {
      render(<Group />)
    })

    act(() => {
      fireEvent.click(screen.getByTestId('create-group'))
    })

    expect(createGroup).toHaveBeenCalled()
  })
})