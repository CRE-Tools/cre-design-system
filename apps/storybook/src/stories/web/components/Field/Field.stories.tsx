import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Field, Input, Select, Stack } from '@cre/web-ui';

const meta: Meta<typeof Field> = {
  title: 'Web/Components/Field',
  component: Field,
  parameters: { layout: 'padded', docs: { page: null } },
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
    htmlFor: { control: 'text' },
    children: { control: false },
    className: { control: false },
    style: { control: false },
  },
  args: {
    label: 'Label',
    description: 'This is help text',
    error: '',
    required: false,
    htmlFor: 'field-playground',
  },
};

export default meta;

type Story = StoryObj<typeof Field>;

export const Playground: Story = {
  render: (args) => {
    return (
      <Field
        {...args}
        error={args.error ? args.error : undefined}
      >
        <Input id={args.htmlFor} placeholder="Type…" />
      </Field>
    );
  },
};

export const WithInput: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Field label="Name" description="This is help text" htmlFor="field-name">
        <Input id="field-name" value={value} onChange={setValue} placeholder="Type…" />
      </Field>
    );
  },
};

export const WithSelect: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Stack gap="micro">
        <Field label="Category" description="Pick one" htmlFor="field-category">
          <Select
            id="field-category"
            value={value}
            onChange={setValue}
            placeholder="Select…"
            options={[
              { value: 'a', label: 'Option A' },
              { value: 'b', label: 'Option B' },
              { value: 'c', label: 'Option C' },
            ]}
          />
        </Field>
        <Field label="With error" error="Something is wrong" htmlFor="field-error">
          <Input id="field-error" placeholder="…" />
        </Field>
      </Stack>
    );
  },
};
