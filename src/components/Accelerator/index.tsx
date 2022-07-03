import hotkeys from 'hotkeys-js';
import { ReactElement, Children, cloneElement, useEffect } from 'react';
import { usePreservedCallback, usePlatform, Platform } from '../../hooks';
import { NonEmptyArray } from '../../utils/array';
import { noop } from '../../utils/noop';

type Modifiers = 'CmdOrCtrl' | 'Ctrl' | 'Alt' | 'Shift';
type SpecialKeys = 'Backspace' | 'Tab' | 'Enter' | 'Esc' | 'Up' | 'Down' | 'Left' | 'Right' | 'Delete';
type KeyboardShortcut = Modifiers | SpecialKeys | string;

interface Props {
  shortcut: NonEmptyArray<KeyboardShortcut>;
  onKeyPress?: () => void;
  children: ReactElement;
}

export function Accelerator({ shortcut, onKeyPress = noop, children }: Props) {
  if (shortcut.length === 0) {
    throw new Error('Accelerator key cannot be empty');
  }

  const platform = usePlatform();
  const handleKeyPress = usePreservedCallback(onKeyPress);
  const hotkey = createHotkey(shortcut, platform);
  const hotkeyLabel = formatHotkey(shortcut, platform);

  const child = Children.only(children);
  const cloned = cloneElement(Children.only(children), {
    ...child.props,
    onClick: (...args: unknown[]) => {
      child.props.onClick?.(...args);
      handleKeyPress();
    },
    'aria-label': `${child.props['aria-label'] ?? ''} (${hotkeyLabel})`.trimStart(),
  });

  const disabled = cloned.props.disabled ?? false;

  useEffect(() => {
    if (disabled) {
      hotkeys.unbind(hotkey, handleKeyPress);
      return;
    }

    hotkeys(hotkey, handleKeyPress);
    return () => {
      hotkeys.unbind(hotkey, handleKeyPress);
    };
  }, [disabled, hotkey, handleKeyPress]);

  return <>{cloned}</>;
}

function createHotkey(shortcut: KeyboardShortcut[], platform: Platform) {
  const keys = shortcut.map(x => {
    if (x === 'CmdOrCtrl') {
      return platform === 'macOS' ? 'command' : 'ctrl';
    }
    return x.toLowerCase();
  });

  return keys.join('+');
}

function formatHotkey(shortcut: KeyboardShortcut[], platform: Platform) {
  const keys = shortcut.map(x => {
    const transform = transforms.find(t => t[0] === x);
    return transform?.[1][platform] ?? x;
  });
  return keys.join('+');
}

const transforms: Array<[string, { macOS?: string; linux?: string; windows?: string }]> = [
  [
    'CmdOrCtrl',
    {
      macOS: '⌘',
      linux: 'Ctrl',
      windows: 'Ctrl',
    },
  ],
  ['Ctrl', { macOS: '⌃' }],
  ['Alt', { macOS: '⌥' }], // alternative to option
  ['Shift', { macOS: '⇧' }],
  ['Delete', { macOS: '⌫' }],
];
