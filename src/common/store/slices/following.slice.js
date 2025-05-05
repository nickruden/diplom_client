import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    followingOrganizers: [],
};

const followingSlice = createSlice({
    name: 'userFollowing',
    initialState,
    reducers: {
        setFollowingOrganizers(state, action) {
            state.followingOrganizers = action.payload;
          },
        addFollowingOrganizer(state, action) {
            if (!state.followingOrganizers.includes(action.payload)) {
                state.followingOrganizers.push(action.payload);
            }
        },
        removeFollowingOrganizer(state, action) {
            state.followingOrganizers = state.followingOrganizers.filter(id => id !== action.payload);
        },
        resetFollowingOrganizer(state, action) {
            state.followingOrganizers = [];
        },
    }
});

export const { setFollowingOrganizers, addFollowingOrganizer, removeFollowingOrganizer, resetFollowingOrganizer } = followingSlice.actions;

export default followingSlice.reducer;
