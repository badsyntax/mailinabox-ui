import {
  BaseButton,
  Button,
  ChoiceGroup,
  getTheme,
  IChoiceGroupOption,
  mergeStyles,
  MessageBarType,
  Pivot,
  PivotItem,
  PivotLinkFormat,
  PivotLinkSize,
  Stack,
  TextField,
} from '@fluentui/react';
import { useConstCallback } from '@uifabric/react-hooks';
import { UpsertMailAliasRequest } from 'mailinabox-api';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  upsertAlias,
  upsertAliasResetError,
} from '../../../features/aliasesSlice';
import { useFormInputs } from '../../../forms/useFormInputs';
import { RootState } from '../../../store';
import { MessageBar } from '../MessageBar/MessageBar';
import {
  onRenderTextFieldLabel,
  textfieldWithLabelInfoStyles,
} from '../TextFieldWithInfo/TextFieldWithInfo';
import { AliasType, formData, SenderType } from './formData';

const theme = getTheme();

const columnClassName = mergeStyles({
  flexBasis: 0,
});

function getInitialAliasType({
  address,
  forwardsTo,
}: UpsertMailAliasRequest): AliasType {
  if (address.charAt(0) === '@' && forwardsTo.charAt(0) === '@') {
    return AliasType.domainAlias;
  } else if (address.charAt(0) === '@') {
    return AliasType.catchAll;
  } else {
    return AliasType.regular;
  }
}

const initialFormState: UpsertMailAliasRequest = {
  address: '',
  forwardsTo: '',
  permittedSenders: '',
  updateIfExists: 0,
};

interface MailAliasUpsertProps {
  updateAlias?: UpsertMailAliasRequest;
}

export const MailAliasUpsert: React.FunctionComponent<MailAliasUpsertProps> = ({
  children,
  updateAlias = initialFormState,
}) => {
  const { upsertAliasResponse, upsertAliasError } = useSelector(
    (state: RootState) => state.aliases
  );

  const dispatch = useDispatch();
  const [aliasType, setAliasType] = useState<AliasType>(
    getInitialAliasType(updateAlias)
  );
  const [senderType, setSenderType] = useState<SenderType>(
    updateAlias.permittedSenders ? SenderType.manual : SenderType.any
  );
  const { inputs: alias, onInputChange, resetInputs } = useFormInputs<
    UpsertMailAliasRequest
  >(updateAlias);

  const senderTypeOptions: IChoiceGroupOption[] = [
    { key: SenderType.any, text: formData[aliasType].permittedSenders.any },
    {
      key: SenderType.manual,
      text: formData[aliasType].permittedSenders.manual,
    },
  ];

  const onSenderTypeChange = useConstCallback(
    (
      _event?: React.FormEvent<HTMLElement | HTMLInputElement>,
      option?: IChoiceGroupOption
    ) => {
      if (option) {
        setSenderType(option.key as SenderType);
      }
    }
  );

  const onPivotLinkClick = useConstCallback(
    (item?: PivotItem, ev?: React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (item && item.props && item.props.itemKey) {
        setAliasType(item.props.itemKey as AliasType);
      }
    }
  );

  const onErrorMessageBarDismiss = useConstCallback(
    (
      _event?: React.MouseEvent<HTMLElement | BaseButton | Button, MouseEvent>
    ): void => {
      dispatch(upsertAliasResetError());
    }
  );

  const onFormSubmit = (event: React.FormEvent<HTMLElement>): void => {
    event.preventDefault();
    dispatch(
      upsertAlias({
        ...alias,
        permittedSenders:
          senderType === SenderType.manual ? alias.permittedSenders : '',
      })
    );
  };

  const onForwardsToRenderLabel = useMemo(
    () =>
      onRenderTextFieldLabel(
        <>
          Only forward mail to addresses handled by this Mail-in-a-Box, since
          mail forwarded by aliases to other domains may be rejected or filtered
          by the receiver. To forward mail to other domains, create a mail user
          and then log into webmail for the user and create a filter rule to
          forward mail.
        </>
      ),
    []
  );

  useEffect(() => {
    if (upsertAliasResponse) {
      resetInputs();
    }
  }, [resetInputs, upsertAliasResponse]);

  return (
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
          onDismiss={onErrorMessageBarDismiss}
          dismissButtonAriaLabel="Close"
        >
          {upsertAliasError}
        </MessageBar>
      )}
      <Stack gap="s2">
        <Pivot
          linkSize={PivotLinkSize.normal}
          linkFormat={PivotLinkFormat.tabs}
          onLinkClick={onPivotLinkClick}
          selectedKey={aliasType}
        >
          {Object.keys(formData).map((type) => (
            <PivotItem
              headerText={formData[type].text}
              itemKey={type}
              headerButtonProps={{
                disabled: updateAlias.updateIfExists === 1,
              }}
            >
              {formData[type].info ? (
                <MessageBar
                  styles={{
                    root: {
                      marginTop: theme.spacing.s1,
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
        onChange={onInputChange}
        name="address"
        value={alias.address}
        autoFocus={!updateAlias.address}
        disabled={!!updateAlias.address}
      />
      <TextField
        label="Forwards To"
        multiline
        rows={3}
        required
        placeholder={formData[aliasType].forwardsTo.placeholder}
        description={formData[aliasType].forwardsTo.info}
        styles={{
          description: { ...theme.fonts.small },
          ...textfieldWithLabelInfoStyles,
        }}
        name="forwardsTo"
        onChange={onInputChange}
        value={alias.forwardsTo}
        onRenderLabel={onForwardsToRenderLabel}
        autoFocus={!!updateAlias.address}
      />
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
          name="permittedSenders"
          placeholder={formData[aliasType].permittedSenders.placeholder}
          onChange={onInputChange}
          value={alias.permittedSenders ?? ''}
          styles={{
            description: { ...theme.fonts.small },
            ...textfieldWithLabelInfoStyles,
          }}
          description={formData[aliasType].permittedSenders.info}
        />
      )}
      {children}
    </Stack>
  );
};
