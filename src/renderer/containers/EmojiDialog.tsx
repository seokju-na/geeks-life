import { css } from '@emotion/core';
import chunk from 'lodash.chunk';
import React, { KeyboardEvent, memo, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  Composite,
  CompositeGroup,
  CompositeItem,
  unstable_useId as useId,
  useCompositeState,
  useDialogState,
} from 'reakit';
import { Emoji } from '../../core/domain';
import { selectBackground, selectPrimary, styled } from '../colors/theming';
import { eventKeys } from '../constants/event-keys';
import { selectors } from '../store/selectors';
import Dialog, { DialogContent, DialogHead, DialogProps, DialogTitle } from '../components/Dialog';
import { FormField, FormFieldInput } from '../components/Form';
import { Icon } from '../components/Icon';
import { VirtualScroll, VirtualScrollItem } from '../components/VirtualScroll';

type Props = Pick<DialogProps, 'disclosure'>;

export default function EmojiDialog(props: Props) {
  const emojis = useSelector(selectors.emojis);
  const dialog = useDialogState({ animated: true });

  return (
    <Dialog
      {...props}
      dialog={dialog}
      css={css`
        width: 85vw;
        max-width: 320px;
      `}
    >
      <SelectView emojis={emojis} />
    </Dialog>
  );
}

const SelectView = memo<{
  emojis: Emoji[];
}>((props) => {
  const { emojis } = props;

  const composite = useCompositeState({ wrap: true });
  const emojiGrid = useMemo(() => chunk(emojis, 10), [emojis]);
  const { id: boxId } = useId({ baseId: 'emoji-select-box' });

  const handleSearchKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      switch (event.key) {
        case eventKeys.ArrowDown:
          if (composite.currentId != null) {
            composite.move(composite.currentId);
          } else {
            composite.first();
          }
          event.preventDefault();
          break;
      }
    },
    [composite],
  );

  return (
    <>
      <DialogHead>
        <DialogTitle hidden={true}>Select Emoji</DialogTitle>
        <FormField left={<Icon name="search" aria-hidden={true} />}>
          <FormFieldInput
            placeholder="Search icons..."
            aria-owns={boxId}
            aria-activedescendant={composite.currentId ?? undefined}
            onKeyDown={handleSearchKeyDown}
          />
        </FormField>
      </DialogHead>
      <DialogContent>
        <Composite {...composite} role="grid" id={boxId}>
          <VirtualScroll itemSize={24} width={240} height={200}>
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
      </DialogContent>
      {/*<DialogActions>*/}
      {/*  <Button onClick={onAddButtonClick}>*/}
      {/*    <Icon name="plus" aria-hidden={true} />*/}
      {/*    Add Emoji*/}
      {/*  </Button>*/}
      {/*</DialogActions>*/}
    </>
  );
});

// TODO
// const AddView = memo<{
//   onCancelButtonClick(): void;
// }>((props) => {
//   const { onCancelButtonClick } = props;
//
//   return (
//     <>
//       <DialogHead>
//         <DialogTitle>Add Emoji</DialogTitle>
//       </DialogHead>
//       <DialogContent>
//         <div>
//           <FormField>
//             <FormFieldLabel>Emoji Name</FormFieldLabel>
//             <FormFieldInput placeholder="Input emoji name" maxLength={100} />
//           </FormField>
//         </div>
//       </DialogContent>
//       <DialogActions>
//         <Button size="small" onClick={onCancelButtonClick}>
//           Cancel
//         </Button>
//         <Button size="small" color="primary">
//           Add
//         </Button>
//       </DialogActions>
//     </>
//   );
// });

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
