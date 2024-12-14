import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: "",
  email: "",
  password: "",
  avatar: "user.png",
  isLogged: false,
  msg: "",
  role: "user",
  is_active: 1,
  authError: null,
  userId: null, // Ajout de userId
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      if (action.payload.user.is_active === 0) {
        state.authError = "Votre compte est désactivé.";
        state.isLogged = false; // Mettre à false si l'utilisateur n'est pas actif
        return; // Arrête l'exécution de la fonction
      }
      console.log("Payload de connexion :", action.payload);
      state.username = action.payload.user.username; // Ensure this path is correct
      state.email = action.payload.user.email;
      state.isLogged = action.payload.isLogged;
      state.avatar = action.payload.user.avatar || "user.png";
      state.role = action.payload.user.role || "user";
      state.userId =
        action.payload.user.id || action.payload.user.userId || "user"; // Vérifie bien ici
      console.log("Payload de connexion :", state.userId);
      state.authError = null;
    },
    loginFailed(state, action) {
      state.authError = action.payload.error;
      state.isLogged = false; // Mettre à false si la connexion échoue
    },
    logout(state) {
      // Réinitialisation de l'état lors de la déconnexion
      Object.assign(state, initialState); // Réinitialiser tout l'état
    },
    setMsg(state, action) {
      state.msg = action.payload;
    },
    setAvatar(state, action) {
      state.avatar = action.payload;
    },
    updateField(state, action) {
      state.email = action.payload.email;
      state.password = action.payload.password;
      state.username = action.payload.username || state.username;
    },
  },
});

// Exportation des actions et du réducteur
export const { login, loginFailed, logout, setMsg, setAvatar, updateField } =
  userSlice.actions;
export default userSlice.reducer;
