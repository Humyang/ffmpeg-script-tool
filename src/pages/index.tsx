import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import UploadComponent from '@/component/upload';
import ResultComponent from '@/component/result';
import {
  Typography,
  Box,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import SettingComponent from "@/component/setting";
import { Provider } from 'react-redux';
import store from '@/store';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import OutputConfig from '@/component/OutputConfig'; // Adjust the import path as necessary

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
            FFMPEG CONFIG SCRIPT
          </Typography>
          <Button color="inherit" href="https://ffmpeg.org" target="_blank" rel="noopener">
            DOWNLOAD FFMPEG
          </Button>
          {/* <Button color="inherit">Settings</Button>
          <Button color="inherit">Results</Button> */}
        </Toolbar>
      </AppBar>
      <Box m={4}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <UploadComponent />
          </Grid>
          <Grid item xs={12}>
            <SettingComponent />
          </Grid>
          <Grid item xs={12}>
            <OutputConfig />
          </Grid>
          <Grid item xs={12}>
            <ResultComponent script={script} />
          </Grid>
        </Grid>
      </Box>
    </Provider>
  );
}
