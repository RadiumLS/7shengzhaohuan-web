import { createSlice } from '@reduxjs/toolkit'
import { PayloadAction } from '@reduxjs/toolkit/dist/createAction';

type Deck = {
  deckTitle?: string;
  deckCode: string;
  cardIds: number[];
}
/**
 * 卡组State
 */
interface DeckState {
  deckList?: Deck[];
}

let initialState: DeckState = {
  deckList: [],
};

/**
 * TODO: 保存到localStorage
 * @param state 
 */
const saveToLocalStorage = (state: DeckState) => {
}

const deckSlice = createSlice({
  name: 'deck',
  initialState,
  reducers: {
    setDeckList: function(state, action: PayloadAction<Deck[]>) {
      state.deckList = action.payload;
    },
  }
});

export const {
  setDeckList
} = deckSlice.actions
export default deckSlice.reducer