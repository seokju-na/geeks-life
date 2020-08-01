import { css } from '@emotion/core';
import React, { HTMLProps } from 'react';
import { useSelector } from 'react-redux';
import { Toolbar, ToolbarItem, useToolbarState } from 'reakit';
import { selectForeground, styled } from '../colors/theming';
import { Button } from '../components/Button';
import DailyLogList from '../components/DailyLogList';
import { Icon } from '../components/Icon';
import { selectors } from '../store/selectors';

export default function DailyLogsSection(props: HTMLProps<HTMLDivElement>) {
  const logs = useSelector(selectors.currentDailyLifeLogs);
  const categories = useSelector(selectors.dailyLogCategories);
  const emojis = useSelector(selectors.emojis);
  const toolbar = useToolbarState({ loop: true });

  return (
    <Section {...props}>
      <Top>
        <Title>Today{"'"}s Logs</Title>
        <Toolbar {...toolbar} aria-label="Log toolbar" css={toolbarCss}>
          <ToolbarItem {...toolbar} as={Button} variant="icon" size="tiny" aria-label="Add log">
            <Icon name="plus" size="1em" aria-hidden={true} />
          </ToolbarItem>
        </Toolbar>
      </Top>
      <Content>
        {logs.length === 0 ? (
          <Empty>No Logs</Empty>
        ) : (
          <DailyLogList logs={logs} categories={categories} emojis={emojis} />
        )}
      </Content>
    </Section>
  );
}

const Section = styled.section``;

const Top = styled.div`
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
  padding: 8px 12px;
`;

const Empty = styled.p`
  margin: 0;
  padding: 32px 0;
  font-size: 1rem;
  font-weight: 400;
  text-align: center;
  color: ${selectForeground('disabledText')};
`;
