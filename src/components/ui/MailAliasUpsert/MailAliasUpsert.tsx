import {
  BaseButton,
  Button,
  ChoiceGroup,
  Dialog,
  DialogFooter,
  DialogType,
  getTheme,
  IChoiceGroupOption,
  IDialogContentProps,
  IModalProps,
  IStackProps,
  Label,
  mergeStyles,
  MessageBarType,
  Pivot,
  PivotItem,
  PivotLinkFormat,
  PivotLinkSize,
  PrimaryButton,
  Stack,
  TextField,
} from '@fluentui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  aliasesCheck,
  aliasUpsert,
  aliasUpsertReset,
  aliasUpsertResetError,
  selectUpsertAliasError,
  selectUpsertAliasResponse,
} from '../../../features/aliasesSlice';
import { MessageBar } from '../MessageBar/MessageBar';
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

export const MailAliasUpsert: React.FunctionComponent<IStackProps> = ({
  children,
  ...rest
}) => {
  const dispatch = useDispatch();
  const upsertAliasResponse = useSelector(selectUpsertAliasResponse);
  const upsertAliasError = useSelector(selectUpsertAliasError);
  const [aliasType, setAliasType] = useState<AliasType>(AliasType.regular);
  const [senderType, setSenderType] = useState<SenderType>(SenderType.any);
  const [isDialogHidden, setIsDialogHidden] = useState<boolean>(true);
  const [hasDialogOpened, setHasDialogOpened] = useState<boolean>(false);
  const [alias, setAlias] = useState<FormState>(initialFormState);

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

      <Stack
        gap="m"
        as="form"
        grow={1}
        className={columnClassName}
        onSubmit={onFormSubmit}
      >
        {upsertAliasError && (
          <MessageBar
            messageBarType={MessageBarType.error}
            isMultiline={false}
            onDismiss={onMessageBarDismiss}
            dismissButtonAriaLabel="Close"
          >
            {upsertAliasError}
          </MessageBar>
        )}
        <Stack gap="s2">
          <Label required>Type</Label>
          <Pivot
            linkSize={PivotLinkSize.normal}
            linkFormat={PivotLinkFormat.tabs}
            onLinkClick={onPivotLinkClick}
            selectedKey={aliasType}
          >
            {Object.keys(formData).map((type) => (
              <PivotItem headerText={formData[type].text} itemKey={type}>
                {formData[type].info ? (
                  <MessageBar
                    styles={{
                      root: {
                        marginTop: theme.spacing.m,
                      },
                    }}
                  >
                    {formData[type].info}
                  </MessageBar>
                ) : null}
              </PivotItem>
            ))}
          </Pivot>
        </Stack>
        <TextField
          label="Alias"
          required
          placeholder={formData[aliasType].alias.placeholder}
          description={formData[aliasType].alias.info}
          styles={{ description: { ...theme.fonts.small } }}
          onChange={onAliasChange}
          value={alias.alias}
          autoFocus
        />
        <TextField
          label="Forwards To"
          multiline
          rows={3}
          required
          placeholder={formData[aliasType].forwardsTo.placeholder}
          description={formData[aliasType].forwardsTo.info}
          styles={{ description: { ...theme.fonts.small } }}
          onChange={onForwardsToChange}
          value={alias.forwardsTo}
        />
        <MessageBar
          animate={false}
          messageBarType={MessageBarType.warning}
          isMultiline
        >
          Only forward mail to addresses handled by this Mail-in-a-Box, since
          mail forwarded by aliases to other domains may be rejected or filtered
          by the receiver. To forward mail to other domains, create a mail user
          and then log into webmail for the user and create a filter rule to
          forward mail.
        </MessageBar>
        <ChoiceGroup
          selectedKey={senderType}
          options={senderTypeOptions}
          onChange={onSenderTypeChange}
          label="Permitted Senders"
          required
        />
        {senderType === SenderType.manual && (
          <TextField
            multiline
            rows={3}
            required
            placeholder="one user per line or separated by commas"
            onChange={onSendersChange}
            value={alias.senders}
          />
        )}
        <Stack horizontal>{children}</Stack>
      </Stack>
    </>
  );
};
