import { combineReducers } from '@reduxjs/toolkit';
import exampleReducer from './slices/exampleSlice';
import fileReducer from './slices/fileSlice';
import cropReducer from './slices/cropSlice';
import timeReducer from './slices/timeSlice';
import fileDetailsReducer from './slices/fileDetailsSlice';
import gifReducer from './slices/gifSlice';

const rootReducer = combineReducers({
  example: exampleReducer,
  file: fileReducer,
  crop: cropReducer,
  time: timeReducer,
  fileDetails: fileDetailsReducer,
  gif: gifReducer,
});

export default rootReducer;
