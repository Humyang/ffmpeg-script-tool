import React, { useEffect, useState } from "react";
import { Typography, Grid, Box } from "@mui/material";
import UploadComponent from "@/component/upload";
import SettingComponent from "@/component/setting";
import OutputConfig from "@/component/OutputConfig";
import ResultComponent from "@/component/result";
import { useSelector } from "react-redux";

const VideoSplitCutConvert = () => {

  const crop = useSelector((state) => state.crop.crop);
  const time = useSelector((state) => state.time.times);
  const gif = useSelector((state) => state.gif);
  const fileDetails = useSelector((state) => state.fileDetails);
  const file = useSelector((state) => state.file);
  const [script, setScript] = useState("");

  useEffect(() => {
    console.log("crop,time,gif,outName,file", crop, time, gif, fileDetails, file);
    // 根据time生成ffmpeg 分隔视频脚本
    let outNameArr = [];
    let inputName = file.fileName.replace(/\.[^.]+$/, "");
    let extName = file.fileName.split(".").pop();
    let script = "";
    if (time.length > 1) {
      // const inputFilePath = file.path;
      const outputFilePath =
        file.fileName.replace(/\.[^.]+$/, "") + "_" + fileDetails.filename;
      // 根据time生成ffmpeg分隔视频脚本，第一个是开始，第二个是结束以此类推
      let str = "";
      if(fileDetails.outputDirectory!==''){
        str = `mkdir -p "${fileDetails.outputDirectory}";`
      }
      let index = 0;
      const ffmpegCommands = time.reduce((a, b) => {
        index++;
        let outName = `${outputFilePath}_split`;
        if(fileDetails.outputDirectory!==''){
          outName = `${fileDetails.outputDirectory}/${outputFilePath}_split`;
        }
        str += `ffmpeg -i "${inputName}.${extName}" -ss ${a} -to ${b} "${outName}.${extName}" -y;`;
        // outNameArr.push(outName)
        inputName = outName;
        // if(index>0){
        //   str+=';'
        // }
        return b;
      });
      script += str;
    }
    let cropVF = "";
    let cropScript = "";
    // let rate = ;
    // window.video1.clientWidth / window.video1.videoWidth
    let myvideo = document.querySelector('.myvideo')
    // let myvideo = undefined
    // if(myvideoAll[0].clientWidth!=0){
    //   myvideo = myvideoAll[0]
    // }
    // if(myvideoAll[1].clientWidth!=0){
    //   myvideo = myvideoAll[1]

    // }
    let rate = 1
    if(myvideo){

      rate = myvideo.clientWidth / myvideo.videoWidth
    }
    if (crop) {
      cropVF = `crop=${(crop.width / rate).toFixed(2)}:${(crop.height / rate).toFixed(2)}:${
        (crop.x / rate).toFixed(2)
      }:${(crop.y / rate).toFixed(2)}`;
      cropVF = "-vf " + cropVF;
      let outName = `${inputName}_crop`;
      cropScript =
        `ffmpeg -i "${inputName}.${extName}" ` +
        cropVF +
        ` "${outName}.${extName}" -y;`;
      inputName = outName;
      script += cropScript;
    }
    if (gif.enabled) {
      let paletteuse = "";
      if (gif.palettegenEnabled) {
        paletteuse = ",split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse";
      }
      let gifVf = `-vf "scale='min(${gif.scale},if(mod(iw,2),iw-1,iw))':-2${paletteuse}" -r ${gif.fps}`;

      let outName = `${inputName}_gif.gif`;
      let gifScript =
        `ffmpeg -i "${inputName}.${extName}" ` + gifVf + ` "${outName}" -y;`;
      // gifName = `${inputName}_gif.gif`
      inputName = inputName + "_gif";
      script += gifScript;
    }
    // console.log('ffmpegCommands',ffmpegCommands)
    setScript(script);
    // if(outNameArr.length>0){

    //   outNameArr.forEach(v=>{
    //     let inputName = v
    //     let extName = 'mp4'
    //     let cropScript = ``;
    //     cropScript =   `ffmpeg -i ${inputName}.${extName} ` + cropVF + ` ${inputName}_crop.${extName} -y;`;
    //     let cropName = `${inputName}_crop.${extName}`
    //     inputName = inputName + "_crop";
    //   })
    // }
  }, [crop, time, gif, fileDetails, file]);
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        
        <Typography variant="body1" gutterBottom>
          1. Upload a video file using the "Upload Video" button.
        </Typography>
        
      </Grid>
      
      <Grid item xs={12}>
        <UploadComponent />
      </Grid>
    {
      file.fileName!=""?(
        <>
        <Grid item xs={12}>
        
        <Typography variant="body1" gutterBottom>
            2. Adjust the settings for splitting, cutting, or converting the video.
          </Typography>
          
        </Grid>
        <Grid item xs={12}>
          <SettingComponent />
        </Grid>
        <Grid item xs={12}>
          
        <Typography variant="body1" gutterBottom>
            3. Configure the output settings.
          </Typography>
          
        </Grid>
        <Grid item xs={12}>
          <OutputConfig />
        </Grid>
        <Grid item xs={12}>
          <ResultComponent script={script} />
        </Grid>
        <Grid item xs={12}>
          
        <Typography variant="body1" gutterBottom>
            4. Copy the generated FFmpeg command and run it in your terminal.
          </Typography>
          
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center" alignItems="center">
            <img src="/example.gif" alt="Example Output" />
          </Box>
        </Grid>
        </>
      ):null
    }
    </Grid>
  );
};

export default VideoSplitCutConvert;
