import { BehaviorSubject } from 'rxjs';
import { useCallback, useState, useEffect } from 'react';

function getSubject<T extends PubsubRecord, U extends  keyof T = keyof T>(
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
export type SubjectsStorage<T extends PubsubRecord, U extends  keyof T = keyof T> =
  Record<U, BehaviorSubject<T[U]>>;

export type Pubsub<T extends PubsubRecord> = {
  usePub<U extends keyof T>(name: U, callback: (value: T[U]) => T[U]): () => void;
  useSub<U extends keyof T>(name: U): T[U];
};

export const createPubsub = <T extends PubsubRecord, U extends keyof T = keyof T>(
  defaults: T,
  storage: (SubjectsStorage<T, U> | {}) = {},
): Pubsub<T> => {

  return {
    usePub<U extends keyof T>(name: U, callback: (value: T[U]) => T[U]) {
      const subject = getSubject<T>(name, defaults, storage as SubjectsStorage<T, keyof T>);
      
      return useCallback(() => {
        const currentValue = subject.getValue() as T[U];
        const nextValue = callback(currentValue);
        
        if (nextValue !== currentValue) {
          subject.next(nextValue);
        }
      }, [subject, callback])
    },
    useSub<U extends keyof T>(name: U): T[U] {
      const subject = getSubject<T>(name, defaults, storage as SubjectsStorage<T, keyof T>);
    
      const [state, setState] = useState<T[U]>(subject.getValue() as T[U]);
    
      useEffect(() => {
        const subscription = subject.subscribe(setState as ((value: T[U]) => void));
    
        return () => subscription.unsubscribe();
      }, [subject, setState]);
    
      return state;
    }
  }
}