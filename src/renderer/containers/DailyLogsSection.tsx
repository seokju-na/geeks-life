import { css } from '@emotion/core';
import React, { HTMLProps, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Toolbar, ToolbarItem, usePopoverState, useToolbarState } from 'reakit';
import { styled } from '../colors/theming';
import { Button } from '../components/Button';
import DailyLogModifyPopover, {
  DailyLogModifyFormValue,
} from '../components/DailyLogModifyPopover';
import { Icon } from '../components/Icon';
import { actions } from '../store/actions';
import { selectors } from '../store/selectors';
import DailyLogList from './DailyLogList';

export default function DailyLogsSection(props: HTMLProps<HTMLDivElement>) {
  const dispatch = useDispatch();
  const isDateToday = useSelector(selectors.isDateToday);
  const categories = useSelector(selectors.dailyLogCategories);
  const emojis = useSelector(selectors.emojis);

  const toolbar = useToolbarState({ loop: true });
  const popover = usePopoverState({ animated: true, placement: 'bottom-end' });

  const title = useMemo(() => {
    if (isDateToday) {
      return `Today's Logs`;
    }

    return 'Logs';
  }, [isDateToday]);

  const handleAddDailyLog = useCallback(
    ({ categoryId, content }: DailyLogModifyFormValue) => {
      dispatch(
        actions.dailyLifeLogs.add({
          payload: {
            categoryId,
            content,
          },
        }),
      );
      popover.hide();
    },
    [dispatch, popover],
  );

  return (
    <Section {...props}>
      <Top>
        <Title>{title}</Title>
        <Toolbar {...toolbar} aria-label="Log toolbar" css={toolbarCss}>
          <DailyLogModifyPopover
            categories={categories}
            emojis={emojis}
            popover={popover}
            disclosure={
              <ToolbarItem {...toolbar} as={Button} variant="icon" size="tiny" aria-label="Add log">
                <Icon name="plus" size="1em" aria-hidden={true} />
              </ToolbarItem>
            }
            onSubmit={handleAddDailyLog}
          />
        </Toolbar>
      </Top>
      <Content>
        <DailyLogList />
      </Content>
    </Section>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
`;

const Top = styled.div`
  flex: none;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h2`
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
`;

const toolbarCss = css`
  display: flex;
  align-items: center;
`;

const Content = styled.div`
  flex: 1 1 auto;
  max-height: 360px;
  overflow-y: auto;
`;
