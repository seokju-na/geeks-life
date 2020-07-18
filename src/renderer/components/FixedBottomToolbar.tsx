import { css } from '@emotion/core';
import React from 'react';
import { Toolbar, ToolbarItem, unstable_useId as useId, useToolbarState } from 'reakit';
import { selectForeground, styled, useTheme } from '../colors/theming';
import { Button } from './Button';

export default function FixedBottomToolbar() {
  const { id } = useId({
    baseId: 'gl-select-day-toolbar',
  });
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
      <Title id={id}>Changes at 23 July, 2020</Title>
      <ToolbarItem {...toolbar} as={Button} size="tiny" color="primary">
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
