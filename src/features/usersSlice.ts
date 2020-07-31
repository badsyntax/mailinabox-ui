import { Action, createSlice, ThunkAction } from '@reduxjs/toolkit';
import {
  MailUser,
  MailUserPrivilege,
  MailUsersResponse,
  MailUsersResponseFormat,
} from 'mailinabox-api';
import { getRequestFailMessage, usersApi } from '../api';
import { RootState } from '../store';

export enum UserActionType {
  addAdminPrivilege,
  removeAdminPrivilege,
  setPassword,
  archive,
}

export interface UserAction {
  user?: MailUser;
  type?: UserActionType;
}

export interface UsersState {
  isGettingUsers: boolean;
  users: MailUsersResponse;
  getUsersError: string | null;
  isUpdatingUser: boolean;
  isAddingUser: boolean;
  updateUserError: string | null;
  updateUserResponse: string | null;
  userAction: UserAction | null;
  addUserResponse: string | null;
  addUserError: string | null;
}

const initialState: UsersState = {
  isGettingUsers: false,
  users: [],
  getUsersError: null,
  isUpdatingUser: false,
  isAddingUser: false,
  updateUserError: null,
  updateUserResponse: null,
  userAction: null,
  addUserResponse: null,
  addUserError: null,
};

export const users = createSlice({
  name: 'users',
  initialState,
  reducers: {
    getUsersStart: (state): void => {
      state.getUsersError = null;
      state.isGettingUsers = true;
    },
    getUsersSuccess: (state, action): void => {
      state.isGettingUsers = false;
      state.users = action.payload;
    },
    getUsersError: (state, action): void => {
      state.getUsersError = action.payload;
      state.isGettingUsers = false;
    },
    updateUserStart: (state): void => {
      state.updateUserError = null;
      state.isUpdatingUser = true;
    },
    updateUserSuccess: (state, action): void => {
      state.isUpdatingUser = false;
      state.updateUserResponse = action.payload;
    },
    updateUserError: (state, action): void => {
      state.updateUserError = action.payload;
      state.isUpdatingUser = false;
    },
    updateUserReset: (state): void => {
      state.isUpdatingUser = false;
      state.updateUserError = null;
      state.updateUserResponse = null;
    },
    setUserAction: (state, action): void => {
      state.userAction = action.payload;
    },
    resetUserAction: (state): void => {
      state.userAction = {
        ...state.userAction,
        type: undefined,
      };
    },
    addUserStart: (state): void => {
      state.addUserError = null;
      state.isAddingUser = true;
    },
    addUserSuccess: (state, action): void => {
      state.isAddingUser = false;
      state.addUserResponse = action.payload;
    },
    addUserError: (state, action): void => {
      state.addUserError = action.payload;
      state.isAddingUser = false;
    },
    addUserReset: (state): void => {
      state.addUserError = null;
      state.isAddingUser = false;
      state.addUserResponse = null;
    },
    addUserResetError: (state): void => {
      state.addUserError = null;
    },
  },
});

export const {
  getUsersSuccess,
  getUsersStart,
  getUsersError,
  updateUserStart,
  updateUserSuccess,
  updateUserError,
  updateUserReset,
  setUserAction,
  resetUserAction,
  addUserStart,
  addUserSuccess,
  addUserError,
  addUserReset,
  addUserResetError,
} = users.actions;

export const { reducer: usersReducer } = users;

export const getUsers = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action<string>
> => async (dispatch): Promise<void> => {
  dispatch(getUsersStart());
  try {
    const result = await usersApi.getMailUsers({
      format: MailUsersResponseFormat.Json,
    });
    dispatch(getUsersSuccess(result));
  } catch (err) {
    dispatch(getUsersError(await getRequestFailMessage(err)));
  }
};

export const addUserAdminPrivilege = (
  user: MailUser
): ThunkAction<void, RootState, unknown, Action<string>> => async (
  dispatch
): Promise<void> => {
  dispatch(updateUserStart());
  try {
    const result = await usersApi.addMailUserPrivilege({
      email: user.email,
      privilege: MailUserPrivilege.Admin,
    });
    dispatch(updateUserSuccess(result));
  } catch (err) {
    dispatch(updateUserError(await getRequestFailMessage(err)));
  }
};

export const removeUserAdminPrivilege = (
  user: MailUser
): ThunkAction<void, RootState, unknown, Action<string>> => async (
  dispatch
): Promise<void> => {
  dispatch(updateUserStart());
  try {
    const result = await usersApi.removeMailUserPrivilege({
      email: user.email,
      privilege: MailUserPrivilege.Admin,
    });
    dispatch(updateUserSuccess(result));
  } catch (err) {
    dispatch(updateUserError(await getRequestFailMessage(err)));
  }
};

export const setUserPassword = (
  user: MailUser,
  password: string
): ThunkAction<void, RootState, unknown, Action<string>> => async (
  dispatch
): Promise<void> => {
  dispatch(updateUserStart());
  try {
    const result = await usersApi.setMailUserPassword({
      email: user.email,
      password: password,
    });
    dispatch(updateUserSuccess(result));
  } catch (err) {
    dispatch(updateUserError(await getRequestFailMessage(err)));
  }
};

export const removeUser = (
  user: MailUser
): ThunkAction<void, RootState, unknown, Action<string>> => async (
  dispatch
): Promise<void> => {
  dispatch(updateUserStart());
  try {
    const result = await usersApi.removeMailUser({
      email: user.email,
    });
    dispatch(updateUserSuccess(result));
  } catch (err) {
    dispatch(updateUserError(await getRequestFailMessage(err)));
  }
};

export const addUser = (
  email: string,
  password: string,
  privilege: MailUserPrivilege
): ThunkAction<void, RootState, unknown, Action<string>> => async (
  dispatch
): Promise<void> => {
  dispatch(addUserStart());
  try {
    const result = await usersApi.addMailUser({
      email,
      password,
      privileges: privilege,
    });
    dispatch(addUserSuccess(result));
  } catch (err) {
    dispatch(addUserError(await getRequestFailMessage(err)));
  }
};
