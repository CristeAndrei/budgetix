import { createSlice } from '@reduxjs/toolkit';
import { ROOT_FLUX } from '../hooks/useFlux';

const fluxesSlice = createSlice({
  name: 'fluxes',
  initialState: {
    flux: ROOT_FLUX,
    childFluxes: [],
    childLines: [],
    isGettingData: false,
    databaseError: false,
    uploadingFiles: [],
  },
  reducers: {
    selectFlux: (state, action) => {
      state.fluxId = action.payload.fluxId;
      state.childLines = [];
      state.childFluxes = [];
    },
    updateFluxRoot: (state, action) => {
      state.flux = action.payload.ROOT_FLUX;
    },
    UpdateFlux: (state, action) => {
      state.flux = action.payload.doc;
    },
    UpdateChildFluxes: (state, action) => {
      state.childFluxes = action.payload.docs;
    },
    UpdateChildLines: (state, action) => {
      state.childLines = action.payload.docs;
    },
    addUploadingFiles: (state, action) => {
      state.uploadingFiles = [...state.uploadingFiles, action.payload];
    },
    updateProgressUploadingFiles: (state, action) => {
      state.uploadingFiles = state.uploadingFiles.map((file) => {
        if (file.id === action.payload.id)
          return { ...file, progress: action.payload.progress };
        return file;
      });
    },
    removeUploadingFiles: (state, action) => {
      state.uploadingFiles =
        [] ||
        state.uploadingFiles.map(
          (file) => file.id !== action.payload.id && file
        );
    },
    setErrorUploadingFiles: (state, action) => {
      state.uploadingFiles = state.uploadingFiles.map((file) => {
        if (file.id === action.payload.id) return { ...file, error: true };
        return file;
      });
    },
  },
  extraReducers: {},
});

export const {
  selectFlux,
  updateFluxRoot,
  UpdateChildFluxes,
  UpdateChildLines,
  UpdateFlux,
  updateProgressUploadingFiles,
  addUploadingFiles,
  setErrorUploadingFiles,
  removeUploadingFiles,
} = fluxesSlice.actions;

export default fluxesSlice.reducer;
