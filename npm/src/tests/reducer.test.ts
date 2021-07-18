import { Action, defaultState, reducer } from '../reducer'

describe('reducer', () => {
  it('should return same state for other actions', () => {
    const result = reducer(defaultState, { type: 'FOOBAR' } as unknown as Action)

    expect(result).toBe(defaultState)
  })
})
