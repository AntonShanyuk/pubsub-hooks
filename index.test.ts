import { BehaviorSubject } from 'rxjs';
import { getSubject, SubjectsStorage, createPubsub } from './index';
import { act, renderHook } from '@testing-library/react'

type State = {
  counter: number
};
let initialState: State;
let storage: SubjectsStorage<State>;
beforeEach(() => {
  initialState = { counter: 0 };
  storage = {} as SubjectsStorage<State>;
});

describe('unittests', () => {
  test('getSubject creates property in storage', () => {
    const subject = getSubject('counter', initialState, storage);
  
    expect(subject).toBeInstanceOf(BehaviorSubject);
    expect(storage.counter).toBe(subject);
  });
  
  test('usePub with single parameter returns callback to set value', () => {
    const pubsub = createPubsub(initialState, storage);
  
    const hook = renderHook(() => pubsub.usePub('counter'));
  
    act(() => hook.result.current(42));
  
    expect(storage.counter.getValue()).toEqual(42);
  });
  
  test('usePub with two parameters returns callback without arguments', () => {
    const pubsub = createPubsub(initialState, storage);
  
    const hook = renderHook(() => pubsub.usePub('counter', x => x + 34));
  
    act(() => hook.result.current());
  
    expect(storage.counter.getValue()).toEqual(34);
  });

  test('useSub returns default value', () => {
    const pubsub = createPubsub(initialState, storage);

    const hook = renderHook(() => pubsub.useSub('counter'));

    expect(hook.result.current).toEqual(0);
  });

  test('useSub returns updated value', () => {
    const pubsub = createPubsub(initialState, storage);

    const hook = renderHook(() => pubsub.useSub('counter'));
    act(() => storage.counter.next(12));

    expect(hook.result.current).toEqual(12);
  });
});

describe('acceptance tests', () => {
  test('useSub + usPub: increment', async () => {
    const pubsub = createPubsub(initialState, storage);

    const useSub = renderHook(() => pubsub.useSub('counter'));
    const usePub = renderHook(() => pubsub.usePub('counter', x => x + 1));

    expect(useSub.result.current).toEqual(0);

    act(() => usePub.result.current());

    expect(useSub.result.current).toEqual(1);
  });

  test('useSub + usPub: set value in callback', async () => {
    const pubsub = createPubsub(initialState, storage);

    const useSub = renderHook(() => pubsub.useSub('counter'));
    const usePub = renderHook(() => pubsub.usePub('counter'));

    expect(useSub.result.current).toEqual(0);

    act(() => usePub.result.current(34));

    expect(useSub.result.current).toEqual(34);
  });

  test('useSub + usPub: set static value', async () => {
    const pubsub = createPubsub(initialState, storage);

    const useSub = renderHook(() => pubsub.useSub('counter'));
    const usePub = renderHook(() => pubsub.usePub('counter', () => 42));

    expect(useSub.result.current).toEqual(0);

    act(() => usePub.result.current());

    expect(useSub.result.current).toEqual(42);
  });
});

