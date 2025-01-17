import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  //   startTime: 0,
  //   duration: 5,
  fps: 10,
  scale: 320,
  quality: 'high',
  enabled: false,
  palettegenEnabled: false,
};

const gifSlice = createSlice({
  name: 'gif',
  initialState,
  reducers: {
    setGifConfig: (state, action) => {
      return { ...state, ...action.payload };
    },
    setGifEnabled: (state, action) => {
      state.enabled = action.payload;
    },
    setPalettegenEnabled: (state, action) => {
      state.palettegenEnabled = action.payload;
    },
  },
});

export const { setGifConfig, setGifEnabled, setPalettegenEnabled } = gifSlice.actions;

export const selectGifConfig = (state) => state.gif;
export const selectGifEnabled = (state) => state.gif.enabled;
export const selectPalettegenEnabled = (state) => state.gif.palettegenEnabled;

export default gifSlice.reducer;
