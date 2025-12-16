import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Trip, TripFilters } from './tripsTypes';

interface TripsState {
  trips: Trip[];
  selectedTrip: Trip | null;
  filters: TripFilters;
  isModalOpen: boolean;
  modalMode: 'create' | 'edit' | 'view' | 'assign';
}

const initialState: TripsState = {
  trips: [],
  selectedTrip: null,
  filters: {
    status: '',
    search: '',
  },
  isModalOpen: false,
  modalMode: 'create',
};

const tripsSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    setTrips: (state, action: PayloadAction<Trip[]>) => {
      state.trips = action.payload;
    },
    setSelectedTrip: (state, action: PayloadAction<Trip | null>) => {
      state.selectedTrip = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<TripFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { status: '', search: '' };
    },
    openModal: (state, action: PayloadAction<{ mode: TripsState['modalMode']; trip?: Trip }>) => {
      state.isModalOpen = true;
      state.modalMode = action.payload.mode;
      state.selectedTrip = action.payload.trip || null;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.selectedTrip = null;
    },
  },
});

export const {
  setTrips,
  setSelectedTrip,
  setFilters,
  clearFilters,
  openModal,
  closeModal,
} = tripsSlice.actions;

export default tripsSlice.reducer;
