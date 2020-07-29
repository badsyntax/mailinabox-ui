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
import {
  aliasesCheck,
  aliasUpsertReset,
  selectIsUpsertingAlias,
  selectUpsertAliasResponse,
} from '../../../features/aliasesSlice';
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
  const dispatch = useDispatch();
  const isAddingAlias = useSelector(selectIsUpsertingAlias);
  const upsertAliasResponse = useSelector(selectUpsertAliasResponse);
  const [isDialogHidden, setIsDialogHidden] = useState<boolean>(true);
  const [hasDialogOpened, setHasDialogOpened] = useState<boolean>(false);

  const onDialogDismissed = useCallback((): void => {
    dispatch(aliasUpsertReset());
  }, [dispatch]);

  const onDialogClose = useCallback(
    (event: React.MouseEvent<BaseButton, MouseEvent>): void => {
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
    return (): void => {
      dispatch(aliasUpsertReset());
    };
  }, [dispatch]);

  useEffect(() => {
    if (upsertAliasResponse) {
      dispatch(aliasesCheck());
    }
  }, [dispatch, upsertAliasResponse]);

  return (
    <>
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
            <PrimaryButton type="submit" disabled={isAddingAlias}>
              Add Alias
            </PrimaryButton>
          </Stack>
        </MailAliasUpsert>
      </Stack>
    </>
  );
};
