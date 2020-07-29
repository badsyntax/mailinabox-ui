import {
  BaseButton,
  Button,
  Dialog,
  DialogFooter,
  DialogType,
  getTheme,
  IChoiceGroupOption,
  IDialogContentProps,
  IModalProps,
  IStackProps,
  Link,
  mergeStyles,
  PivotItem,
  PrimaryButton,
  Stack,
  Text,
} from '@fluentui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  aliasesCheck,
  aliasUpsert,
  aliasUpsertReset,
  aliasUpsertResetError,
  selectIsUpsertingAlias,
  selectUpsertAliasError,
  selectUpsertAliasResponse,
} from '../../../features/aliasesSlice';
import { MailAliasUpsert } from '../MailAliasUpsert/MailAliasUpsert';
import { Pre } from '../Pre/Pre';

const theme = getTheme();

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

enum AliasType {
  regular = 'REGULAR',
  catchAll = 'CATCH_ALL',
  domainAlias = 'DOMAIN_ALIAS',
}

enum SenderType {
  any = 'ANY',
  manual = 'MANUAL',
}

interface FormData {
  [key: string]: {
    info?: string;
    text: string;
    alias: {
      placeholder: string;
      info: string;
    };
    forwardsTo: {
      placeholder: string;
      info?: string;
    };
    senders: {
      any: string;
      manual: string;
    };
  };
}

const formData: FormData = {
  [AliasType.regular]: {
    text: 'Regular',
    alias: {
      placeholder: 'you@yourdomain.com (incoming email address)',
      info:
        'You may use international (non-ASCII) characters for the domain part of the email address only.',
    },
    forwardsTo: {
      placeholder: 'one address per line or separated by commas',
    },
    senders: {
      any:
        'Any mail user listed in the Forwards To box can send mail claiming to be from the alias address.',
      manual:
        'I’ll enter the mail users that can send mail claiming to be from the alias address.',
    },
  },
  [AliasType.catchAll]: {
    text: 'Catch-All',
    info:
      'A catch-all alias captures all otherwise unmatched email to a domain.',
    alias: {
      placeholder: '@yourdomain.com (incoming catch-all domain)',
      info:
        'Enter just the part of an email address starting with the @-sign. You may use international (non-ASCII) characters for the domain part of the email address only.',
    },
    forwardsTo: {
      placeholder: 'one address per line or separated by commas',
    },
    senders: {
      any:
        'Any mail user listed in the Forwards To box can send mail claiming to be from any address on the alias domain.',
      manual:
        'I’ll enter the mail users that can send mail claiming to be from any address on the alias domain.',
    },
  },
  [AliasType.domainAlias]: {
    text: 'Domain Alias',
    info:
      'A domain alias forwards all otherwise unmatched email from one domain to another domain, preserving the part before the @-sign.',
    alias: {
      placeholder: '@yourdomain.com (incoming catch-all domain)',
      info:
        'Enter just the part of an email address starting with the @-sign. You may use international (non-ASCII) characters for the domain part of the email address only.',
    },
    forwardsTo: {
      placeholder: '@otherdomain.com (forward to other domain)',
      info: 'Enter just the part of an email address starting with the @-sign.',
    },
    senders: {
      any:
        'Any mail user listed in the Forwards To box can send mail claiming to be from any address on the alias domain.',
      manual:
        'I’ll enter the mail users that can send mail claiming to be from any address on the alias domain.',
    },
  },
};

interface FormState {
  alias: string;
  forwardsTo: string;
  senders: string;
}

const initialFormState: FormState = {
  alias: '',
  forwardsTo: '',
  senders: '',
};

export const MailAliasAdd: React.FunctionComponent<IStackProps> = ({
  ...props
}) => {
  const dispatch = useDispatch();
  const isAddingAlias = useSelector(selectIsUpsertingAlias);
  const aliasAddResponse = useSelector(selectUpsertAliasResponse);
  const aliasAddError = useSelector(selectUpsertAliasError);
  const [aliasType, setAliasType] = useState<AliasType>(AliasType.regular);
  const [senderType, setSenderType] = useState<SenderType>(SenderType.any);
  const [isDialogHidden, setIsDialogHidden] = useState<boolean>(true);
  const [hasDialogOpened, setHasDialogOpened] = useState<boolean>(false);
  const [alias, setAlias] = useState<FormState>(initialFormState);

  // const [alias, setAlias] = useState<string>('');
  // const [forwardsTo, setForwardsTo] = useState<string>('');
  // const [senders, setSenders] = useState<string>('');

  const senderTypeOptions: IChoiceGroupOption[] = [
    { key: SenderType.any, text: formData[aliasType].senders.any },
    { key: SenderType.manual, text: formData[aliasType].senders.manual },
  ];

  const onSenderTypeChange = useCallback(
    (
      _event?: React.FormEvent<HTMLElement | HTMLInputElement>,
      option?: IChoiceGroupOption
    ) => {
      if (option) {
        setSenderType(option.key as SenderType);
      }
    },
    []
  );

  const onPivotLinkClick = useCallback(
    (item?: PivotItem, ev?: React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (item && item.props && item.props.itemKey) {
        setAliasType(item.props.itemKey as AliasType);
      }
    },
    []
  );

  const onAliasChange = useCallback(
    (_event: React.FormEvent<HTMLElement>, newValue?: string): void => {
      setAlias({
        ...alias,
        alias: newValue ?? '',
      });
    },
    [alias]
  );

  const onForwardsToChange = useCallback(
    (_event: React.FormEvent<HTMLElement>, newValue?: string): void => {
      setAlias({
        ...alias,
        forwardsTo: newValue ?? '',
      });
    },
    [alias]
  );

  const onSendersChange = useCallback(
    (_event: React.FormEvent<HTMLElement>, newValue?: string): void => {
      setAlias({
        ...alias,
        senders: newValue ?? '',
      });
    },
    [alias]
  );

  const onMessageBarDismiss = useCallback(
    (
      ev?: React.MouseEvent<HTMLElement | BaseButton | Button, MouseEvent>
    ): void => {
      dispatch(aliasUpsertResetError());
    },
    [dispatch]
  );

  const onDialogDismissed = useCallback((): void => {
    dispatch(aliasUpsertReset());
    setAlias(initialFormState);
  }, [dispatch]);

  const onDialogClose = useCallback(
    (event: React.MouseEvent<BaseButton, MouseEvent>): void => {
      setIsDialogHidden(true);
    },
    []
  );

  const onFormSubmit = useCallback(
    (event: React.FormEvent<HTMLElement>): void => {
      event.preventDefault();
      dispatch(aliasUpsert(alias.alias, alias.forwardsTo, alias.senders));
    },
    [alias, dispatch]
  );

  useEffect(() => {
    if (aliasAddResponse && isDialogHidden && !hasDialogOpened) {
      setIsDialogHidden(false);
    }
  }, [aliasAddResponse, hasDialogOpened, isDialogHidden]);

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
    if (aliasAddResponse) {
      dispatch(aliasesCheck());
    }
  }, [dispatch, aliasAddResponse]);

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
        <Pre>{aliasAddResponse}</Pre>
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
