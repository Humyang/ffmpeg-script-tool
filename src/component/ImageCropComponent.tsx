"use client";

import React, { useState, useRef } from "react";
import { Box, Button, Typography, Grid, Paper, TextField } from "@mui/material";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const ImageCropComponent = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [ffmpegCommand, setFfmpegCommand] = useState<string | null>(null);
  const [outputPath, setOutputPath] = useState<string>("res"); // Default output path
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCropChange = (newCrop) => {
    setCrop(newCrop);
  };

  const handleCropComplete = () => {
    if (imageRef.current && crop?.width && crop?.height) {
      const canvas = document.createElement("canvas");
      const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
      const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        imageRef.current,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setCroppedImageUrl(url);
        }
      });

      // Generate FFmpeg command with crop parameters floored and output path
      const adjustedCrop = {
        x: Math.floor(crop.x * scaleX),
        y: Math.floor(crop.y * scaleY),
        width: Math.floor(crop.width * scaleX),
        height: Math.floor(crop.height * scaleY),
      };
      const ffmpegCmd = `for f in *.png; do ffmpeg -i "$f" -vf "crop=${adjustedCrop.width}:${adjustedCrop.height}:${adjustedCrop.x}:${adjustedCrop.y}" "${outputPath}/$\{f%.png}.jpg" -y; done`;
      setFfmpegCommand(ffmpegCmd);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Image Crop Tool
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          {imageSrc ? (
            <ReactCrop
              crop={crop}
              onChange={handleCropChange}
              onComplete={handleCropComplete}
              className="crop-container"
            >
              <img
                ref={imageRef}
                src={imageSrc}
                alt="To be cropped"
                style={{ maxWidth: "100%" }}
              />
            </ReactCrop>
          ) : (
            <Button variant="contained" component="label">
              Upload Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />
            </Button>
          )}
        </Grid>
        <Grid item xs={4}>
          <Paper elevation={3} style={{ padding: "16px" }}>
            <Typography variant="h6">Output Path</Typography>
            <TextField
              fullWidth
              value={outputPath}
              onChange={(e) => setOutputPath(e.target.value)}
              placeholder="Enter output path"
            />
            <Typography variant="h6">Crop Details</Typography>
            <Typography>Aspect: {crop?.aspect}</Typography>
            <Typography>Width: {crop?.width}</Typography>
            <Typography>Height: {crop?.height}</Typography>
            <Typography>X: {crop?.x}</Typography>
            <Typography>Y: {crop?.y}</Typography>
            {croppedImageUrl && (
              <Box mt={2}>
                <Typography variant="h6">Cropped Image Preview</Typography>
                <img
                  src={croppedImageUrl}
                  alt="Cropped"
                  style={{ maxWidth: "100%" }}
                />
              </Box>
            )}
            {ffmpegCommand && (
              <Box mt={2}>
                <Typography variant="h6">FFmpeg Command</Typography>
                <TextField
                  fullWidth
                  multiline
                  value={ffmpegCommand}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ImageCropComponent;
