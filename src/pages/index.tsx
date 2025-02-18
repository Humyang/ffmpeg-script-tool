import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import UploadComponent from "@/component/upload";
import ResultComponent from "@/component/result";
import { Typography, Box, Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import SettingComponent from "@/component/setting";
import { Provider } from "react-redux";
import store from "@/store";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import OutputConfig from "@/component/OutputConfig"; // Adjust the import path as necessary

export default function Home() {
  const script = "echo 'This is a generated script'";

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
      <Box m={4}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" component="h2" gutterBottom>
            Step1:Upload Video（mp4）
            </Typography>
          </Grid>
          <h1></h1>
          <Grid item xs={12}>
            <UploadComponent />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4" component="h2" gutterBottom>
            Step2:Script Setting
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <SettingComponent />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4" component="h2" gutterBottom>
            Step3:Copy Generated Script 
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <OutputConfig />
          </Grid>
          <Grid item xs={12}>
            <ResultComponent script={script} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4" component="h2" gutterBottom>
            Step4:Paste the script into the git bash(or other terminal) and run it
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <img src="/example.gif" alt="Example Output"  />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Provider>
  );
}
