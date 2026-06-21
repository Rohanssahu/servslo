import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  userData: null,
  isLogin: false,
  isLogOut: false,
  accessToken: null,
  refreshToken: null,
  tempToken: null,
};

const AuthSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.isLogin = true;
      state.isLogOut = false;
      state.userData = action.payload.user ?? action.payload;
      state.accessToken = action.payload.accessToken ?? null;
      state.refreshToken = action.payload.refreshToken ?? null;
      state.tempToken = null;
    },
    setTokens(state, action) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    setUser(state, action) {
      state.userData = action.payload;
    },
    setTempToken(state, action) {
      state.tempToken = action.payload;
    },
    logout(state) {
      state.isLogin = false;
      state.userData = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.tempToken = null;
      state.isLogOut = true;
      state.isSuccess = false;
    },
  },
});

export const {loginSuccess, setTokens, setUser, setTempToken, logout} =
  AuthSlice.actions;
export default AuthSlice.reducer;
