import {
  AnimationStyles,
  getTheme,
  Link,
  mergeStyles,
  Stack,
  Text,
} from '@fluentui/react';
import { StatusEntry, StatusEntryType } from 'mailinabox-api';
import React, { useCallback, useState } from 'react';

const theme = getTheme();

interface SystemChecksDetailsListItemProps {
  item: StatusEntry;
}

function getTextColor(type: StatusEntryType): string {
  switch (type) {
    case StatusEntryType.Ok:
      return theme.palette.greenDark;
    case StatusEntryType.Error:
      return theme.palette.redDark;
    case StatusEntryType.Warning:
    default:
      return theme.palette.yellowDark;
  }
}

const extrasClassName = mergeStyles({
  ...AnimationStyles.fadeIn500,
});

export const SystemChecksDetailsListItem: React.FunctionComponent<SystemChecksDetailsListItemProps> = ({
  item,
}) => {
  const { text, extra, type } = item;
  const [isCollapsed, setIsCollapsed] = useState(true);
  const onLinkClick = useCallback((): void => setIsCollapsed(false), []);
  const textColor = getTextColor(type);
  return (
    <>
      <Text styles={{ root: { color: textColor } }}>{text}</Text>
      {!!(extra && extra.length) && (
        <>
          {isCollapsed && (
            <>
              <br />
              <Link onClick={onLinkClick}>Show more</Link>
            </>
          )}
          {!isCollapsed && (
            <Stack padding="m 0" className={extrasClassName}>
              {extra.map((extraItem) => {
                return (
                  <>
                    {extraItem.monospace ? (
                      <Text
                        block
                        styles={{
                          root: {
                            padding: theme.spacing.m,
                            fontFamily: 'monospace',
                          },
                        }}
                      >
                        {extraItem.text}
                      </Text>
                    ) : (
                      <Text block>{extraItem.text}</Text>
                    )}
                  </>
                );
              })}
            </Stack>
          )}
        </>
      )}
    </>
  );
};
