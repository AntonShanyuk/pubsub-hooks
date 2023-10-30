import React from 'react';
import { Meta } from '@storybook/react';

import { createPubsub, SubjectsStorage } from '../index';


const initialState = { counter: 0 };
enum StateKeys {
  Counter = 'counter',
};

declare global {
  interface Window {
    pubsub: Record<string, SubjectsStorage<typeof initialState>>;
  }
}

window.pubsub = {};

const pubSub = createPubsub<typeof initialState, StateKeys>(initialState, window.pubsub);

const Incrementer = () => {
  const increment = pubSub.usePub(StateKeys.Counter, x => x + 1);

  return (
    <button onClick={increment}>Increment</button>
  );
}

const Decrementer = () => {
  const decrement = pubSub.usePub(StateKeys.Counter, x => x - 1);

  return (
    <button onClick={decrement}>Decrement</button>
  );
}

const Static = () => {
  const update = pubSub.usePub(StateKeys.Counter, () => 42);

  return (
    <button onClick={update}>Set 42</button>
  );
}

const Subscriber = () => {
  const counter = pubSub.useSub(StateKeys.Counter);

  return (
    <div>{counter}</div>
  );
}

export const PubSub = () => {
  return (
    <>
      <div>
        <Incrementer />
        <Decrementer />
        <Static />
      </div>
      <div>
        <br />
        <Subscriber />
      </div>
    </>
  );
}

const meta = {
  title: 'PubSub example',
  component: PubSub,
} satisfies Meta<typeof PubSub>;

export default meta;