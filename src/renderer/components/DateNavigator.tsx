import { css } from '@emotion/core';
import React, { useState } from 'react';
import { Composite, CompositeItem, useCompositeState } from 'reakit';
import { colorPalettes } from '../colors/palette';
import { selectBackground, selectForeground, selectPrimary, styled } from '../colors/theming';
import { Button } from './Button';
import { ButtonToggle, ButtonToggleGroup } from './ButtonToggle';

export default function DateNavigator() {
  const composite = useCompositeState({ loop: true });
  const [page, setPage] = useState(0);

  return (
    <Wrapper>
      <Top>
        <Title>1st Week, July 2020</Title>
        <ButtonToggleGroup name="보기" aria-label="보기" size="small" value="week">
          <ButtonToggle value="week">Week</ButtonToggle>
          <ButtonToggle value="month">Month</ButtonToggle>
        </ButtonToggleGroup>
      </Top>
      <Composite {...composite} as="nav" css={navCss}>
        <CompositeItem
          {...composite}
          as={WeekButton}
          style={{ backgroundColor: colorPalettes.green['300'] }}
          aria-current={page === 0}
          onClick={() => setPage(0)}
        />
        <CompositeItem
          {...composite}
          as={WeekButton}
          style={{ backgroundColor: colorPalettes.green['500'] }}
          aria-current={page === 1}
          onClick={() => setPage(1)}
        />
        <CompositeItem
          {...composite}
          as={WeekButton}
          style={{ backgroundColor: colorPalettes.green['100'] }}
          aria-current={page === 2}
          onClick={() => setPage(2)}
        />
        <CompositeItem
          {...composite}
          as={WeekButton}
          style={{ backgroundColor: colorPalettes.green['700'] }}
          aria-current={page === 3}
          onClick={() => setPage(3)}
        />
        <CompositeItem
          {...composite}
          as={WeekButton}
          style={{ backgroundColor: colorPalettes.green['300'] }}
          aria-current={page === 4}
          onClick={() => setPage(4)}
        />
        <CompositeItem
          {...composite}
          as={WeekButton}
          onClick={() => setPage(5)}
          aria-current={page === 5}
        />
        <CompositeItem
          {...composite}
          as={WeekButton}
          disabled={true}
          onClick={() => setPage(6)}
          aria-current={page === 6}
        />
      </Composite>
    </Wrapper>
  );
}

const Wrapper = styled.header`
  border-bottom: 1px solid ${selectForeground('divider')};
`;

const Top = styled.div`
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  //noinspection CssUnknownProperty
  -webkit-app-region: drag;
`;

const Title = styled.h1`
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
`;

const navCss = css`
  display: flex;
  align-items: center;
  margin: 0 -4px;
  padding: 4px 12px 12px 12px;
`;

const WeekButton = styled(Button)`
  flex: 1 1 auto;
  margin: 0 4px;
  border: 1px solid ${selectForeground('divider')};
  background-color: ${selectBackground('backgroundHighlighted')};
  padding: 0;

  &:disabled {
    background-color: transparent;
  }

  &[aria-current='true'] {
    box-shadow: ${selectPrimary()} 0px 0px 0px 0.175em;

    &:focus {
      box-shadow: ${selectPrimary()} 0px 0px 0px 0.2em;
    }
  }
`;
