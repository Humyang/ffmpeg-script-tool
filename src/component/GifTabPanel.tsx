import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  setGifConfig,
  selectGifConfig,
  setGifEnabled,
  selectGifEnabled,
  setPalettegenEnabled,
  selectPalettegenEnabled,
} from "@/store/slices/gifSlice"; // Adjust the import path as necessary

const GifTabPanel = () => {
  const dispatch = useDispatch();
  const gifConfig = useSelector(selectGifConfig);
  const gifEnabled = useSelector(selectGifEnabled);
  const palettegenEnabled = useSelector(selectPalettegenEnabled);
  const [fps, setFps] = useState(gifConfig.fps);
  const [scale, setScale] = useState(gifConfig.scale);
  const [quality, setQuality] = useState(gifConfig.quality);

  useEffect(() => {
    switch (quality) {
      // case "custom":
      //   break;
      case "low":
        setFps(5);
        setScale(160);
        break;
      case "medium":
        setFps(10);
        setScale(320);
        break;
      case "high":
        setFps(15);
        setScale(480);
        break;
      default:
        break;
    }
  }, [quality]);

  useEffect(() => {
    dispatch(setGifConfig({ fps, scale, quality }));
  }, [fps, scale, quality]);

  const handleQualityChange = (event) => {
    setQuality(event.target.value);
  };

  const handleGifEnabledChange = (event) => {
    dispatch(setGifEnabled(event.target.checked));
  };

  const handlePalettegenEnabledChange = (event) => {
    dispatch(setPalettegenEnabled(event.target.checked));
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <FormControlLabel
        control={
          <Switch checked={gifEnabled} onChange={handleGifEnabledChange} />
        }
        label="Enable GIF Settings"
      />
      {gifEnabled && (
        <>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="FPS"
                type="number"
                value={fps}
                onChange={(e) => setFps(Number(e.target.value))}
                fullWidth
                margin="dense"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Scale (width)"
                type="number"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                fullWidth
                margin="dense"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Quality</InputLabel>
                <Select
                  value={quality}
                  onChange={handleQualityChange}
                  label="Quality"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  {/* <MenuItem value="custom">Custom</MenuItem> */}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={palettegenEnabled}
                    onChange={handlePalettegenEnabledChange}
                  />
                }
                label="Enable Palettegen"
              />
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default GifTabPanel;
