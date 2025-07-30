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
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  }
});

export const { add, update, remove, setFilters } = appointmentSlice.actions;
export default appointmentSlice.reducer;

export const selectFiltered = (state) => {
  const { q, status, from, to, tag } = state.appointments.filters;
  return state.appointments.items
    .filter(a => {
      const hay = `${a.title} ${a.description || ''} ${a.location || ''} ${(a.tags||[]).join(' ')}`.toLowerCase();
      const hit = q ? hay.includes(q.toLowerCase()) : true;
      const statusOk = status === 'all' ? true : a.status === status;
      const tagsOk = tag === 'all' ? true : (a.tags || []).includes(tag);
      const d = parseISO(a.date);
      const fromOk = from ? !isBefore(d, parseISO(from)) : true;
      const toOk = to ? !isAfter(d, parseISO(to)) : true;
      return hit && statusOk && tagsOk && fromOk && toOk;
    })
    .sort((x,y) => (x.date + x.startTime).localeCompare(y.date + y.startTime));
};
