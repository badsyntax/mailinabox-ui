import {
  BaseButton,
  Dialog,
  DialogFooter,
  DialogType,
  IDialogContentProps,
  IModalProps,
  IStackProps,
  Link,
  mergeStyles,
  PrimaryButton,
  ScreenWidthMinLarge,
  Stack,
  Text,
} from '@fluentui/react';
import { useConstCallback } from '@uifabric/react-hooks';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { getAliases, upsertAliasReset } from '../../../features/aliasesSlice';
import { getDump } from '../../../features/dnsSlice';
import { getSSLStatus } from '../../../features/sslSlice';
import { RootState } from '../../../store';
import { MailAliasUpsert } from '../MailAliasUpsert/MailAliasUpsert';
import { Pre } from '../Pre/Pre';

const columnClassName = mergeStyles({
  flexBasis: 0,
  minWidth: 0,
});

const dialogContentProps: IDialogContentProps = {
  type: DialogType.largeHeader,
  title: 'Alias Added',
};

const modalProps: IModalProps = {
  isBlocking: true,
};

export const MailAliasAdd: React.FunctionComponent<IStackProps> = ({
  ...props
}) => {
  const { isUpsertingAlias, upsertAliasResponse } = useSelector(
    (state: RootState) => state.aliases
  );
  const dispatch = useDispatch();

  const [isDialogHidden, setIsDialogHidden] = useState<boolean>(true);
  const [hasDialogOpened, setHasDialogOpened] = useState<boolean>(false);

  const isMinLargeScreen = useMediaQuery({
    minWidth: ScreenWidthMinLarge,
  });

  const nonMobileContainerProps = {
    horizontal: isMinLargeScreen,
    gap: isMinLargeScreen ? 'l2' : 'm',
  };

  const onDialogDismissed = useConstCallback((): void => {
    dispatch(upsertAliasReset());
    setHasDialogOpened(false);
  });

  const onDialogClose = useConstCallback(
    (_event: React.MouseEvent<BaseButton, MouseEvent>): void => {
      setIsDialogHidden(true);
    }
  );

  useEffect(() => {
    if (upsertAliasResponse && isDialogHidden && !hasDialogOpened) {
      setIsDialogHidden(false);
    }
  }, [upsertAliasResponse, hasDialogOpened, isDialogHidden]);

  useEffect(() => {
    if (!isDialogHidden) {
      setHasDialogOpened(true);
    }
  }, [isDialogHidden]);

  useEffect(() => {
    if (upsertAliasResponse) {
      dispatch(getAliases());
      dispatch(getSSLStatus());
      dispatch(getDump());
    }
  }, [dispatch, upsertAliasResponse]);

  useEffect(() => {
    return (): void => {
      dispatch(upsertAliasReset());
    };
  }, [dispatch]);

  return (
    <Stack>
      <Dialog
        hidden={isDialogHidden}
        dialogContentProps={dialogContentProps}
        modalProps={modalProps}
        minWidth={480}
        maxWidth={480}
        onDismissed={onDialogDismissed}
      >
        <Pre>{upsertAliasResponse}</Pre>
        <DialogFooter>
          <PrimaryButton text="OK" onClick={onDialogClose} />
        </DialogFooter>
      </Dialog>
      <Stack {...props} {...nonMobileContainerProps}>
        <Stack gap="m" grow={1} className={columnClassName}>
          <Text>
            Aliases are email forwarders. An alias can forward email to a{' '}
            <Link href="#">mail user</Link> or to any email address.
          </Text>
          <Text>
            To use an alias or any address besides your own login username in
            outbound mail, the sending user must be included as a permitted
            sender for the alias.
          </Text>
        </Stack>
        <MailAliasUpsert>
          <Stack horizontal>
            <PrimaryButton type="submit" disabled={isUpsertingAlias}>
              Add Alias
            </PrimaryButton>
          </Stack>
        </MailAliasUpsert>
      </Stack>
    </Stack>
  );
};
