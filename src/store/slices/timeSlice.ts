import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  times: [],
  nowTime: 0, // 添加 nowTime 的初始状态
};

const timeSlice = createSlice({
  name: 'time',
  initialState,
  reducers: {
    addTime: (state, action) => {
      if (!state.times.includes(action.payload)) {
        state.times.push(action.payload);
        state.times.sort((a, b) => a - b);
        if(state.times.length>2){
          state.times = [state.times[0],state.times[state.times.length-1]]
        }
      }
    },
    removeTime: (state, action) => {
      state.times.splice(action.payload, 1);
    },
    setNowTime: (state, action) => {
      state.nowTime = action.payload; // 添加 setNowTime 的 reducer
    },
  },
});

export const { addTime, removeTime, setNowTime } = timeSlice.actions;

export const selectTimes = (state) => state.time.times;
export const selectNowTime = (state) => state.time.nowTime; // 添加 selectNowTime 的 selector

export default timeSlice.reducer;
