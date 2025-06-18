import { createSlice } from '@reduxjs/toolkit';

const savedCity = typeof window !== 'undefined' ? localStorage.getItem("userCity") : null;

const initialState = {
  city: savedCity || null,
};

const citySlice = createSlice({
  name: 'userCity',
  initialState,
  reducers: {
    setCity(state, action) {
      state.city = action.payload;
    },
    clearCity(state) {
      state.city = null;
    }
  }
});

export const { setCity, clearCity } = citySlice.actions;

export default citySlice.reducer;
