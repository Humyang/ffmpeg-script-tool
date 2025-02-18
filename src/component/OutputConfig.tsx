import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Box, Button } from '@mui/material';
import { setFilename, setFileFormat, selectFilename, selectFileFormat } from '@/store/slices/fileDetailsSlice'; // Adjust the import path as necessary

const OutputConfig = () => {
  const dispatch = useDispatch();
  const filename = useSelector(selectFilename);
  const fileFormat = useSelector(selectFileFormat);

  const handleFilenameChange = (event) => {
    dispatch(setFilename(event.target.value));
  };

  const handleFileFormatChange = (event) => {
    dispatch(setFileFormat(event.target.value));
  };

  const generateRandomFilename = () => {
    const randomFilename = Math.random().toString(36).substring(2, 12);
    dispatch(setFilename(randomFilename));
  };
  useEffect(()=>{
    generateRandomFilename()
  },[])

  return (
    <Box display="flex" flexDirection="row" gap={2}>
      <Box display="flex" alignContent="center" flexDirection="row" alignItems="center" gap={1} flexGrow={1}>
        <TextField
          label="Output File Name"
          value={filename}
          onChange={handleFilenameChange}
          fullWidth
          margin="normal"
           variant="standard"
        />
        <Button 
          onClick={generateRandomFilename} 
          variant="contained" 
          color="primary"
        >
          Random
        </Button>
      </Box>
      {/* <TextField
        label="Output Format"
        value={fileFormat}
        onChange={handleFileFormatChange}
        fullWidth
        margin="normal"
      /> */}
    </Box>
  );
};

export default OutputConfig;
