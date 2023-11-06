import { BehaviorSubject } from 'rxjs';
import { useCallback, useState, useEffect } from 'react';

export function getSubject<T extends PubsubRecord, U extends  keyof T = keyof T>(
  name: U,
  defaults: T,
  storage:  SubjectsStorage<T, U>,
): BehaviorSubject<T[U]> {
  if (!storage[name]) {
    storage[name] = new BehaviorSubject<T[U]>(defaults[name] as T[U]);
  }
  return storage[name] as BehaviorSubject<T[U]>;
}

export type PubsubRecord = Record<string | number | symbol, unknown>;
export type SubjectsStorage<TState extends PubsubRecord, TKey extends  keyof TState = keyof TState> =
  Record<TKey, BehaviorSubject<TState[TKey]>>;

export type Pubsub<TState extends PubsubRecord, TKey extends keyof TState = keyof TState> = {
  usePub<TValue extends TKey = TKey>(name: TValue, callback: (value: TState[TValue]) => TState[TValue]): () => void;
  usePub<TValue extends TKey = TKey>(name: TValue): (value: TState[TValue]) => void;
  useSub<TValue extends TKey = TKey>(name: TValue): TState[TValue];
};

export const createPubsub = <TState extends PubsubRecord, TKey extends keyof TState = keyof TState>(
  defaults: TState,
  storage: (SubjectsStorage<TState, TKey> | object) = {},
): Pubsub<TState, TKey> => {

  return {
    usePub<TValue extends TKey = TKey>(name: TValue, callback?: (value: TState[TValue]) => TState[TValue]) {
      const subject = getSubject<TState>(name, defaults, storage as SubjectsStorage<TState, keyof TState>);
      
      return useCallback((value?: TState[TValue]) => {
        const currentValue = subject.getValue() as TState[TValue];

        const nextValue = callback ? callback(currentValue) : value;
        
        if (nextValue !== currentValue) {
          subject.next(nextValue);
        }
      }, [subject, callback])
    },
    useSub<TValue extends TKey = TKey>(name: TKey): TState[TValue] {
      const subject = getSubject<TState>(name, defaults, storage as SubjectsStorage<TState, keyof TState>);
    
      const [state, setState] = useState<TState[TValue]>(subject.getValue() as TState[TValue]);
    
      useEffect(() => {
        const subscription = subject.subscribe(setState as ((value: TState[TValue]) => void));
    
        return () => subscription.unsubscribe();
      }, [subject, setState]);
    
      return state;
    }
  }
}