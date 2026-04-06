import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Card, DateRangeFilter, type DateRangeValue, Inline, Stack, Text } from '@cre/web-ui';

const meta: Meta<typeof DateRangeFilter> = {
  title: 'Web/Components/DateRangeFilter',
  component: DateRangeFilter,
  parameters: { layout: 'centered', docs: { page: null } },
  argTypes: {
    value: { control: false },
    defaultValue: { control: false },
    onChange: { action: 'changed' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    triggerVariant: { control: 'radio', options: ['field', 'icon'] },
    className: { control: false },
    style: { control: false },
  },
  args: {
    disabled: false,
    placeholder: 'Created',
    triggerVariant: 'field',
  },
};

export default meta;

type Story = StoryObj<typeof DateRangeFilter>;

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = useState<DateRangeValue>({ startMs: null, endMs: null });

    return (
      <Stack gap="nano">
        <DateRangeFilter
          {...args}
          value={value}
          onChange={(next) => {
            args.onChange?.(next);
            setValue(next);
          }}
        />
        <Text as="p" tone="muted">
          Value: {value.startMs ?? 'null'} — {value.endMs ?? 'null'}
        </Text>
      </Stack>
    );
  },
};

export const AllStates: Story = {
  render: () => {
    const now = Date.now();
    const lastWeek = now - 7 * 24 * 60 * 60 * 1000;
    const yesterday = now - 1 * 24 * 60 * 60 * 1000;

    return (
      <Card>
        <Stack gap="micro">
          <Inline gap="nano" align="center" wrap>
            <DateRangeFilter value={{ startMs: null, endMs: null }} placeholder="Empty" />
            <DateRangeFilter value={{ startMs: lastWeek, endMs: null }} placeholder="Start only" />
            <DateRangeFilter value={{ startMs: lastWeek, endMs: yesterday }} placeholder="Full range" />
            <DateRangeFilter value={{ startMs: null, endMs: null }} placeholder="Icon" triggerVariant="icon" />
            <DateRangeFilter value={{ startMs: null, endMs: null }} placeholder="Disabled" disabled />
          </Inline>
          <Text as="p" tone="muted" variant="caption">
            Note: values are milliseconds since epoch (easy to convert to/from Firebase Timestamp).
          </Text>
        </Stack>
      </Card>
    );
  },
};
