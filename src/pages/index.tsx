import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import UploadComponent from "@/component/upload";
import ResultComponent from "@/component/result";
import { Typography, Box, Button, Tabs, Tab } from "@mui/material";
import Grid from "@mui/material/Grid";
import SettingComponent from "@/component/setting";
import { Provider } from "react-redux";
import store from "@/store";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import OutputConfig from "@/component/OutputConfig"; // Adjust the import path as necessary
import { useState } from "react";
import SlideshowComponent from "@/component/SlideshowComponent";
import VideoSplitCutConvert from "@/component/VideoSplitCutConvert";
import ImageCropComponent from "@/component/ImageCropComponent"; // Import the new component

export default function Home() {
  const script = "echo 'This is a generated script'";
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Provider store={store}>
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            {/* FFMPEG SCRIPT TOOL */}
            <Button
              color="inherit"
              href="https://ffmpeg.dve2.com"
              target="_blank"
              rel="noopener"
            >
              FFMPEG SCRIPT TOOL
            </Button>
          </Typography>
          <Button
            color="inherit"
            href="https://www.dve2.com/archives/29/fmpeg-video-converter-free-online-video-conversion-tool/"
            target="_blank"
            rel="noopener"
          >
            Document
          </Button>
          <Button
            color="inherit"
            href="https://ffmpeg.org"
            target="_blank"
            rel="noopener"
          >
            DOWNLOAD FFMPEG
          </Button>
          {/* <Button color="inherit">Settings</Button>
          <Button color="inherit">Results</Button> */}
        </Toolbar>
      </AppBar>
      <Box m={1}>
        <Tabs className="mb-4" value={selectedTab} onChange={handleTabChange}>
          <Tab label="Video Split/Cut/Convert" />
          <Tab label="Slideshow" />
          <Tab label="Image Crop" /> {/* Add new tab */}
        </Tabs>
        {selectedTab === 0 && (
          <VideoSplitCutConvert script={script} />
        )}
        {selectedTab === 1 && (
          <SlideshowComponent />
        )}
        {selectedTab === 2 && (
          <ImageCropComponent />
        )} {/* Render new component */}
      </Box>
    </Provider>
  );
}
