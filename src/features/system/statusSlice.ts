import { IGroup } from '@fluentui/react';
import {
  Action,
  createSelector,
  createSlice,
  ThunkAction,
} from '@reduxjs/toolkit';
import { StatusEntry, StatusEntryType } from 'mailinabox-api';
import { getRequestFailMessage, systemApi } from '../../api';
import { RootState } from '../../store';

export interface SystemStatusState {
  isChecking: boolean;
  status: Array<StatusEntry>;
  error: string | null;
}

const systemStatus = createSlice({
  name: 'status',
  initialState: {
    isChecking: false,
    status: [],
    error: null,
  } as SystemStatusState,
  reducers: {
    systemStatusStart: (state): void => {
      state.error = null;
      state.isChecking = true;
    },
    systemStatusSuccess: (state, action): void => {
      state.isChecking = false;
      state.status = action.payload;
    },
    systemStatusError: (state, action): void => {
      state.error = action.payload;
      state.isChecking = false;
    },
  },
});

export const {
  systemStatusSuccess,
  systemStatusStart,
  systemStatusError,
} = systemStatus.actions;

export const systemStatusCheck = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action<string>
> => async (dispatch): Promise<void> => {
  dispatch(systemStatusStart());
  try {
    const result = await systemApi.getSystemStatus();
    dispatch(systemStatusSuccess(result));
  } catch (err) {
    dispatch(systemStatusError(getRequestFailMessage(err as Response)));
  }
};

export const { reducer: systemStatusReducer } = systemStatus;

export const selectIsCheckingStatus = (state: RootState): boolean =>
  state.system.status.isChecking;

export const selectStatusError = (state: RootState): string | null =>
  state.system.status.error;

export const selectStatus = (state: RootState): Array<StatusEntry> =>
  state.system.status.status;

type StatusGroup = IGroup;

type StatusItem = StatusEntry & {
  key: string;
};

export const selectSystemStatusItemsAndGroups = (
  state: RootState
): [Array<StatusItem>, Array<StatusGroup>] => {
  const groups: Array<StatusGroup> = [];
  const items: Array<StatusItem> = [];
  let group: StatusGroup | undefined = undefined;
  const entries = selectStatus(state);
  entries.forEach((statusEntry, i) => {
    const isHeadingEntry = statusEntry.type === StatusEntryType.Heading;
    if (!isHeadingEntry) {
      items.push({
        key: 'item' + items.length,
        ...statusEntry,
      });
    }
    if ((isHeadingEntry || i === entries.length - 1) && group) {
      groups.push({
        ...group,
        count: items.length - group.startIndex,
      });
    }
    if (isHeadingEntry) {
      group = {
        key: 'group' + groups.length,
        name: statusEntry.text,
        startIndex: items.length,
        isCollapsed: false,
        level: 0,
        count: 0,
      };
    }
  });

  return [items, groups];
};

interface SummarisedChecks {
  [StatusEntryType.Ok]: number;
  [StatusEntryType.Warning]: number;
  [StatusEntryType.Error]: number;
  total: number;
}

export const selectSummarisedChecks = createSelector(
  [selectSystemStatusItemsAndGroups],
  ([items]): SummarisedChecks => {
    const summary = {
      [StatusEntryType.Ok]: 0,
      [StatusEntryType.Warning]: 0,
      [StatusEntryType.Error]: 0,
      total: 0,
    };
    items.forEach((item) => {
      if (item.type !== StatusEntryType.Heading) {
        summary.total += 1;
      }
      switch (item.type) {
        case StatusEntryType.Ok:
          summary[StatusEntryType.Ok] += 1;
          break;
        case StatusEntryType.Error:
          summary[StatusEntryType.Error] += 1;
          break;
        case StatusEntryType.Warning:
          summary[StatusEntryType.Warning] += 1;
          break;
      }
    });
    return summary;
  }
);
