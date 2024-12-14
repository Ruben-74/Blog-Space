import { createSlice } from "@reduxjs/toolkit";

// Initial state de la taille de la fenêtre
const initialState = {
  isMobile: window.innerWidth <= 768, // Si la largeur de l'écran est <= 768px, on considère mobile
};

const viewSlice = createSlice({
  name: "view", // Changeons le nom de "table" à "view" pour mieux refléter son rôle
  initialState,
  reducers: {
    setMobile: (state, action) => {
      state.isMobile = action.payload;
    },
  },
});

export const { setMobile } = viewSlice.actions;

export default viewSlice.reducer;
