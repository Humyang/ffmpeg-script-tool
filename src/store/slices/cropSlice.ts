import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Crop } from 'react-image-crop';

interface CropState {
  crop: Crop | null;
}

const initialState: CropState = {
  crop: null,
};

const cropSlice = createSlice({
  name: 'crop',
  initialState,
  reducers: {
    setCropData(state, action: PayloadAction<Crop>) {
      state.crop = action.payload;
    },
  },
});

export const { setCropData } = cropSlice.actions;
export default cropSlice.reducer;
