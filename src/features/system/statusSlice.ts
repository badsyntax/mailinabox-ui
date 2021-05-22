import { IGroup } from '@fluentui/react';
import { createSelector, createSlice } from '@reduxjs/toolkit';
import { StatusEntry, StatusEntryType } from 'mailinabox-api';
import { handleRequestError, systemApi } from '../../api';
import { AppThunk, RootState } from '../../store';

export interface SystemStatusState {
  isGettingStatus: boolean;
  status: Array<StatusEntry>;
  getStatusError: string | null;
}

const initialState: SystemStatusState = {
  isGettingStatus: false,
  status: [],
  getStatusError: null,
};

const systemStatus = createSlice({
  name: 'status',
  initialState,
  reducers: {
    getStatusStart: (state): void => {
      state.getStatusError = null;
      state.isGettingStatus = true;
    },
    getStatusSuccess: (state, action): void => {
      state.isGettingStatus = false;
      state.status = action.payload;
    },
    getStatusError: (state, action): void => {
      state.getStatusError = action.payload;
      state.isGettingStatus = false;
    },
  },
});

export const { getStatusSuccess, getStatusStart, getStatusError } =
  systemStatus.actions;

export const { reducer: systemStatusReducer } = systemStatus;

export const systemStatusCheck =
  (): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(getStatusStart());
    try {
      const result = await systemApi.getSystemStatus();
      dispatch(getStatusSuccess(result));
    } catch (err) {
      await handleRequestError(err, dispatch, getStatusError);
    }
  };

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
  const { status: entries } = state.system.status;
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
