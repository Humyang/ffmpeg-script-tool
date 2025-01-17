import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filename: '',
  fileFormat: '',
};

const fileDetailsSlice = createSlice({
  name: 'fileDetails',
  initialState,
  reducers: {
    setFilename: (state, action) => {
      state.filename = action.payload;
    },
    setFileFormat: (state, action) => {
      state.fileFormat = action.payload;
    },
  },
});

export const { setFilename, setFileFormat } = fileDetailsSlice.actions;

export const selectFilename = (state) => state.fileDetails.filename;
export const selectFileFormat = (state) => state.fileDetails.fileFormat;

export default fileDetailsSlice.reducer;
