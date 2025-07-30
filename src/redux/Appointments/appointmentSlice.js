import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  filters: { q: '', status: 'all', from: null, to: null, tag: 'all' },
};

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    add: {
      prepare: (data) => ({
        payload: {
          id: nanoid(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...data,
        }
      }),
      reducer: (state, action) => { state.items.push(action.payload); }
    },
    update: (state, action) => {
      const i = state.items.findIndex(a => a.id === action.payload.id);
      if (i !== -1) {
        state.items[i] = {
          ...state.items[i],
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    remove: (state, action) => {
      state.items = state.items.filter(a => a.id !== action.payload);
    }
  }
});

export const { add, update, remove } = appointmentSlice.actions;
export default appointmentSlice.reducer;
