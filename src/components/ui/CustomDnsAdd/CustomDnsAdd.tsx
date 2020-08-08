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
import { useConstCallback } from '@uifabric/react-hooks';
import { DNSRecordType } from 'mailinabox-api';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import {
  addCustomRecord,
  addCustomRecordReset,
  addCustomRecordResetError,
  getCustomRecords,
} from '../../../features/dnsSlice';
import { useFormInputs } from '../../../forms/useFormInputs';
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
  minWidth: 0,
});

type FormState = {
  type: IDropdownOption;
  zone: IDropdownOption;
  name: string;
  value: string;
};

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

  const { inputs, setInputs, resetInputs, onInputChange } = useFormInputs<
    FormState
  >({
    type: recordTypeOptions[0],
    zone: zoneOptions[0],
    name: '',
    value: '',
  });

  const [isDialogHidden, setIsDialogHidden] = useState<boolean>(true);
  const [hasDialogOpened, setHasDialogOpened] = useState<boolean>(false);

  const onDialogDismissed = (): void => {
    if (addCustomRecordResponse) {
      dispatch(getCustomRecords());
    }
    dispatch(addCustomRecordReset());
    setHasDialogOpened(false);
    resetInputs();
  };

  const onDialogClose = useConstCallback(
    (_event: React.MouseEvent<BaseButton, MouseEvent>): void => {
      setIsDialogHidden(true);
    }
  );

  const onDropdownChange = (name: string) => (
    _event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ): void => {
    if (option) {
      setInputs({
        ...inputs,
        [name]: option,
      });
    }
  };

  const onFormSubmit = (event: React.FormEvent<HTMLElement>): void => {
    event.preventDefault();
    const qname = inputs.name
      ? `${inputs.name}.${inputs.zone.key as string}`
      : (inputs.zone.key as string);
    dispatch(
      addCustomRecord({
        qname,
        rtype: inputs.type.key as DNSRecordType,
        body: inputs.value,
      })
    );
  };

  const onMessageBarDismiss = useConstCallback(
    (
      _event?: React.MouseEvent<HTMLElement | BaseButton | Button, MouseEvent>
    ): void => {
      dispatch(addCustomRecordResetError());
    }
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

  console.log('addCustomRecordError', addCustomRecordError);

  return (
    <Stack>
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
            selectedKey={inputs.zone.key}
            onChange={onDropdownChange('zone')}
          />
          <TextField
            label="Name"
            placeholder="subdomain"
            value={inputs.name}
            name="name"
            onChange={onInputChange}
          />
          <Dropdown
            label="Type"
            required
            options={recordTypeOptions}
            selectedKey={inputs.type.key}
            onChange={onDropdownChange('type')}
          />
          <TextField
            label="Value"
            required
            value={inputs.value}
            name="value"
            onChange={onInputChange}
          />
          <MessageBar>
            {recordTypes[inputs.type.key as DNSRecordType].hint}
          </MessageBar>
          <Stack horizontal>
            <PrimaryButton type="submit" disabled={isAddingCustomRecord}>
              Save Record
            </PrimaryButton>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
