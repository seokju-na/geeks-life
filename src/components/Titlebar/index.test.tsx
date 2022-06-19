import { waitFor, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { mockStore } from '../../testing/mocks';
import { renderWithTestBed } from '../../testing/render';
import { Titlebar } from './index';

describe('<Titlbar />', () => {
  it('has "data-tauri-drag-region" attribute', async () => {
    const { container } = renderWithTestBed(<Titlebar />);
    await waitFor(() => {
      expect(container.querySelector('[data-tauri-drag-region]')).not.toBeNull();
    });
  });

  it('render "26th Week of 2022" as heading if selected date is "Jun 18, 2022" and daily life view is "week".', async () => {
    mockStore('.local').set('selectedData', '2022-06-18T10:00:00.0Z').set('dailyLifeView', 'week');

    renderWithTestBed(<Titlebar />);
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('26th Week of 2022');
  });

  it('render "Jun 2022" as heading if selected date is "Jun 18, 2022" and daily life view is "month".', async () => {
    mockStore('.local').set('selectedData', '2022-06-18T00:00:00.0Z').set('dailyLifeView', 'month');

    renderWithTestBed(<Titlebar />);
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('Jun 2022');
  });
});
