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
  Stack,
  Text,
} from '@fluentui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAliases, upsertAliasReset } from '../../../features/aliasesSlice';
import { RootState } from '../../../store';
import { MailAliasUpsert } from '../MailAliasUpsert/MailAliasUpsert';
import { Pre } from '../Pre/Pre';

const columnClassName = mergeStyles({
  flexBasis: 0,
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

  const onDialogDismissed = useCallback((): void => {
    dispatch(upsertAliasReset());
    setHasDialogOpened(false);
  }, [dispatch]);

  const onDialogClose = useCallback(
    (_event: React.MouseEvent<BaseButton, MouseEvent>): void => {
      setIsDialogHidden(true);
    },
    []
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
      <Stack gap="l2" horizontal {...props}>
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
