import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { auth, database, EmailAuthProvider } from "../firebase";

export const loginGoogle = createAsyncThunk(
  "user/loginGoogle",
  async ({ provider }) => {
    try {
      const promise = await auth.signInWithPopup(provider);

      if (promise.additionalUserInfo.isNewUser === true) {
        await promise.user.updateProfile({
          displayName: promise.user.email,
        });
        await database.users.doc(promise.user.uid).set({
          userName: promise.user.email,
          mail: promise.user.email,
        });
      }

      return {
        uid: promise.user.uid,
        email: promise.user.email,
        userName: promise.user.email,
      };
    } catch (error) {
      console.log(error);
    }
  }
);

export const loginEmail = createAsyncThunk(
  "user/loginEmail",
  async ({ email, password }) => {
    const promise = await auth.signInWithEmailAndPassword(email, password);
    return {
      uid: promise.user.uid,
      email: promise.user.email,
      userName: promise.user.displayName,
    };
  }
);

export const signUpEmail = createAsyncThunk(
  "user/signUpEmail",
  async ({ email, password, name }) => {
    const promise = await auth.createUserWithEmailAndPassword(email, password);

    await promise.user.updateProfile({
      displayName: name,
    });

    await database.users.doc(promise.user.uid).set({
      userName: name,
      mail: promise.user.email,
    });

    return {
      uid: promise.user.uid,
      email: promise.user.email,
      userName: promise.user.email,
      accountType: "password",
    };
  }
);

export const updateUsername = createAsyncThunk(
  "user/updateUsername",
  async ({ uid, name }) => {
    await auth.currentUser.updateProfile({
      displayName: name,
    });

    await database.users.doc(uid).update({ userName: name });
    return {
      userName: name,
    };
  }
);

export const updateEmail = createAsyncThunk(
  "user/updateEmail",
  async ({ newEmail, email, currentPassword }) => {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(email, currentPassword);
    await user.reauthenticateWithCredential(credential);
    await user.updateEmail(newEmail);
    return {
      email: newEmail,
    };
  }
);

export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async ({ newPassword, email, currentPassword }) => {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(email, currentPassword);
    await user.reauthenticateWithCredential(credential);
    await user.updatePassword(newPassword);
  }
);

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ email }) => {
    await auth.sendPasswordResetEmail(email);
  }
);

export const signOut = createAsyncThunk("user/signOut", async () => {
  await auth.signOut();
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    isAuthenticated: false,
    isSigningUp: false,
    isLoggingIn: false,
    isSigningOut: false,
    updatingProfile: false,
    resettingPassword: false,
    loginError: false,
    signOutError: false,
    signUpError: false,
    resetPasswordError: false,
    updateError: false,
    signUpRedirect: false,
    resetPasswordRedirect: false,
    data: {
      uid: null,
      email: null,
      userName: null,
      accountType: null,
      deviceFCMToken: null,
    },
  },
  reducers: {
    setUser: (state, action) => {
      state.isAuthenticated = true;
      state.data = action.payload;
    },
    setResetPasswordRedirect: (state) => {
      state.resetPasswordRedirect = false;
    },
    setSignUpError: (state, action) => {
      state.signUpError = action.payload.text;
    },
    setLoginError: (state, action) => {
      state.loginError = action.payload.text;
    },
    setUpdateError: (state, action) => {
      state.updateError = action.payload.text;
    },
    setForgotPasswordError: (state, action) => {
      state.resetPasswordError = action.payload.text;
    },
    setDeviceFCMToken: (state, action) => {
      state.deviceFCMToken = action.payload.token;
    },
  },
  extraReducers: {
    [loginGoogle.pending]: (state) => {
      state.signUpRedirect = false;
      state.isLoggingIn = true;
      state.loginError = false;
    },
    [loginGoogle.fulfilled]: (state, action) => {
      state.isLoggingIn = false;
      state.isAuthenticated = true;
      state.data = {
        uid: action.payload.uid,
        email: action.payload.email,
        userName: action.payload.userName,
        accountType: "google.com",
      };
    },
    [loginGoogle.rejected]: (state, action) => {
      state.loginError = action.error.message;
      state.isLoggingIn = false;
    },
    [signUpEmail.pending]: (state) => {
      state.signUpRedirect = false;
      state.isSigningUp = true;
    },
    [signUpEmail.fulfilled]: (state, action) => {
      state.isSigningUp = false;
      state.isAuthenticated = true;
      state.signUpRedirect = true;
      state.data = {
        uid: action.payload.uid,
        email: action.payload.email,
        userName: action.payload.userName,
        accountType: "password",
      };
    },
    [signUpEmail.rejected]: (state, action) => {
      state.signUpError = action.error.message;
      state.isSigningUp = false;
    },
    [loginEmail.pending]: (state) => {
      state.signUpRedirect = false;
      state.isLoggingIn = true;
      state.loginError = false;
    },
    [loginEmail.fulfilled]: (state, action) => {
      state.isLoggingIn = false;
      state.isAuthenticated = true;
      state.data = {
        uid: action.payload.uid,
        email: action.payload.email,
        userName: action.payload.userName,
        accountType: "password",
      };
    },
    [loginEmail.rejected]: (state, action) => {
      state.loginError = action.error.message;
      state.isLoggingIn = false;
    },
    [signOut.pending]: (state) => {
      state.isSigningOut = true;
      state.signUpRedirect = false;
    },
    [signOut.fulfilled]: (state) => {
      state.isSigningOut = false;
      state.isAuthenticated = false;
      state.deviceFCMToken = null;
      state.data = {
        uid: null,
        email: null,
        userName: null,
        accountType: null,
      };
    },
    [signOut.rejected]: (state, action) => {
      state.signOutError = action.error.message;
      state.isSigningOut = false;
    },
    [updateUsername.pending]: (state) => {
      state.updatingProfile = true;
    },
    [updateUsername.fulfilled]: (state, action) => {
      state.updatingProfile = false;
      state.data.userName = action.payload.userName;
    },
    [updateUsername.rejected]: (state, action) => {
      state.updatingProfile = false;
      state.updateError = action.error.message;
    },
    [updateEmail.pending]: (state) => {
      state.updatingProfile = true;
    },
    [updateEmail.fulfilled]: (state, action) => {
      state.updatingProfile = false;
      state.data.email = action.payload.email;
      console.log(action.payload);
      console.log("asd");
    },
    [updateEmail.rejected]: (state, action) => {
      state.updatingProfile = false;
      state.updateError = action.error.message;
    },
    [updatePassword.pending]: (state) => {
      state.updatingProfile = true;
    },
    [updatePassword.fulfilled]: (state) => {
      state.updatingProfile = false;
    },
    [updatePassword.rejected]: (state, action) => {
      state.updatingProfile = false;
      state.updateError = action.error.message;
    },
    [resetPassword.pending]: (state) => {
      state.resettingPassword = true;
      state.resetPasswordRedirect = false;
    },
    [resetPassword.fulfilled]: (state) => {
      state.resettingPassword = false;
      state.resetPasswordRedirect = true;
    },
    [resetPassword.rejected]: (state, action) => {
      state.resettingPassword = false;
      state.resetPasswordError = action.error.message;
    },
  },
});

export const {
  setUser,
  setLoginError,
  setUpdateError,
  setForgotPasswordError,
  setSignUpError,
  setResetPasswordRedirect,
  setDeviceFCMToken,
} = userSlice.actions;

export default userSlice.reducer;
