import { IGroup } from '@fluentui/react';
import {
  Action,
  createSelector,
  createSlice,
  ThunkAction,
} from '@reduxjs/toolkit';
import { StatusEntry, StatusEntryTypeEnum } from 'mailinabox-api';
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
    const isHeadingEntry = statusEntry.type === StatusEntryTypeEnum.Heading;
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
  [StatusEntryTypeEnum.Ok]: number;
  [StatusEntryTypeEnum.Warning]: number;
  [StatusEntryTypeEnum.Error]: number;
  total: number;
}

export const selectSummarisedChecks = createSelector(
  [selectSystemStatusItemsAndGroups],
  ([items]): SummarisedChecks => {
    const summary = {
      [StatusEntryTypeEnum.Ok]: 0,
      [StatusEntryTypeEnum.Warning]: 0,
      [StatusEntryTypeEnum.Error]: 0,
      total: 0,
    };
    items.forEach((item) => {
      if (item.type !== StatusEntryTypeEnum.Heading) {
        summary.total += 1;
      }
      switch (item.type) {
        case StatusEntryTypeEnum.Ok:
          summary[StatusEntryTypeEnum.Ok] += 1;
          break;
        case StatusEntryTypeEnum.Error:
          summary[StatusEntryTypeEnum.Error] += 1;
          break;
        case StatusEntryTypeEnum.Warning:
          summary[StatusEntryTypeEnum.Warning] += 1;
          break;
      }
    });
    return summary;
  }
);
