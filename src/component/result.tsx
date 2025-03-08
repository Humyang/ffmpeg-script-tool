"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Typography, TextField, Button } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const ResultComponent = ({ script }: { script: string }) => {
  

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
  };

  return (
    <Box>
      <Typography variant="h6">Generated Script</Typography>
      <TextField
        multiline
        fullWidth
        rows={10}
        value={script}
        variant="outlined"
        InputProps={{
          readOnly: true,
        }}
      />
      <Button
        variant="contained"
        startIcon={<ContentCopyIcon />}
        onClick={handleCopy}
        sx={{ mt: 2 }}
      >
        Copy to Clipboard
      </Button>
    </Box>
  );
};

export default ResultComponent;
