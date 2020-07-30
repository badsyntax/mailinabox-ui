import {
  BaseButton,
  Button,
  Dialog,
  DialogFooter,
  DialogType,
  Dropdown,
  IDropdownOption,
  IStackProps,
  mergeStyles,
  MessageBarType,
  PrimaryButton,
  Stack,
  Text,
  TextField,
} from '@fluentui/react';
import { AddDnsCustomRecordTypeEnum } from 'mailinabox-api';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addCustomRecord,
  addCustomRecordReset,
  addCustomRecordResetError,
  getCustomRecords,
  selectAddCustomRecordError,
  selectAddCustomRecordResponse,
  selectIsAddingCustomRecord,
  selectZones,
} from '../../../features/dnsSlice';
import { MessageBar } from '../MessageBar/MessageBar';
import { Pre } from '../Pre/Pre';
import { recordTypes } from './recordTypes';

const recordTypeOptions = Object.keys(recordTypes).map((key) => ({
  key,
  text: recordTypes[key as AddDnsCustomRecordTypeEnum].text,
}));

const columnClassName = mergeStyles({
  flexBasis: 0,
});

export const CustomDnsAdd: React.FunctionComponent<IStackProps> = ({
  ...props
}) => {
  const dispatch = useDispatch();
  const isAddingCustomRecord = useSelector(selectIsAddingCustomRecord);
  const addCustomRecordResponse = useSelector(selectAddCustomRecordResponse);
  const addCustomRecordError = useSelector(selectAddCustomRecordError);
  const zones = useSelector(selectZones);
  const zoneOptions = zones.map((zone) => ({
    key: zone,
    text: zone,
  }));
  const [type, setType] = useState<IDropdownOption>(recordTypeOptions[0]);
  const [zone, setZone] = useState<IDropdownOption>(zoneOptions[0]);
  const [name, setName] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [isDialogHidden, setIsDialogHidden] = useState<boolean>(true);
  const [hasDialogOpened, setHasDialogOpened] = useState<boolean>(false);

  const onDialogDismissed = useCallback((): void => {
    if (addCustomRecordResponse) {
      dispatch(getCustomRecords());
    }
    dispatch(addCustomRecordReset());
  }, [addCustomRecordResponse, dispatch]);

  const onDialogClose = useCallback(
    (_event: React.MouseEvent<BaseButton, MouseEvent>): void => {
      setIsDialogHidden(true);
    },
    []
  );

  const onTypeChange = useCallback(
    (
      _event: React.FormEvent<HTMLDivElement>,
      option?: IDropdownOption
    ): void => {
      if (option) {
        setType(option);
      }
    },
    []
  );

  const onZoneChange = useCallback(
    (
      _event: React.FormEvent<HTMLDivElement>,
      option?: IDropdownOption
    ): void => {
      if (option) {
        setZone(option);
      }
    },
    []
  );

  const onNameChange = useCallback(
    (_event: React.FormEvent<HTMLElement>, newValue?: string): void => {
      setName(newValue || '');
    },
    []
  );

  const onValueChange = useCallback(
    (_event: React.FormEvent<HTMLElement>, newValue?: string): void => {
      setValue(newValue || '');
    },
    []
  );

  const onFormSubmit = useCallback(
    (event: React.FormEvent<HTMLElement>): void => {
      event.preventDefault();
      const domain = name
        ? `${name}.${zone.key as string}`
        : (zone.key as string);
      dispatch(
        addCustomRecord({
          domain,
          type: type.key as AddDnsCustomRecordTypeEnum,
          body: value,
        })
      );
    },
    [dispatch, name, type.key, value, zone.key]
  );

  const onMessageBarDismiss = useCallback(
    (
      _event?: React.MouseEvent<HTMLElement | BaseButton | Button, MouseEvent>
    ): void => {
      dispatch(addCustomRecordResetError());
    },
    [dispatch]
  );

  useEffect(() => {
    if (addCustomRecordResponse && isDialogHidden && !hasDialogOpened) {
      setIsDialogHidden(false);
    }
  }, [addCustomRecordResponse, hasDialogOpened, isDialogHidden]);

  useEffect(() => {
    if (!isDialogHidden) {
      setHasDialogOpened(true);
    }
  }, [isDialogHidden]);

  useEffect(() => {
    return (): void => {
      dispatch(addCustomRecordReset());
    };
  }, [dispatch]);

  return (
    <Stack as="section" gap="l2" horizontal {...props}>
      <Dialog
        hidden={isDialogHidden}
        dialogContentProps={{
          type: DialogType.largeHeader,
          title: 'Custom DNS',
        }}
        modalProps={{
          isBlocking: true,
        }}
        minWidth={480}
        maxWidth={480}
        onDismissed={onDialogDismissed}
      >
        <Pre>{addCustomRecordResponse}</Pre>
        <DialogFooter>
          <PrimaryButton text="OK" onClick={onDialogClose} />
        </DialogFooter>
      </Dialog>
      <Stack gap="m" grow={1} className={columnClassName}>
        <Text>
          You can set additional DNS records, such as if you have a website
          running on another server, to add DKIM records for external mail
          providers, or for various confirmation-of-ownership tests.
        </Text>
      </Stack>
      <Stack
        gap="m"
        grow={1}
        className={columnClassName}
        as="form"
        onSubmit={onFormSubmit}
      >
        {addCustomRecordError && (
          <MessageBar
            messageBarType={MessageBarType.error}
            isMultiline={false}
            onDismiss={onMessageBarDismiss}
            dismissButtonAriaLabel="Close"
          >
            {addCustomRecordError}
          </MessageBar>
        )}
        <Dropdown
          label="Domain"
          required
          options={zoneOptions}
          selectedKey={zone.key}
          onChange={onZoneChange}
        />
        <TextField
          label="Name"
          placeholder="subdomain"
          value={name}
          onChange={onNameChange}
        />
        <Dropdown
          label="Type"
          required
          options={recordTypeOptions}
          selectedKey={type.key}
          onChange={onTypeChange}
        />
        <TextField
          label="Value"
          required
          value={value}
          onChange={onValueChange}
        />
        <MessageBar>
          {recordTypes[type.key as AddDnsCustomRecordTypeEnum].hint}
        </MessageBar>
        <Stack horizontal>
          <PrimaryButton type="submit" disabled={isAddingCustomRecord}>
            Save Record
          </PrimaryButton>
        </Stack>
      </Stack>
    </Stack>
  );
};
