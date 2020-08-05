import { IGroup } from '@fluentui/react';
import { createSlice } from '@reduxjs/toolkit';
import {
  MailUser,
  MailUserByDomain,
  MailUserPrivilege,
  MailUsersResponse,
  MailUsersResponseFormat,
} from 'mailinabox-api';
import { handleRequestError, mailApi } from '../api';
import { AppThunk, RootState } from '../store';

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

export const selectUsersWithGroups = (
  state: RootState
): [Array<MailUser>, Array<IGroup>] => {
  const { users: mailUsers } = state.users;
  const users: Array<MailUser> = [];
  const groups: Array<IGroup> = [];

  mailUsers.forEach((userDomain: MailUserByDomain) => {
    const { domain, users: usersByDomain } = userDomain;
    groups.push({
      key: 'group' + groups.length,
      name: domain,
      startIndex: users.length,
      isCollapsed: true,
      level: 0,
      count: usersByDomain.length,
    });
    users.push(...usersByDomain);
  });

  return [users, groups];
};

export const getUsers = (): AppThunk => async (dispatch): Promise<void> => {
  dispatch(getUsersStart());
  try {
    const result = await mailApi.getMailUsers({
      format: MailUsersResponseFormat.Json,
    });
    dispatch(getUsersSuccess(result));
  } catch (err) {
    await handleRequestError(err, dispatch, getUsersError);
  }
};

export const addUserAdminPrivilege = (user: MailUser): AppThunk => async (
  dispatch
): Promise<void> => {
  dispatch(updateUserStart());
  try {
    const result = await mailApi.addMailUserPrivilege({
      email: user.email,
      privilege: MailUserPrivilege.Admin,
    });
    dispatch(updateUserSuccess(result));
  } catch (err) {
    await handleRequestError(err, dispatch, updateUserError);
  }
};

export const removeUserAdminPrivilege = (user: MailUser): AppThunk => async (
  dispatch
): Promise<void> => {
  dispatch(updateUserStart());
  try {
    const result = await mailApi.removeMailUserPrivilege({
      email: user.email,
      privilege: MailUserPrivilege.Admin,
    });
    dispatch(updateUserSuccess(result));
  } catch (err) {
    await handleRequestError(err, dispatch, updateUserError);
  }
};

export const setUserPassword = (
  user: MailUser,
  password: string
): AppThunk => async (dispatch): Promise<void> => {
  dispatch(updateUserStart());
  try {
    const result = await mailApi.setMailUserPassword({
      email: user.email,
      password: password,
    });
    dispatch(updateUserSuccess(result));
  } catch (err) {
    await handleRequestError(err, dispatch, updateUserError);
  }
};

export const removeUser = (user: MailUser): AppThunk => async (
  dispatch
): Promise<void> => {
  dispatch(updateUserStart());
  try {
    const result = await mailApi.removeMailUser({
      email: user.email,
    });
    dispatch(updateUserSuccess(result));
  } catch (err) {
    await handleRequestError(err, dispatch, updateUserError);
  }
};

export const addUser = (
  email: string,
  password: string,
  privilege: MailUserPrivilege
): AppThunk => async (dispatch): Promise<void> => {
  dispatch(addUserStart());
  try {
    const result = await mailApi.addMailUser({
      email,
      password,
      privileges: privilege,
    });
    dispatch(addUserSuccess(result));
  } catch (err) {
    await handleRequestError(err, dispatch, addUserError);
  }
};
