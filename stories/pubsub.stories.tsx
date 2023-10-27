import React from 'react';
import { createPubsub } from '../index';
import { Meta } from '@storybook/react';

const pubSub = createPubsub({ counter: 0 });

const Incrementer = () => {
  const increment = pubSub.usePub('counter', x => x + 1);

  return (
    <button onClick={increment}>Increment</button>
  );
}

const Decrementer = () => {
  const decrement = pubSub.usePub('counter', x => x - 1);

  return (
    <button onClick={decrement}>Decrement</button>
  );
}

const Static = () => {
  const update = pubSub.usePub('counter', () => 42);

  return (
    <button onClick={update}>Set 42</button>
  );
}

const Subscriber = () => {
  const counter = pubSub.useSub('counter');

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