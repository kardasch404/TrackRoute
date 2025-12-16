import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Truck } from './trucksTypes';
import type { RootState } from '../../app/store';

interface TrucksState {
  selectedTruck: Truck | null;
  isModalOpen: boolean;
  modalMode: 'create' | 'edit' | 'view';
}

const initialState: TrucksState = {
  selectedTruck: null,
  isModalOpen: false,
  modalMode: 'create',
};

const trucksSlice = createSlice({
  name: 'trucks',
  initialState,
  reducers: {
    setSelectedTruck: (state, action: PayloadAction<Truck | null>) => {
      state.selectedTruck = action.payload;
    },
    openModal: (state, action: PayloadAction<{ mode: 'create' | 'edit' | 'view'; truck?: Truck }>) => {
      state.isModalOpen = true;
      state.modalMode = action.payload.mode;
      state.selectedTruck = action.payload.truck || null;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.selectedTruck = null;
    },
  },
});

export const { setSelectedTruck, openModal, closeModal } = trucksSlice.actions;

export const selectSelectedTruck = (state: RootState) => state.trucks.selectedTruck;
export const selectIsModalOpen = (state: RootState) => state.trucks.isModalOpen;
export const selectModalMode = (state: RootState) => state.trucks.modalMode;

export default trucksSlice.reducer;
