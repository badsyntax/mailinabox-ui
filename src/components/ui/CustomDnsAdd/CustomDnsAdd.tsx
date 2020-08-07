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
  ScreenWidthMinLarge,
  Stack,
  Text,
  TextField,
} from '@fluentui/react';
import { DNSRecordType } from 'mailinabox-api';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import {
  addCustomRecord,
  addCustomRecordReset,
  addCustomRecordResetError,
  getCustomRecords,
} from '../../../features/dnsSlice';
import { RootState } from '../../../store';
import { MessageBar } from '../MessageBar/MessageBar';
import { Pre } from '../Pre/Pre';
import { recordTypes } from './recordTypes';

const recordTypeOptions = Object.keys(recordTypes).map((key) => ({
  key,
  text: recordTypes[key as DNSRecordType].text,
}));

const columnClassName = mergeStyles({
  flexBasis: 0,
});

export const CustomDnsAdd: React.FunctionComponent<IStackProps> = ({
  ...props
}) => {
  const {
    isAddingCustomRecord,
    addCustomRecordResponse,
    addCustomRecordError,
    zones,
  } = useSelector((state: RootState) => state.dns);
  const dispatch = useDispatch();
  const zoneOptions = zones.map((zone) => ({
    key: zone,
    text: zone,
  }));
  const isMinLargeScreen = useMediaQuery({
    minWidth: ScreenWidthMinLarge,
  });
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
    setHasDialogOpened(false);
    setType(recordTypeOptions[0]);
    setZone(zoneOptions[0]);
    setName('');
    setValue('');
  }, [addCustomRecordResponse, dispatch, zoneOptions]);

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
      const qname = name
        ? `${name}.${zone.key as string}`
        : (zone.key as string);
      dispatch(
        addCustomRecord({
          qname,
          rtype: type.key as DNSRecordType,
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
    <>
      {/* TODO: dialog creates a gap when shown*/}
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
      <Stack as="section" gap="l2" horizontal={isMinLargeScreen} {...props}>
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
          <MessageBar>{recordTypes[type.key as DNSRecordType].hint}</MessageBar>
          <Stack horizontal>
            <PrimaryButton type="submit" disabled={isAddingCustomRecord}>
              Save Record
            </PrimaryButton>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};
