import { Action, createSlice, ThunkAction } from '@reduxjs/toolkit';
import {
  MailUser,
  MailUserPrivilege,
  MailUsersResponse,
  MailUsersResponseFormat,
} from 'mailinabox-api';
import { getRequestFailMessage, usersApi } from '../api';
import { RootState } from '../store';

export interface UsersState {
  isGettingUsers: boolean;
  users: MailUsersResponse;
  getUsersError: string | null;

  isUpdatingPrivilege: boolean;
  updatePrivilegeError: string | null;

  updatePrivilegeResponse: string | null;
}

const initialState: UsersState = {
  isGettingUsers: false,
  users: [],
  getUsersError: null,
  isUpdatingPrivilege: false,
  updatePrivilegeError: null,
  updatePrivilegeResponse: null,
};

export const users = createSlice({
  name: 'users',
  initialState,
  reducers: {
    usersGetStart: (state): void => {
      state.getUsersError = null;
      state.isGettingUsers = true;
    },
    usersGetSuccess: (state, action): void => {
      state.isGettingUsers = false;
      state.users = action.payload;
    },
    usersGetError: (state, action): void => {
      state.getUsersError = action.payload;
      state.isGettingUsers = false;
    },

    userUpdatePrivilegeStart: (state): void => {
      state.updatePrivilegeError = null;
      state.isUpdatingPrivilege = true;
    },
    userUpdatePrivilegeSuccess: (state, action): void => {
      state.isUpdatingPrivilege = false;
      state.updatePrivilegeResponse = action.payload;
    },
    userUpdatePrivilegeError: (state, action): void => {
      state.updatePrivilegeError = action.payload;
      state.isUpdatingPrivilege = false;
    },
    userUpdatePrivilegeReset: (state): void => {
      state.isUpdatingPrivilege = false;
      state.updatePrivilegeError = null;
      state.updatePrivilegeResponse = null;
    },
  },
});

export const {
  usersGetSuccess,
  usersGetStart,
  usersGetError,
  userUpdatePrivilegeStart,
  userUpdatePrivilegeSuccess,
  userUpdatePrivilegeError,
  userUpdatePrivilegeReset,
} = users.actions;

export const { reducer: usersReducer } = users;

export const selectIsGettingUsers = (state: RootState): boolean =>
  state.users.isGettingUsers;

export const selectUsersError = (state: RootState): string | null =>
  state.users.getUsersError;

export const selectUsers = (state: RootState): MailUsersResponse =>
  state.users.users;

export const selectIsUpdatingPrivilege = (state: RootState): boolean =>
  state.users.isUpdatingPrivilege;

export const selectUpdatePrivilegeError = (state: RootState): string | null =>
  state.users.updatePrivilegeError;

export const selectUpdatePrivilegeResponse = (
  state: RootState
): string | null => state.users.updatePrivilegeResponse;

export const usersCheck = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action<string>
> => async (dispatch): Promise<void> => {
  dispatch(usersGetStart());
  try {
    const result = await usersApi.getUsers({
      format: MailUsersResponseFormat.Json,
    });
    dispatch(usersGetSuccess(result));
  } catch (err) {
    dispatch(usersGetError(getRequestFailMessage(err as Response)));
  }
};

export const userAddAdminPrivilege = (
  user: MailUser
): ThunkAction<void, RootState, unknown, Action<string>> => async (
  dispatch
): Promise<void> => {
  dispatch(userUpdatePrivilegeStart());
  try {
    const result = await usersApi.addUserPrivilege({
      email: user.email,
      privilege: MailUserPrivilege.Admin,
    });
    dispatch(userUpdatePrivilegeSuccess(result));
  } catch (err) {
    dispatch(userUpdatePrivilegeError(getRequestFailMessage(err as Response)));
  }
};

export const userRemoveAdminPrivilege = (
  user: MailUser
): ThunkAction<void, RootState, unknown, Action<string>> => async (
  dispatch
): Promise<void> => {
  dispatch(userUpdatePrivilegeStart());
  try {
    const result = await usersApi.removeUserPrivilege({
      email: user.email,
      privilege: MailUserPrivilege.Admin,
    });
    dispatch(userUpdatePrivilegeSuccess(result));
  } catch (err) {
    dispatch(userUpdatePrivilegeError(getRequestFailMessage(err as Response)));
  }
};
