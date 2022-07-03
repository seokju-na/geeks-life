import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, describe, it, vi } from 'vitest';
import { mockPlatform } from '../../testing/mocks';
import { renderWithTestBed } from '../../testing/render';
import { Accelerator } from './index';

describe('<Accelerator />', () => {
  it('(macOS) append hotkey label on "aria-label" attribute', async () => {
    mockPlatform('macOS');
    renderWithTestBed(
      <Accelerator shortcut={['CmdOrCtrl', 'A']}>
        <button aria-label="Add" />
      </Accelerator>
    );
    expect(await screen.findByRole('button')).toHaveAttribute('aria-label', 'Add (⌘+A)');
  });

  it('(linux) append hotkey label on "aria-label" attribute', async () => {
    mockPlatform('linux');
    renderWithTestBed(
      <Accelerator shortcut={['CmdOrCtrl', 'A']}>
        <button aria-label="Add" />
      </Accelerator>
    );
    expect(await screen.findByRole('button')).toHaveAttribute('aria-label', 'Add (Ctrl+A)');
  });

  it('(windows) append hotkey label on "aria-label" attribute', async () => {
    mockPlatform('windows');
    renderWithTestBed(
      <Accelerator shortcut={['CmdOrCtrl', 'A']}>
        <button aria-label="Add" />
      </Accelerator>
    );
    expect(await screen.findByRole('button')).toHaveAttribute('aria-label', 'Add (Ctrl+A)');
  });

  it('call "onKeyPress" on click', async () => {
    const onKeyPress = vi.fn();

    mockPlatform('macOS');
    renderWithTestBed(
      <Accelerator shortcut={['CmdOrCtrl', 'K']} onKeyPress={onKeyPress}>
        <button aria-label="Click me" />
      </Accelerator>
    );
    const button = await screen.findByRole('button');
    await userEvent.click(button);

    expect(onKeyPress).toHaveBeenCalled();
  });
});
