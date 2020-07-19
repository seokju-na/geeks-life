import { css } from '@emotion/core';
import { format } from 'date-fns';
import React from 'react';
import { useSelector } from 'react-redux';
import { Toolbar, ToolbarItem, unstable_useId as useId, useToolbarState } from 'reakit';
import { selectForeground, styled, useTheme } from '../colors/theming';
import { Button } from '../components/Button';
import { selectors } from '../store/selectors';

export default function FixedBottomToolbar() {
  const { id } = useId({
    baseId: 'gl-select-day-toolbar',
  });
  const date = useSelector(selectors.date);
  const theme = useTheme();
  const toolbar = useToolbarState({ loop: true });

  return (
    <Toolbar
      {...toolbar}
      aria-labelledby={id}
      css={css`
        ${toolbarCss};
        background-color: ${theme.background.backgroundHighlighted};
      `}
    >
      <Title id={id}>No Changes at {format(new Date(date), 'd MMM, yyyy')}</Title>
      <ToolbarItem {...toolbar} as={Button} size="tiny" color="primary" disabled={true}>
        Commit (⌘+S)
      </ToolbarItem>
    </Toolbar>
  );
}

const toolbarCss = css`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 4px 4px 4px 12px;
  justify-content: space-between;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${selectForeground('text')};
`;
