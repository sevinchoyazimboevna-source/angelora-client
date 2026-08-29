import { createSlice, createSelector } from "@reduxjs/toolkit";
import { loadState } from "@/lib/storage";

const initialState = {
  info: loadState("profile", {
    firstName: "",
    phone: "",
  }),
  settings: loadState("profileSettings", {
    newsletter: true,
    orderUpdates: true,
    twoFactor: false,
  }),
};

const slice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    updateProfile(state, action) {
      state.info = { ...state.info, ...action.payload };
    },
    updateSettings(state, action) {
      state.settings = { ...state.settings, ...action.payload };
    },
    hydrateProfile(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateProfile, updateSettings, hydrateProfile } = slice.actions;
export default slice.reducer;

export const selectProfile = (state) => state.profile.info;
export const selectProfileSettings = (state) => state.profile.settings;
export const selectFullName = createSelector([selectProfile], (info) =>
  [info.firstName, info.lastName].filter(Boolean).join(" ") || "Your Account"
);