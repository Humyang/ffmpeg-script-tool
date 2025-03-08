import React, { useEffect, useState } from "react";
import { Typography, Box, TextField, Button, Grid, IconButton, Checkbox, FormControlLabel } from "@mui/material";
import { Delete, ArrowUpward, ArrowDownward } from "@mui/icons-material";
import ResultComponent from "./result";
import OutputConfig from "./OutputConfig";
import { useSelector } from "react-redux";

const SlideshowConfig = () => {
  const [images, setImages] = useState<{ url: string; duration: number }[]>([]);
  const [command, setCommand] = useState<string>("");
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [scaleWidth, setScaleWidth] = useState<number>(1280);
  const [scaleHeight, setScaleHeight] = useState<number>(720);
  const [deleteIntermediateFiles, setDeleteIntermediateFiles] = useState<boolean>(false);
  const [applyScale, setApplyScale] = useState<boolean>(true);

  const handleImageChange = (index: number, field: string, value: string | number) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], [field]: value };
    setImages(newImages);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => ({ url: file.name, duration: 3 }));
      setImages([...images, ...newImages]);
    }
  };

  const addImageField = () => {
    setImages([...images, { url: "", duration: 3 }]);
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
      return `ffmpeg -i ${_.url} -vf "scale=${scaleWidth}:${scaleHeight}:force_original_aspect_ratio=decrease,pad=${scaleWidth}:${scaleHeight}:(ow-iw)/2:(oh-ih)/2" ${inputName}_scale.${extName} -y;`;
    }).join("") : "";
    const inputs = (applyScale ? scaleImages : images.map(img => img.url)).map((img, index) => `-loop 1 -t ${images[index].duration} -i ${img}`).join(" ");
    let step = 0;
    const filters = images.map((_, index) => {
      if (images[index - 1]) {
        step += images[index - 1].duration;
      }
      return `[${index}]fade=d=1:t=in:alpha=1,setpts=PTS-STARTPTS+${index === 0 ? 0 : step}/TB[f${index}];`;
    }).join(" ");
    const firstOverlay = `[0][f0]overlay[bg0];`;
    const middleImages = images.slice(1, images.length - 1);
    const overlays = middleImages.map((_, index) => 
      `[bg${index}][f${index + 1}]overlay[bg${index + 1}];`
    ).join("");
    const finalOverlay = `[bg${images.length - 2}][f${images.length - 1}]overlay,format=yuv420p[v]`;
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
    const ffmpegCommand = `${str}${scaleFilters} ffmpeg ${inputs} -filter_complex "${filters} ${firstOverlay} ${overlays} ${finalOverlay}" -map "[v]" -r 25 ${outName} -y;${deleteCommands}`;

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
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button variant="contained" component="label">
            Upload Images
            <input type="file" multiple hidden onChange={handleFileUpload} />
          </Button>
        </Grid>
        {images.map((image, index) => (
          <Grid container item xs={12} spacing={2} key={index}>
            <Grid item xs={4}>
              <TextField
                label={`Image ${index + 1} URL`}
                value={image.url}
                onChange={(e) => handleImageChange(index, "url", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label={`Image ${index + 1} Duration (seconds)`}
                type="number"
                value={image.duration}
                onChange={(e) => handleImageChange(index, "duration", parseInt(e.target.value))}
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
          </Grid>
        ))}
        {images.length > 1 && (
          <>
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
                value={scaleWidth}
                onChange={(e) => setScaleWidth(parseInt(e.target.value))}
                fullWidth
                disabled={!applyScale}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Scale Height"
                type="number"
                value={scaleHeight}
                onChange={(e) => setScaleHeight(parseInt(e.target.value))}
                fullWidth
                disabled={!applyScale}
              />
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
              <OutputConfig />
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
