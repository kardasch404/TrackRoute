import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Trailer } from './trailersTypes';
import type { RootState } from '../../app/store';

interface TrailersState {
  selectedTrailer: Trailer | null;
  isModalOpen: boolean;
  modalMode: 'create' | 'edit' | 'view';
}

const initialState: TrailersState = {
  selectedTrailer: null,
  isModalOpen: false,
  modalMode: 'create',
};

const trailersSlice = createSlice({
  name: 'trailers',
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{ mode: 'create' | 'edit' | 'view'; trailer?: Trailer }>
    ) => {
      state.isModalOpen = true;
      state.modalMode = action.payload.mode;
      state.selectedTrailer = action.payload.trailer || null;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.selectedTrailer = null;
    },
    setSelectedTrailer: (state, action: PayloadAction<Trailer | null>) => {
      state.selectedTrailer = action.payload;
    },
  },
});

export const { openModal, closeModal, setSelectedTrailer } = trailersSlice.actions;

export const selectSelectedTrailer = (state: RootState) => state.trailers.selectedTrailer;
export const selectIsModalOpen = (state: RootState) => state.trailers.isModalOpen;
export const selectModalMode = (state: RootState) => state.trailers.modalMode;

export default trailersSlice.reducer;
