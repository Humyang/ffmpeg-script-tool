import React from "react";
import { Typography, Grid, Box } from "@mui/material";
import UploadComponent from "@/component/upload";
import SettingComponent from "@/component/setting";
import OutputConfig from "@/component/OutputConfig";
import ResultComponent from "@/component/result";

const VideoSplitCutConvert = ({ script }: { script: string }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" component="h2" gutterBottom>
          Step1: Upload Video (mp4)
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <UploadComponent />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h4" component="h2" gutterBottom>
          Step2: Script Setting
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <SettingComponent />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h4" component="h2" gutterBottom>
          Step3: Copy Generated Script
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
          Step4: Paste the script into the git bash (or other terminal) and run it
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="center" alignItems="center">
          <img src="/example.gif" alt="Example Output" />
        </Box>
      </Grid>
    </Grid>
  );
};

export default VideoSplitCutConvert;
