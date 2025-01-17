"use client";

import React, { useState } from "react";
import { Button, Typography, Box } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useDispatch, useSelector } from "react-redux";
import { setFilePath, setFileName, setFileSize, setVideoDimensions, selectFilePath, selectFileName, selectFileSize, selectVideoDimensions } from "@/store/slices/fileSlice"; // Adjust the import path as necessary

const UploadComponent = () => {
  const [localFileName, setLocalFileName] = useState("");
  const dispatch = useDispatch();
  const filePath = useSelector(selectFilePath);
  const fileName = useSelector(selectFileName);
  const fileSize = useSelector(selectFileSize);
  const videoDimensions = useSelector(selectVideoDimensions);

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      setLocalFileName(file.name);
      const videoURL = URL.createObjectURL(file);
      dispatch(setFilePath(videoURL)); // Save file path to slice
      dispatch(setFileName(file.name)); // Save file name to slice
      dispatch(setFileSize(file.size)); // Save file size to slice

      const video = document.createElement('video');
      video.src = videoURL;
      video.onloadedmetadata = () => {
        dispatch(setVideoDimensions({ width: video.videoWidth, height: video.videoHeight }));
      };
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Button
        variant="contained"
        component="label"
        startIcon={<UploadFileIcon />}
      >
        Upload File
        <input type="file" hidden onChange={handleFileChange} />
      </Button>
      {localFileName && (
        <Box>
          <Typography>Uploaded file: {fileName}</Typography>
          <Typography>Size: {(fileSize / (1024 * 1024)).toFixed(2)} MB</Typography>
          <Typography>Dimensions: {videoDimensions.width} x {videoDimensions.height}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default UploadComponent;
