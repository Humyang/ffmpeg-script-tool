import React, { useEffect, useState } from "react";
import { Typography, Box, TextField, Button, Grid, IconButton } from "@mui/material";
import { Delete, ArrowUpward, ArrowDownward } from "@mui/icons-material";
import ResultComponent from "./result";
import OutputConfig from "./OutputConfig";
import { useSelector } from "react-redux";

const SlideshowConfig = () => {
  const [images, setImages] = useState<{ url: string; duration: number }[]>([]);
  const [command, setCommand] = useState<string>("");
  const [isMounted, setIsMounted] = useState<boolean>(false);

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
    const scaleFilters = images.map((_, index) => {
      let inputName = _.url.replace(/\.[^.]+$/, "");
      let extName = _.url.split(".").pop();
      scaleImages.push(`${inputName}_scale.${extName}`);
      return `ffmpeg -i ${_.url} -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" ${inputName}_scale.${extName} -y;`;
    }).join("");
    const inputs = scaleImages.map((img, index) => `-loop 1 -t ${images[index].duration} -i ${img}`).join(" ");
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
    const ffmpegCommand = `${str}${scaleFilters} ffmpeg ${inputs} -filter_complex "${filters} ${firstOverlay} ${overlays} ${finalOverlay}" -map "[v]" -r 25 ${outName} -y`;

    setCommand(ffmpegCommand);
  };

  useEffect(() => {
    if (isMounted) {
      generateCommand();
    } else {
      setIsMounted(true);
    }
  }, [images,fileDetails]);

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
