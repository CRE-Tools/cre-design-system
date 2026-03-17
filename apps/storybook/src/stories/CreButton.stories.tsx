import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Button } from '@cre/web-ui';

const meta: Meta<typeof Button> = {
  title: 'CRE Web UI/Button',
  component: Button,
  args: {
    text: 'CRE Button',
    padding: '10px 16px'
  },
  argTypes: {
    text: { control: 'text' },
    padding: { control: 'text' },
    disabled: { control: 'boolean' }
  }
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};

export const CustomColors: Story = {
  args: {
    colors: {
      normal: { background: '#8A0538', color: '#FFFFFF', borderColor: '#620328' },
      hover: { background: '#760430', color: '#FFFFFF', borderColor: '#4E0220' },
      active: { background: '#620328', color: '#FFFFFF', borderColor: '#3A0118' },
      disabled: { background: '#E5E5E5', color: '#525252', borderColor: '#D4D4D4' }
    }
  }
};
