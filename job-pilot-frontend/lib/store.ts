import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import userReducer from './features/user/userSlice'

const rootReducer = combineReducers({
  user: userReducer,
})

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['user'], // Only persist the user slice
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  })
  
  const persistor = persistStore(store)
  return { store, persistor }
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>['store']
export type AppPersistor = ReturnType<typeof makeStore>['persistor']
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
