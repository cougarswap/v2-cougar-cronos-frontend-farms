import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BlockState } from '../types'

const initialState: BlockState = { currentBlock: 0, initialBlock: 0 }

export const blockSlice = createSlice({
  name: 'Block',
  initialState,
  reducers: {
    setBlock: (state, action: PayloadAction<number>) => {
      const newState = {...state}
      if (state.initialBlock === 0) {
        newState.initialBlock = action.payload
      }

      newState.currentBlock = action.payload
      return newState 
    },
    setInitialBlock: (state, action: PayloadAction<number>) => {
      return {...state, initialBlock: action.payload} 
    }
  },
})

// Actions
export const { setBlock, setInitialBlock } = blockSlice.actions

export default blockSlice.reducer
