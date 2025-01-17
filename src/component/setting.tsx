"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Grid,
  Paper,
  Slider,
  IconButton,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { useSelector, useDispatch } from "react-redux";
import { selectFilePath } from "@/store/slices/fileSlice"; // Adjust the import path as necessary
import { setCropData } from "@/store/slices/cropSlice"; // Adjust the import path as necessary
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop, { Crop } from "react-image-crop";
import {
  addTime,
  removeTime,
  selectTimes,
  setNowTime,
  selectNowTime,
} from "@/store/slices/timeSlice"; // Adjust the import path as necessary
import GifTabPanel from "./GifTabPanel";

const CustomVideoControls = ({ videoRef, onTimeUpdate }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (videoRef && videoRef.current) {
      // 添加处理handleLoadedMetadata和handleTimeUpdate处理事件
      const handleLoadedMetadata = () => {
        setDuration(videoRef.current.duration);
      };

      const handleTimeUpdate = () => {
        if (videoRef.current) {
          setCurrentTime(videoRef.current.currentTime);
        }
      };

      videoRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
      videoRef.current.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener(
            "loadedmetadata",
            handleLoadedMetadata
          );
          videoRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        }
      };
      // handleLoadedMetadata
      // handleTimeUpdate
    }
  }, []);

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSliderChange = (event, newValue) => {
    videoRef.current.currentTime = newValue;
    setCurrentTime(newValue);
    if (onTimeUpdate) {
      onTimeUpdate(newValue);
    }
  };

  const handleSkip = (seconds) => {
    const newTime = Math.min(Math.max(currentTime + seconds, 0), duration);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    if (onTimeUpdate) {
      onTimeUpdate(newTime);
    }
  };

  return (
    <Box display="flex flex-col" alignItems="center" gap={2} width="100%">
      <Box className="w-full">
        <Typography>
          {new Date(currentTime * 1000).toISOString().substr(11, 8)} /{" "}
          {new Date(duration * 1000).toISOString().substr(11, 8)}
        </Typography>
      </Box>
      <Box className="flex w-full items-center">
        <IconButton onClick={handlePlayPause}>
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
        <IconButton onClick={() => handleSkip(-5)}>
          <Typography>-5s</Typography>
        </IconButton>
        <IconButton onClick={() => handleSkip(-1)}>
          <Typography>-1s</Typography>
        </IconButton>
        <IconButton onClick={() => handleSkip(-0.5)}>
          <Typography>-0.5s</Typography>
        </IconButton>
        <IconButton onClick={() => handleSkip(-0.1)}>
          <Typography>-0.1s</Typography>
        </IconButton>
        <Slider
          value={currentTime}
          max={duration}
          onChange={handleSliderChange}
          style={{ flexGrow: 1 }}
        />
        <IconButton onClick={() => handleSkip(0.1)}>
          <Typography>+0.1s</Typography>
        </IconButton>
        <IconButton onClick={() => handleSkip(0.5)}>
          <Typography>+0.5s</Typography>
        </IconButton>
        <IconButton onClick={() => handleSkip(1)}>
          <Typography>+1s</Typography>
        </IconButton>
        <IconButton onClick={() => handleSkip(5)}>
          <Typography>+5s</Typography>
        </IconButton>
      </Box>
    </Box>
  );
};

const a11yProps = (index) => {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
};

const SettingComponent = () => {
  const [value, setValue] = useState(0);
  const videoSrc = useSelector(selectFilePath);
  const nowTime = useSelector(selectNowTime); // 从 Redux 中读取 nowTime
  const [crop, setCrop] = useState<Crop | null>(null);
  const dispatch = useDispatch();
  const cropTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef(null);
  const splitVideoRef = useRef(null);
  const savedTimes = useSelector(selectTimes);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    // setTimeout(() => {

    //   if (value === 0 || value === 1) {
    //     splitVideoRef.current.currentTime = nowTime; // 使用 Redux 中的 nowTime
    //   }
    // }, 3000);
  };

  const handleCropChange = (newCrop) => {
    setCrop(newCrop);
    if (cropTimeoutRef.current) {
      clearTimeout(cropTimeoutRef.current);
    }
    cropTimeoutRef.current = setTimeout(() => {
      dispatch(setCropData(newCrop));
    }, 300); // Adjust the delay as necessary
  };

  const handleTimeUpdate = (newTime) => {
    dispatch(setNowTime(newTime)); // 更新 Redux 中的 nowTime
  };

  useEffect(() => {
    return () => {
      if (cropTimeoutRef.current) {
        clearTimeout(cropTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Box>
      <Tabs value={value} onChange={handleChange} aria-label="settings tabs">
        <Tab label="Split" {...a11yProps(0)} />
        <Tab label="Crop" {...a11yProps(1)} />
        <Tab label="Gif" {...a11yProps(2)} />
      </Tabs>
      {
        <Box p={3}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <ReactCrop
                disabled={value !== 1}
                crop={crop}
                onChange={handleCropChange}
              >
                <video
                  className="myvideo"
                  ref={splitVideoRef}
                  src={videoSrc}
                  controls={false}
                  onLoadedData={() => {
                    splitVideoRef.current.currentTime = nowTime;
                    // console.log('',)
                  }}
                />
              </ReactCrop>
              <CustomVideoControls
                videoRef={splitVideoRef}
                onTimeUpdate={handleTimeUpdate}
              />
              {value != 0 ? null : (
                <Button
                  onClick={() =>
                    dispatch(addTime(splitVideoRef.current.currentTime))
                  }
                >
                  Save Time
                </Button>
              )}
            </Grid>
            {value === 0 && (
              <Grid item xs={4}>
                <Paper elevation={3} style={{ padding: "16px" }}>
                  <Typography variant="h6">Saved Times</Typography>
                  <Box>
                    {savedTimes.map((time, idx) => (
                      <Box key={idx} display="flex" alignItems="center" gap={1}>
                        <Typography>
                          {new Date(time * 1000).toISOString().substr(11, 8)}
                        </Typography>
                        <Button
                          onClick={() =>
                            (splitVideoRef.current.currentTime = time)
                          }
                        >
                          <Typography>Jump</Typography>
                        </Button>
                        <Button onClick={() => dispatch(removeTime(idx))}>
                          <Typography>Delete</Typography>
                        </Button>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Grid>
            )}
            {value === 1 && (
              <Grid item xs={4}>
                <Paper elevation={3} style={{ padding: "16px" }}>
                  <Typography variant="h6">Crop Details</Typography>
                  <Typography>Aspect: {crop?.aspect}</Typography>
                  <Typography>Width: {crop?.width}</Typography>
                  <Typography>Height: {crop?.height}</Typography>
                  <Typography>X: {crop?.x}</Typography>
                  <Typography>Y: {crop?.y}</Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Box>
      }
      {value === 2 && (
        <Box p={3}>
          <GifTabPanel />
        </Box>
      )}
    </Box>
  );
};

export default SettingComponent;
