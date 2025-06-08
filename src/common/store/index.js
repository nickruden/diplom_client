import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './slices/user.slice';
import userFollowingReducer from './slices/following.slice';
import userFavoriteEvents from './slices/favorite.slice';
import userCity from './slices/city.slice';

const rootReducer = combineReducers({
  user: userReducer,
  userFollowing: userFollowingReducer,
  userFavoriteEvents: userFavoriteEvents,
  userCity: userCity,
});

const persistConfig = {
  key: 'contevents',
  storage,
  blacklist: ['userFollowing', 'userFavoritesEvents']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);