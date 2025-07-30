import { configureStore } from '@reduxjs/toolkit';
import appointments from './Appointments/appointmentSlice';

const load = () => {
  try {
    const s = JSON.parse(localStorage.getItem('app_state')) || undefined;
    if (s?.appointments?.items) {
      const now = Date.now();
      s.appointments.items = s.appointments.items.map((a, idx) => {
        const hasCreated = !!a.createdAt;
        const createdAt = a.createdAt
          || new Date(now - (s.appointments.items.length - idx) * 1000).toISOString();
        const updatedAt = a.updatedAt || createdAt;

        return { ...a, createdAt, updatedAt };
      });
    }
    return s;
  } catch {
    return undefined;
  }
};

const save = (state) => {
  try { localStorage.setItem('app_state', JSON.stringify(state)); } catch {}
};
const persistence = store => next => action => {
  const result = next(action);
  save({ appointments: store.getState().appointments });
  return result;
};

export const store = configureStore({
  reducer: { appointments },
  preloadedState: load(),
  middleware: (gDM) => gDM().concat(persistence),
});
