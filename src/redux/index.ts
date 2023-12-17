import { configureStore } from '@reduxjs/toolkit'
import banpickCharPoolReducer from './banpickCharPool'
import bpRuleReducer from './rules'
import deckReducer from './deck'
import playReducer from './play'

export const myStore = configureStore({
  reducer: {
    banpick: banpickCharPoolReducer,
    bpRule: bpRuleReducer,
    deck: deckReducer,
    play: playReducer,
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof myStore.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof myStore.dispatch