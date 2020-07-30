import {
  Action,
  createSlice,
  PayloadAction,
  ThunkAction,
} from '@reduxjs/toolkit';
import {
  MailUser,
  MailUserPrivilege,
  MailUsersResponse,
  MailUsersResponseFormat,
  MailUserStatus,
} from 'mailinabox-api';
import { getRequestFailMessage, usersApi } from '../api';
import { RootState } from '../store';

export enum UserAction {
  addAdminPrivilege,
  removeAdminPrivilege,
  setPassword,
  archive,
}

export interface UserUpdate {
  user?: MailUser;
  action?: UserAction;
}

export interface UsersState {
  isGettingUsers: boolean;
  users: MailUsersResponse;
  getUsersError: string | null;
  isUpdatingUser: boolean;
  isAddingUser: boolean;
  updateUserError: string | null;
  updateUserResponse: string | null;
  userUpdate: UserUpdate | null;
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
  userUpdate: null,
  addUserResponse: null,
  addUserError: null,
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
    userUpdateStart: (state): void => {
      state.updateUserError = null;
      state.isUpdatingUser = true;
    },
    userUpdateSuccess: (state, action): void => {
      state.isUpdatingUser = false;
      state.updateUserResponse = action.payload;
    },
    userUpdateError: (state, action): void => {
      state.updateUserError = action.payload;
      state.isUpdatingUser = false;
    },
    userUpdateReset: (state): void => {
      state.isUpdatingUser = false;
      state.updateUserError = null;
      state.updateUserResponse = null;
    },
    userUpdate: (state, action): void => {
      state.userUpdate = action.payload;
    },
    userResetUpdateAction: (state): void => {
      state.userUpdate = {
        action: undefined,
        user: state.userUpdate?.user,
      };
    },
    userAddStart: (state): void => {
      state.addUserError = null;
      state.isAddingUser = true;
    },
    userAddSuccess: (
      state,
      action: PayloadAction<{
        response: string;
        email: string;
        privileges: Array<MailUserPrivilege>;
      }>
    ): void => {
      const { response, email, privileges } = action.payload;
      const domain = email.split('@').pop() as string;
      const domainIndex = state.users.findIndex(
        (domainUsers) => domainUsers.domain === domain
      );
      const newUser: MailUser = {
        email,
        privileges: privileges.filter((privilege) => !!privilege),
        status: MailUserStatus.Active,
      };
      if (domainIndex >= 0) {
        state.users[domainIndex].users.push(newUser);
      } else {
        state.users.push({
          domain,
          users: [newUser],
        });
      }
      state.isAddingUser = false;
      state.addUserResponse = response;
    },
    userAddError: (state, action): void => {
      state.addUserError = action.payload;
      state.isAddingUser = false;
    },
    userAddReset: (state): void => {
      state.addUserError = null;
      state.isAddingUser = false;
      state.addUserResponse = null;
    },
    userAddResetError: (state): void => {
      state.addUserError = null;
    },
  },
});

export const {
  usersGetSuccess,
  usersGetStart,
  usersGetError,
  userUpdateStart,
  userUpdateSuccess,
  userUpdateError,
  userUpdateReset,
  userUpdate,
  userResetUpdateAction,
  userAddStart,
  userAddSuccess,
  userAddError,
  userAddReset,
  userAddResetError,
} = users.actions;

export const { reducer: usersReducer } = users;

export const selectIsGettingUsers = (state: RootState): boolean =>
  state.users.isGettingUsers;

export const selectUsersError = (state: RootState): string | null =>
  state.users.getUsersError;

export const selectUsers = (state: RootState): MailUsersResponse =>
  state.users.users;

export const selectIsUpdatingUser = (state: RootState): boolean =>
  state.users.isUpdatingUser;

export const selectUpdateUserError = (state: RootState): string | null =>
  state.users.updateUserError;

export const selectUpdateUserResponse = (state: RootState): string | null =>
  state.users.updateUserResponse;

export const selectUserUpdate = (state: RootState): UserUpdate | null =>
  state.users.userUpdate;

export const selectIsAddingUser = (state: RootState): boolean =>
  state.users.isAddingUser;

export const selectAddUserError = (state: RootState): string | null =>
  state.users.addUserError;

export const selectAddUserResponse = (state: RootState): string | null =>
  state.users.addUserResponse;

export const usersCheck = (
  showProgress = true
): ThunkAction<void, RootState, unknown, Action<string>> => async (
  dispatch
): Promise<void> => {
  if (showProgress) {
    dispatch(usersGetStart());
  }
  try {
    const result = await usersApi.getMailUsers({
      format: MailUsersResponseFormat.Json,
    });
    dispatch(usersGetSuccess(result));
  } catch (err) {
    dispatch(usersGetError(await getRequestFailMessage(err as Response)));
  }
};

export const userAddAdminPrivilege = (
  user: MailUser
): ThunkAction<void, RootState, unknown, Action<string>> => async (
  dispatch
): Promise<void> => {
  dispatch(userUpdateStart());
  try {
    const result = await usersApi.addMailUserPrivilege({
      email: user.email,
      privilege: MailUserPrivilege.Admin,
    });
    dispatch(userUpdateSuccess(result));
  } catch (err) {
    dispatch(userUpdateError(await getRequestFailMessage(err as Response)));
  }
};

export const userRemoveAdminPrivilege = (
  user: MailUser
): ThunkAction<void, RootState, unknown, Action<string>> => async (
  dispatch
): Promise<void> => {
  dispatch(userUpdateStart());
  try {
    const result = await usersApi.removeMailUserPrivilege({
      email: user.email,
      privilege: MailUserPrivilege.Admin,
    });
    dispatch(userUpdateSuccess(result));
  } catch (err) {
    dispatch(userUpdateError(await getRequestFailMessage(err as Response)));
  }
};

export const userSetPassword = (
  user: MailUser,
  password: string
): ThunkAction<void, RootState, unknown, Action<string>> => async (
  dispatch
): Promise<void> => {
  dispatch(userUpdateStart());
  try {
    const result = await usersApi.setMailUserPassword({
      email: user.email,
      password: password,
    });
    dispatch(userUpdateSuccess(result));
  } catch (err) {
    dispatch(userUpdateError(await getRequestFailMessage(err as Response)));
  }
};

export const userRemove = (
  user: MailUser
): ThunkAction<void, RootState, unknown, Action<string>> => async (
  dispatch
): Promise<void> => {
  dispatch(userUpdateStart());
  try {
    const result = await usersApi.removeMailUser({
      email: user.email,
    });
    dispatch(userUpdateSuccess(result));
  } catch (err) {
    dispatch(userUpdateError(await getRequestFailMessage(err as Response)));
  }
};

export const userAdd = (
  email: string,
  password: string,
  privilege: MailUserPrivilege
): ThunkAction<void, RootState, unknown, Action<string>> => async (
  dispatch
): Promise<void> => {
  dispatch(userAddStart());
  try {
    const result = await usersApi.addMailUser({
      email,
      password,
      privileges: privilege,
    });
    dispatch(
      userAddSuccess({
        response: result,
        email,
        privileges: [privilege],
      })
    );
  } catch (err) {
    dispatch(userAddError(await getRequestFailMessage(err as Response)));
  }
};
