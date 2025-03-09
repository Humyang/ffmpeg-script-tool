import React, { useEffect, useState } from "react";
import { Typography, Box, TextField, Button, Grid, IconButton, Checkbox, FormControlLabel, MenuItem, Select } from "@mui/material";
import { Delete, ArrowUpward, ArrowDownward } from "@mui/icons-material";
import ResultComponent from "./result";
import OutputConfig from "./OutputConfig";
import { useSelector } from "react-redux";

const xfadeOptions = [
  "fade", "wipeleft", "wiperight", "wipeup", "wipedown", "slideleft", "slideright", "slideup", "slidedown",
  "circlecrop", "rectcrop", "distance", "fadeblack", "fadewhite", "radial", "smoothleft", "smoothright",
  "smoothup", "smoothdown", "circleopen", "circleclose", "vertopen", "vertclose", "horzopen", "horzclose",
  "dissolve", "pixelize", "diagtl", "diagtr", "diagbl", "diagbr", "hlslice", "hrslice", "vuslice", "vdslice",
  "hblur", "fadegrays", "wipetl", "wipetr", "wipebl", "wipebr", "squeezeh", "squeezev", "zoomin",
  "fadefast", "fadeslow", "hlwind", "hrwind", "vuwind", "vdwind", "coverleft", "coverright", "coverup",
  "coverdown", "revealleft", "revealright", "revealup", "revealdown"
];

const SlideshowConfig = () => {
  const [images, setImages] = useState<{ url: string; duration: number; fade: number; xfade: string; xfadeOptions?: any }[]>([]);
  const [command, setCommand] = useState<string>("");
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [scaleWidth, setScaleWidth] = useState<number>(1280);
  const [scaleHeight, setScaleHeight] = useState<number>(720);
  const [deleteIntermediateFiles, setDeleteIntermediateFiles] = useState<boolean>(true);
  const [applyScale, setApplyScale] = useState<boolean>(true);

  const handleImageChange = (index: number, field: string, value: string | number) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], [field]: value };
    setImages(newImages);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => ({ url: file.name, duration: 1, fade: 0.5, xfade: "fade" }));
      setImages([...images, ...newImages]);
    }
  };

  const addImageField = () => {
    setImages([...images, { url: "", duration: 3, fade: 1, xfade: "fade" }]);
  };

  const removeImageField = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const moveImageField = (index: number, direction: "up" | "down") => {
    const newImages = [...images];
    const [removed] = newImages.splice(index, 1);
    newImages.splice(direction === "up" ? index - 1 : index + 1, 0, removed);
    setImages(newImages);
  };

  const fileDetails = useSelector((state) => state.fileDetails);

  const generateCommand = () => {
    let scaleImages: string[] = [];
    const scaleFilters = applyScale ? images.map((_, index) => {
      let inputName = _.url.replace(/\.[^.]+$/, "");
      let extName = _.url.split(".").pop();
      scaleImages.push(`${inputName}_scale.${extName}`);
      return `ffmpeg -i "${_.url}" -vf "scale=${scaleWidth}:${scaleHeight}:force_original_aspect_ratio=decrease,pad=${scaleWidth}:${scaleHeight}:(ow-iw)/2:(oh-ih)/2" "${inputName}_scale.${extName}" -y;`;
    }).join("") : "";
    const inputs = (applyScale ? scaleImages : images.map(img => img.url)).map((img, index) => `-loop 1 -t ${images[index].duration} -i "${img}"`).join(" ");
    let step = 0;
    let accFadeTime = 0
    let accDuration = 0
    let filters = images.map((_, index) => {
      accDuration+=_.duration
      accFadeTime+=_.fade
      // if (images[index - 1]) {
      //   step += images[index - 1].duration;
      // }
      if(index === images.length - 1){
        return "";
      }
      // xfade=transition=fade:duration=1:offset=3
      // return `[${index==0?0:'f'+(index-1)}][${index+1}]xfade=transition=slideleft:duration=1:offset=4[f${index}];`;
      return `[${index==0?0:'f'+(index-1)}][${index+1}]xfade=transition=${_.xfade}:duration=${_.fade}:offset=${accDuration-accFadeTime}[f${index}]`;
    }).join(";");
    // console.log(filters);
    filters = filters.slice(0, -1);
    // const firstOverlay = `[0][f0]overlay[bg0];`;
    // const middleImages = images.slice(1, images.length - 1);
    // const overlays = middleImages.map((_, index) => 
    //   `[bg${index}][f${index + 1}]overlay[bg${index + 1}];`
    // ).join("");
    // const finalOverlay = `[bg${images.length - 2}][f${images.length - 1}]overlay,format=yuv420p[v]`;
    let str = "";
    if(fileDetails.outputDirectory!==''){
      str = `mkdir -p "${fileDetails.outputDirectory}";`
    }
    const outputFilePath = `${fileDetails.filename}.mp4`
    
    let outName = `${outputFilePath}`;
    if(fileDetails.outputDirectory!==''){
      outName = `${fileDetails.outputDirectory}/${outputFilePath}`;
    }
    const deleteCommands = deleteIntermediateFiles ? scaleImages.map(img => `rm ${img};`).join("") : "";
    // ${firstOverlay} ${overlays} ${finalOverlay}"
    const ffmpegCommand = `${str}${scaleFilters} ffmpeg ${inputs} -filter_complex "${filters}"  -map "[f${images.length-2}]" -r 25 -pix_fmt yuv420p -vcodec libx264 ${outName}  -y;${deleteCommands}`;

    setCommand(ffmpegCommand);
  };

  useEffect(() => {
    if (isMounted) {
      generateCommand();
    } else {
      setIsMounted(true);
    }
  }, [images, fileDetails, scaleWidth, scaleHeight, deleteIntermediateFiles, applyScale]);

  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom>
        Configure Slideshow
      </Typography>
      <Typography variant="body1" gutterBottom>
        1. Upload images using the "Upload Images" button（least two images）.
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button variant="contained" component="label">
            Upload Images
            <input type="file" multiple hidden onChange={handleFileUpload} />
          </Button>
        </Grid>
        {images.length > 1 && (
          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>
              2. Adjust the duration, fade time, and xfade effect for each image.
            </Typography>
          </Grid>
        )}
        {images.map((image, index) => (
          <Grid container item xs={12} spacing={2} key={index}>
            <Grid item xs={2}>
              <TextField
                label={`Image ${index + 1} URL`}
                value={image.url}
                onChange={(e) => handleImageChange(index, "url", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={2}>
              <Select
                label={`Image ${index + 1} Xfade Effect`}
                value={image.xfade}
                onChange={(e) => handleImageChange(index, "xfade", e.target.value as string)}
                fullWidth
              >
                {xfadeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={2}>
              <TextField
                label={`Image ${index + 1} Duration (seconds)`}
                type="number"
                inputProps={{ step: "0.1" }}
                value={image.duration}
                onChange={(e) => handleImageChange(index, "duration", parseFloat(e.target.value))}
                fullWidth
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label={`Image ${index + 1} ${image.xfade} Duration (seconds)`}
                type="number"
                inputProps={{ step: "0.1" }}
                value={image.fade}
                
                onChange={(e) => handleImageChange(index, "fade", parseFloat(e.target.value))}
                fullWidth
              />
            </Grid>
            <Grid item xs={4} container alignItems="center">
              <IconButton onClick={() => moveImageField(index, "up")} disabled={index === 0}>
                <ArrowUpward />
              </IconButton>
              <IconButton onClick={() => moveImageField(index, "down")} disabled={index === images.length - 1}>
                <ArrowDownward />
              </IconButton>
              <IconButton onClick={() => removeImageField(index)}>
                <Delete />
              </IconButton>
            </Grid>
            
            {/* Add more conditional fields for other xfade effects as needed */}
          </Grid>
        ))}
        {images.length > 1 && (
          <>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>
                3. Optionally, set the scale dimensions and choose whether to apply the scale.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={applyScale}
                    onChange={(e) => setApplyScale(e.target.checked)}
                    color="primary"
                  />
                }
                label="Apply Scale"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Scale Width"
                type="number"
                inputProps={{ step: "0.1" }}
                value={scaleWidth}
                onChange={(e) => setScaleWidth(parseFloat(e.target.value))}
                fullWidth
                disabled={!applyScale}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Scale Height"
                type="number"
                inputProps={{ step: "0.1" }}
                value={scaleHeight}
                onChange={(e) => setScaleHeight(parseFloat(e.target.value))}
                fullWidth
                disabled={!applyScale}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>
                4. Optionally, choose whether to delete intermediate files.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={deleteIntermediateFiles}
                    onChange={(e) => setDeleteIntermediateFiles(e.target.checked)}
                    color="primary"
                  />
                }
                label="Delete Intermediate Files"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>
                5. Configure the output settings.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <OutputConfig />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>
                6. Copy the generated FFmpeg command and run it in your terminal.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <ResultComponent script={command} />
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default SlideshowConfig;
