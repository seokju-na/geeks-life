import { css } from '@emotion/core';
import chunk from 'lodash.chunk';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Composite,
  CompositeGroup,
  CompositeItem,
  unstable_useId as useId,
  useCompositeState,
  VisuallyHidden,
} from 'reakit';
import { EmojiResponse, ipcChannels } from '../../core';
import { Emoji } from '../../core/domain';
import { selectBackground, selectPrimary, styled } from '../colors/theming';
import useIpcListener, { sendIpcMessage } from '../hooks/useIpcListener';
import Dialog, { DialogProps } from './Dialog';
import { FormField, FormFieldInput } from './Form';
import { Icon } from './Icon';
import { VirtualScroll, VirtualScrollItem } from './VirtualScroll';

type Props = Omit<DialogProps, 'children' | 'aria-label'> & {
  children?: never;
};

export default function EmojiDialog(props: Props) {
  const { id: titleId } = useId({ baseId: 'emoji-dialog-title' });
  const [emojis, setEmojis] = useState<Emoji[]>([]);

  const requestEmojisWhenDialogVisible = useCallback(() => {
    sendIpcMessage(ipcChannels.emojiRequest);
  }, []);

  useIpcListener<EmojiResponse>(ipcChannels.emojiResponse, (payload) => {
    if (payload != null) {
      setEmojis(payload.emojis);
    }
  });

  const composite = useCompositeState({ wrap: true });
  const emojiGrid = useMemo(() => chunk(emojis, 10), [emojis]);

  return (
    <Dialog
      {...props}
      css={css`
        width: 85vw;
        max-width: 320px;
      `}
      aria-labelledby={titleId}
      onVisible={requestEmojisWhenDialogVisible}
    >
      <Head>
        <VisuallyHidden as="h1" id={titleId}>
          Emoji Select
        </VisuallyHidden>
        <FormField left={<Icon name="search" />}>
          <FormFieldInput placeholder="Search icons..." />
        </FormField>
      </Head>
      <Body>
        <Composite {...composite} role="grid">
          <VirtualScroll
            itemSize={24}
            width={240}
            height={200}
            style={{
              overflowX: 'visible',
            }}
          >
            {emojiGrid.map((emojiRow, index) => (
              <VirtualScrollItem key={index}>
                <CompositeGroup role="row" {...composite}>
                  {emojiRow.map((emoji) => (
                    <CompositeItem
                      key={emoji.key}
                      as={EmojiItem}
                      {...composite}
                      role="gridcell"
                      title={emoji.key}
                    >
                      {emoji.type === 'native' ? emoji.char : ''}
                    </CompositeItem>
                  ))}
                </CompositeGroup>
              </VirtualScrollItem>
            ))}
          </VirtualScroll>
        </Composite>
      </Body>
    </Dialog>
  );
}

const Head = styled.div`
  display: block;
  padding: 8px 12px;
`;

const Body = styled.div`
  display: block;
  padding: 8px 12px;
`;

const EmojiItem = styled.button`
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 16px;
  border-radius: 0.26rem;
  border: 2px solid transparent;

  &:hover {
    background-color: ${selectBackground('background')};
  }

  &:focus {
    outline: 0;
    border-color: ${selectPrimary(500)};
  }
`;
