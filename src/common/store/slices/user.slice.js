import { createSlice } from '@reduxjs/toolkit';
import { deleteAuthTokens } from '../../utils/MyStorage/tokens/deleteAuthTokens';

const initialState = {
    user: null,
    isAuthorized: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        userAuth(state, action) {
            return {
                user: {
                    id: action.payload.id,
                },
                isAuthorized: action.payload.flag,
            }
        },

        loginedUser(state, action) {
            return {
                ...state,
                user: action.payload,
            } 
        },

        updateEventCount(state, action) {
            state.user.eventsCount = action.payload;
        },

        logoutUser() {
            deleteAuthTokens();
            return {
                ...initialState,
            }
        }
    }
});

export const { userAuth, loginedUser, updateEventCount, logoutUser } = userSlice.actions;

export default userSlice.reducer;
