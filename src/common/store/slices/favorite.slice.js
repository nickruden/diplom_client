import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    favoriteEvents: [],
};

const favoriteEventsSlice = createSlice({
    name: 'userFollowing',
    initialState,
    reducers: {
        setFavoriteEvent(state, action) {
            state.favoriteEvents = action.payload;
          },

        addFavoriteEvent(state, action) {
            if (!state.favoriteEvents.includes(action.payload)) {
                state.favoriteEvents.push(action.payload);
            }
        },

        removeFavoriteEvent(state, action) {
            state.favoriteEvents = state.favoriteEvents.filter(id => id !== action.payload);
        },

        resetFavoriteEvent(state, action) {
            state.favoriteEvents = [];
        },
    }
});

export const { setFavoriteEvent, addFavoriteEvent, removeFavoriteEvent, resetFavoriteEvent } = favoriteEventsSlice.actions;

export default favoriteEventsSlice.reducer;
