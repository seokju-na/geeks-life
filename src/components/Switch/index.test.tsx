import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Switch } from './index';

type Value = 'a' | 'b' | 'c';

describe('<Switch />', () => {
  it('render case by value', () => {
    const value = 'a' as Value;

    render(
      <Switch
        value={value}
        caseBy={{
          a: <div>A</div>,
          b: <div>B</div>,
          c: <div>C</div>,
        }}
      />
    );

    expect(screen.getByText('A')).toBeInTheDocument();
  });
});
