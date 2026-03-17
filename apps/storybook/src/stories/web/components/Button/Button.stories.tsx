import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Button } from '@cre/web-ui';

type Props = React.ComponentProps<typeof Button>;

const meta: Meta<typeof Button> = {
  title: 'Web/Components/Button',
  component: Button,
  parameters: {
    layout: 'centered'
  },
  args: {
    text: 'CRE Button',
    padding: '10px 16px'
  },
  argTypes: {
    text: {
      description: 'Button label text',
      control: 'text'
    },
    padding: {
      description: 'Inner padding (CSS shorthand or number in px)',
      control: 'text'
    },
    disabled: {
      description: 'Disables interactions and uses disabled tokens',
      control: 'boolean'
    },
    colors: {
      description: 'Per-state color overrides (normal/hover/active/disabled)',
      control: 'object'
    },
    onClick: { action: 'clicked' }
  }
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Playground: Story = {};

export const States: Story = {
  render: (args: Props) =>
    React.createElement(
      'div',
      {
        style: {
          display: 'grid',
          gap: 12,
          justifyItems: 'start'
        }
      },
      React.createElement('div', { style: { fontWeight: 700 } }, 'Normal'),
      React.createElement(Button, args),
      React.createElement('div', { style: { fontWeight: 700, marginTop: 8 } }, 'Disabled'),
      React.createElement(Button, { ...args, disabled: true })
    )
};

export const CustomColors: Story = {
  args: {
    text: 'Custom colors',
    colors: {
      normal: { background: '#8A0538', color: '#FFFFFF', borderColor: '#620328' },
      hover: { background: '#760430', color: '#FFFFFF', borderColor: '#4E0220' },
      active: { background: '#620328', color: '#FFFFFF', borderColor: '#3A0118' },
      disabled: { background: '#E5E5E5', color: '#525252', borderColor: '#D4D4D4' }
    }
  }
};
