import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filename: '',
  fileFormat: '',
  outputDirectory: '',
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
    setOutputDirectory: (state, action) => {
      state.outputDirectory = action.payload;
    },
  },
});

export const { setFilename, setFileFormat, setOutputDirectory } = fileDetailsSlice.actions;

export const selectFilename = (state) => state.fileDetails.filename;
export const selectFileFormat = (state) => state.fileDetails.fileFormat;
export const selectOutputDirectory = (state) => state.fileDetails.outputDirectory;

export default fileDetailsSlice.reducer;
