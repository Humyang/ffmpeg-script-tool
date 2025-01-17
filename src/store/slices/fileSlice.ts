import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filePath: "",
  fileName: "",
  fileSize: 0,
  videoDimensions: { width: 0, height: 0 },
};

const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {
    setFilePath: (state, action) => {
      state.filePath = action.payload;
    },
    setFileName: (state, action) => {
      state.fileName = action.payload;
    },
    setFileSize: (state, action) => {
      state.fileSize = action.payload;
    },
    setVideoDimensions: (state, action) => {
      state.videoDimensions = action.payload;
    },
  },
});

// 添加 selectFilePath 选择器
export const selectFilePath = (state) => state.file.filePath;
export const selectFileName = (state) => state.file.fileName;
export const selectFileSize = (state) => state.file.fileSize;
export const selectVideoDimensions = (state) => state.file.videoDimensions;

export const { setFilePath, setFileName, setFileSize, setVideoDimensions } = fileSlice.actions;
export default fileSlice.reducer;
