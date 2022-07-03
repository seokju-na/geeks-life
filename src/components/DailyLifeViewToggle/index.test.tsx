import { screen } from '@testing-library/dom';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { mockStore } from '../../testing/mocks';
import { renderWithTestBed } from '../../testing/render';
import { DailyLifeViewToggle } from './index';

describe('<DailyLifeViewToggle />', () => {
  it('initially toggled with "Weekly" if state from store was empty.', async () => {
    mockStore('.local').set('dailyLifeView', null);
    renderWithTestBed(<DailyLifeViewToggle />);

    expect(await screen.findByRole('radio', { name: 'Weekly' })).toBeChecked();
  });

  it('click button to update state.', async () => {
    const store = mockStore('.local').set('dailyLifeView', 'week');
    renderWithTestBed(<DailyLifeViewToggle />);

    await waitFor(() => {
      expect(screen.getByRole('radio', { name: 'Weekly' })).toBeChecked();
    });
    await userEvent.click(screen.getByRole('radio', { name: 'Monthly' }));

    await waitFor(() => {
      expect(screen.getByRole('radio', { name: 'Monthly' })).toBeChecked();
    });
    expect(store.get('dailyLifeView')).toEqual('month');
  });

  it('not un-toggled when click toggled state.', async () => {
    const store = mockStore('.local').set('dailyLifeView', 'week');
    renderWithTestBed(<DailyLifeViewToggle />);

    const toggle = await screen.findByRole('radio', { name: 'Weekly' });
    await userEvent.click(toggle);

    expect(await screen.findByRole('radio', { name: 'Weekly' })).toBeChecked();
    expect(store.get('dailyLifeView')).toEqual('week');
  });
});
