import { createSlice } from '@reduxjs/toolkit'
import { PayloadAction } from '@reduxjs/toolkit/dist/createAction';

export type Deck = {
  deckTitle?: string;
  deckCode: string;
  cardIds?: number[];
}
/**
 * 卡组State
 */
interface DeckState {
  deckList?: Deck[];
}

const loadFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem('deckList') || '[]');
}

/**
 * TODO: 保存到localStorage
 * @param state 
 */
const saveToLocalStorage = (deckList: Deck[]) => {
  localStorage.setItem('deckList', JSON.stringify(deckList));
}

let initialState: DeckState = {
  deckList: loadFromLocalStorage(),
};

const deckSlice = createSlice({
  name: 'deck',
  initialState,
  reducers: {
    setDeckList: function(state, action: PayloadAction<Deck[]>) {
      state.deckList = action.payload;
      saveToLocalStorage(action.payload);
    },
    removeOneDeck: function(state, action: PayloadAction<number>) {
      const index = action.payload;
      const newDeckList = state.deckList?.filter((_, i) => i !== index);
      state.deckList = newDeckList;
      saveToLocalStorage(newDeckList || []);
    },
    addOneDeck: function(state, action: PayloadAction<Deck>) {
      const newDeckList = [...state.deckList || []];
      newDeckList.push(action.payload);
      state.deckList = newDeckList;
      saveToLocalStorage(newDeckList || []);
    }
  }
});

export const {
  setDeckList,
  removeOneDeck,
  addOneDeck,
} = deckSlice.actions
export default deckSlice.reducer