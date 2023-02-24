import { configureStore } from '@reduxjs/toolkit'
import banpickCharPoolReducer from './banpickCharPool'
import bpRuleReducer from './rules'

export const myStore = configureStore({
  reducer: {
    banpick: banpickCharPoolReducer,
    bpRule: bpRuleReducer,
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof myStore.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof myStore.dispatch