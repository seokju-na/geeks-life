import { css } from '@emotion/core';
import React, { ComponentProps, memo, MouseEvent, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Composite, CompositeItem, useCompositeState, usePopoverState } from 'reakit';
import { DailyLog, DailyLogCategory, Emoji as EmojiModel } from '../../core/domain';
import { selectForeground, styled, useTheme } from '../colors/theming';
import DailyLogModifyPopover, {
  DailyLogModifyFormValue,
} from '../components/DailyLogModifyPopover';
import { Emoji } from '../components/Emoji';
import { getElectronFeatures } from '../electron-features';
import { actions } from '../store/actions';
import { selectors } from '../store/selectors';

type DailyLogListItemProps = Omit<ComponentProps<typeof CompositeItem>, 'as' | 'children'> & {
  log: DailyLog;
  category: DailyLogCategory;
  emoji?: EmojiModel;
  children?: never;
};

const { Menu, MenuItem } = getElectronFeatures();

function DailyLogListItem({ log, category, emoji, ...props }: DailyLogListItemProps) {
  const theme = useTheme();

  if (category == null) {
    return null;
  }

  return (
    <CompositeItem
      as={'div' as any}
      onClick={(event: MouseEvent<HTMLDivElement>) => {
        // Don't show popover when clicked.
        event.preventDefault();
      }}
      css={css`
        display: flex;
        width: 100%;
        align-items: center;
        padding: 8px 0;
        transition: box-shadow 0.15s ease-in-out 0s;
        cursor: default;

        &:not(:first-of-type) {
          border-top: 1px solid ${theme.foreground.divider};
        }

        &:first-of-type {
          border-top-left-radius: 0.25rem;
          border-top-right-radius: 0.25rem;
        }

        &:last-of-type {
          border-bottom-left-radius: 0.25rem;
          border-bottom-right-radius: 0.25rem;
        }

        &:focus {
          outline: 0;
          box-shadow: ${theme.primary['300']} 0px 0px 0px 0.175rem;
        }
      `}
      {...props}
    >
      {emoji != null ? (
        <ListItemLeft>
          <Emoji emoji={emoji} title={category.title} />
        </ListItemLeft>
      ) : null}
      <ListItemContent showLeftBorder={emoji != null}>{log.content}</ListItemContent>
    </CompositeItem>
  );
}

const ListItemLeft = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0 8px;
  cursor: default;
`;

const ListItemContent = styled.p<{ showLeftBorder: boolean }>`
  margin: 0;
  padding: 0 12px;
  flex: 1 1 auto;
  font-size: 0.875rem;
  ${({ showLeftBorder, theme }) =>
    showLeftBorder ? `border-left: 1px solid ${theme.foreground.divider}` : ''};
`;

function DailyLogList() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const logs = useSelector(selectors.currentDailyLifeLogs);
  const categories = useSelector(selectors.dailyLogCategories);
  const emojis = useSelector(selectors.emojis);
  const showEditPopover = useSelector(selectors.showEditDailyLifeLogPopover);

  const editPopover = usePopoverState({
    animated: true,
    placement: 'bottom',
  });
  const composite = useCompositeState({ wrap: 'vertical', loop: 'vertical' });

  const currentLog = useMemo(() => logs.find((log) => log.id === composite.currentId), [
    logs,
    composite,
  ]);

  useEffect(() => {
    const target = composite.items.find((item) => item.id === composite.currentId);

    if (target != null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (editPopover.unstable_referenceRef as any).current = target.ref.current;
    }
  }, [editPopover, composite]);

  const handleLogEdit = useCallback(
    (value: DailyLogModifyFormValue) => {
      if (currentLog == null) {
        return;
      }

      dispatch(actions.dailyLifeLogs.edit({ id: currentLog.id, payload: value }));
      editPopover.hide();
    },
    [dispatch, currentLog, editPopover],
  );

  useEffect(() => {
    if (currentLog != null && showEditPopover) {
      editPopover.show();
    }
  }, [currentLog, showEditPopover, editPopover]);

  useEffect(() => {
    if (!editPopover.visible) {
      dispatch(actions.editDailyLifeLogPopover.hide());
    }
  }, [editPopover, dispatch]);

  const handleContextMenu = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.preventDefault();

      const id = event.currentTarget.id;
      const menu = new Menu();

      menu.append(
        new MenuItem({
          label: 'Edit',
          click() {
            dispatch(actions.editDailyLifeLogPopover.show());
          },
        }),
      );

      menu.append(
        new MenuItem({
          label: 'Delete',
          click() {
            dispatch(actions.dailyLifeLogs.delete({ id }));
          },
        }),
      );

      menu.popup();
    },
    [dispatch],
  );

  if (logs.length === 0) {
    return <Empty>No Logs</Empty>;
  }

  return (
    <ListWrapper>
      <DailyLogModifyPopover
        popover={editPopover}
        categories={categories}
        emojis={emojis}
        initialCategoryId={currentLog?.categoryId}
        initialLogContent={currentLog?.content}
        ctaIcon="pencil"
        ctaTitle="Edit Log"
        onSubmit={handleLogEdit}
      />
      <Composite
        {...composite}
        css={css`
          display: block;
          border-radius: 0.25rem;
          background-color: ${theme.background.backgroundHighlighted};
          border: 1px solid ${theme.foreground.divider};
        `}
      >
        {logs.map((log) => {
          const category = categories.find((x) => x.id === log.categoryId);
          const emoji = emojis.find((x) => x.key === category?.emojiKey);

          if (category == null) {
            return null;
          }

          return (
            <DailyLogListItem
              key={log.id}
              id={log.id}
              log={log}
              category={category}
              emoji={emoji}
              onContextMenu={handleContextMenu}
              {...composite}
            />
          );
        })}
      </Composite>
    </ListWrapper>
  );
}

export default memo(DailyLogList);

const Empty = styled.p`
  margin: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 0;
  font-size: 1rem;
  font-weight: 400;
  text-align: center;
  color: ${selectForeground('disabledText')};
`;

const ListWrapper = styled.div`
  padding: 8px 12px;
`;
