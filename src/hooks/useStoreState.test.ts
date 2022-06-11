import { act } from '@testing-library/react-hooks';
import { it, expect } from 'vitest';
import { mockStore } from '../testing/mocks';
import { renderHookWithTestBed } from '../testing/render';
import { useStoreState } from './useStoreState';

it('get value', async () => {
  mockStore('store').set('key', 'hello');

  const { result, waitFor } = renderHookWithTestBed(() => useStoreState('store', 'key'));
  await waitFor(() => {
    expect(result.current.value).toEqual('hello');
  });
});

it('set value', async () => {
  mockStore('store').set('key', 'A');

  const { result, waitFor } = renderHookWithTestBed(() => useStoreState('store', 'key'));
  await waitFor(() => expect(result.current.value).toEqual('A'));

  act(() => {
    result.current.setValue('B');
  });
  await waitFor(() => expect(result.current.value).toEqual('B'));
});

it('delete value', async () => {
  mockStore('store').set('key', 'A');

  const { result, waitFor } = renderHookWithTestBed(() => useStoreState('store', 'key'));
  await waitFor(() => expect(result.current.value).toEqual('A'));

  act(() => {
    result.current.deleteValue();
  });
  await waitFor(() => expect(result.current.value).toEqual(null));
});
