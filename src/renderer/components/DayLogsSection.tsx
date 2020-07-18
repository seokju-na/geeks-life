import { css } from '@emotion/core';
import React from 'react';
import { Toolbar, ToolbarItem, useToolbarState } from 'reakit';
import { styled } from '../colors/theming';
import { Button } from './Button';
import DayLogsList from './DayLogList';
import { Icon } from './Icon';

export default function DayLogsSection() {
  const toolbar = useToolbarState({ loop: true });

  return (
    <Section>
      <Top>
        <Title>Today{"'"}s Logs</Title>
        <Toolbar {...toolbar} aria-label="Log toolbar" css={toolbarCss}>
          <ToolbarItem {...toolbar} as={Button} variant="icon" size="tiny" aria-label="Add log">
            <Icon name="plus" aria-hidden={true} />
          </ToolbarItem>
        </Toolbar>
      </Top>
      <Content>
        <DayLogsList />
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
