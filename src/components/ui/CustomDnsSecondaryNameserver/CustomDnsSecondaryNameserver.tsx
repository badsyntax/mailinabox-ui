import {
  BaseButton,
  Button,
  Dialog,
  DialogFooter,
  DialogType,
  IStackProps,
  mergeStyles,
  MessageBarType,
  PrimaryButton,
  ScreenWidthMinLarge,
  Stack,
  Text,
  TextField,
} from '@fluentui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import {
  addSecondaryNameserver,
  addSecondaryNameserverReset,
  addSecondaryNameserverResetError,
  getSecondaryNameserver,
} from '../../../features/dnsSlice';
import { RootState } from '../../../store';
import { MessageBar } from '../MessageBar/MessageBar';
import { Pre } from '../Pre/Pre';

const columnClassName = mergeStyles({
  flexBasis: 0,
});

export const CustomDnsSecondaryNameserver: React.FunctionComponent<IStackProps> = ({
  ...props
}) => {
  const {
    isAddingSecondaryNameserver,
    addSecondaryNameserverError,
    addSecondaryNameserverResponse,
  } = useSelector((state: RootState) => state.dns);
  const dispatch = useDispatch();
  const isMinLargeScreen = useMediaQuery({
    minWidth: ScreenWidthMinLarge,
  });

  const [hostname, setHostname] = useState<string>('');
  const [isDialogHidden, setIsDialogHidden] = useState<boolean>(true);
  const [hasDialogOpened, setHasDialogOpened] = useState<boolean>(false);

  const onDialogDismissed = useCallback((): void => {
    if (addSecondaryNameserverResponse) {
      dispatch(getSecondaryNameserver());
    }
    dispatch(addSecondaryNameserverReset());
  }, [addSecondaryNameserverResponse, dispatch]);

  const onDialogClose = useCallback(
    (_event: React.MouseEvent<BaseButton, MouseEvent>): void => {
      setIsDialogHidden(true);
    },
    []
  );

  const onErrorMessageBarDismiss = useCallback(
    (
      _event?: React.MouseEvent<HTMLElement | BaseButton | Button, MouseEvent>
    ): void => {
      dispatch(addSecondaryNameserverResetError());
    },
    [dispatch]
  );

  const onHostnameChange = useCallback(
    (_event: React.FormEvent<HTMLElement>, newValue?: string): void => {
      setHostname(newValue || '');
    },
    []
  );

  const onFormSubmit = useCallback(
    (event: React.FormEvent<HTMLElement>): void => {
      event.preventDefault();
      dispatch(
        addSecondaryNameserver({
          hostnames: hostname,
        })
      );
    },
    [dispatch, hostname]
  );

  useEffect(() => {
    if (addSecondaryNameserverResponse && isDialogHidden && !hasDialogOpened) {
      setIsDialogHidden(false);
    }
  }, [addSecondaryNameserverResponse, hasDialogOpened, isDialogHidden]);

  useEffect(() => {
    if (!isDialogHidden) {
      setHasDialogOpened(true);
    }
  }, [isDialogHidden]);

  useEffect(() => {
    return (): void => {
      dispatch(addSecondaryNameserverReset());
    };
  }, [dispatch]);

  return (
    <Stack as="section" gap="l2" horizontal={isMinLargeScreen} {...props}>
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
        <Pre>{addSecondaryNameserverResponse}</Pre>
        <DialogFooter>
          <PrimaryButton text="OK" onClick={onDialogClose} />
        </DialogFooter>
      </Dialog>
      <Stack gap="m" grow={1} className={columnClassName}>
        <Text>
          If your TLD requires you to have two separate nameservers, you can
          either set up external DNS and ignore the DNS server on this box
          entirely, or use the DNS server on this box but add a secondary (aka
          “slave”) nameserver.
        </Text>
        <Text>
          If you choose to use a secondary nameserver, you must find a secondary
          nameserver service provider. Your domain name registrar or virtual
          cloud provider may provide this service for you. Once you set up the
          secondary nameserver service, enter the hostname (not the IP address)
          of their secondary nameserver in field.
        </Text>
      </Stack>
      <Stack
        gap="m"
        grow={1}
        className={columnClassName}
        as="form"
        onSubmit={onFormSubmit}
      >
        {addSecondaryNameserverError && (
          <MessageBar
            messageBarType={MessageBarType.error}
            isMultiline={false}
            onDismiss={onErrorMessageBarDismiss}
            dismissButtonAriaLabel="Close"
          >
            {addSecondaryNameserverError}
          </MessageBar>
        )}
        <MessageBar>
          Multiple secondary servers can be separated with commas or spaces
          (i.e., ns2.hostingcompany.com ns3.hostingcompany.com).
        </MessageBar>
        <MessageBar>
          To enable zone transfers to additional servers without listing them as
          secondary nameservers, add an IP address or subnet using
          xfr:10.20.30.40 or xfr:10.20.30.40/24.
        </MessageBar>
        <TextField
          label="Hostname"
          required
          placeholder="ns1.cloudprovider.com"
          value={hostname}
          onChange={onHostnameChange}
        />
        <Stack horizontal>
          <PrimaryButton type="submit" disabled={isAddingSecondaryNameserver}>
            Update
          </PrimaryButton>
        </Stack>
      </Stack>
    </Stack>
  );
};
