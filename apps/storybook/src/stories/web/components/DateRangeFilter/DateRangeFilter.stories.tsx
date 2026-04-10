import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Card, DateRangeFilter, type DateRangeValue, Inline, Stack, Text } from '@cre/web-ui';

const meta: Meta<typeof DateRangeFilter> = {
  title: 'Web/Components/DateRangeFilter',
  component: DateRangeFilter,
  parameters: { layout: 'centered', docs: { page: null } },
  argTypes: {
    value: {
      control: false,
      description: 'Controlled value in milliseconds since epoch: { startMs, endMs }',
    },
    defaultValue: {
      control: false,
      description: 'Uncontrolled initial value in milliseconds since epoch: { startMs, endMs }',
    },
    onChange: { action: 'changed' },
    disabled: { control: 'boolean', description: 'Disables the trigger and blocks interaction' },
    placeholder: { control: 'text', description: 'Label shown when no date is selected' },
    triggerVariant: {
      control: 'radio',
      options: ['field', 'icon'],
      description: 'Trigger appearance: a labeled field-like trigger or icon-only',
    },
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

export const UncontrolledDefaultValue: Story = {
  argTypes: {
    value: { control: false },
    defaultValue: { control: false },
  },
  render: (args) => {
    const now = Date.now();
    const lastWeek = now - 7 * 24 * 60 * 60 * 1000;
    const yesterday = now - 1 * 24 * 60 * 60 * 1000;
    const [lastEmitted, setLastEmitted] = useState<DateRangeValue>({ startMs: null, endMs: null });

    return (
      <Stack gap="nano">
        <DateRangeFilter
          {...args}
          defaultValue={{ startMs: lastWeek, endMs: yesterday }}
          onChange={(next) => {
            args.onChange?.(next);
            setLastEmitted(next);
          }}
        />
        <Text as="p" tone="muted">
          Last emitted: {lastEmitted.startMs ?? 'null'} — {lastEmitted.endMs ?? 'null'}
        </Text>
      </Stack>
    );
  },
};

export const NormalizesRange: Story = {
  render: () => {
    const now = Date.now();
    const lastWeek = now - 7 * 24 * 60 * 60 * 1000;
    const yesterday = now - 1 * 24 * 60 * 60 * 1000;

    return (
      <Stack gap="nano">
        <DateRangeFilter value={{ startMs: yesterday, endMs: lastWeek }} placeholder="Reversed input" />
        <Text as="p" tone="muted">
          The component normalizes reversed ranges so start is always ≤ end.
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
