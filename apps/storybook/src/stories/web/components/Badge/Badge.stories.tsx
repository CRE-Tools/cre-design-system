import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Badge, Inline, Stack, Text, Surface } from '@cre/web-ui';

const meta: Meta<typeof Badge> = {
  title: 'Web/Components/Badge',
  component: Badge,
  parameters: { layout: 'centered', docs: { page: null } },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['neutral', 'success', 'warning', 'error', 'accent'],
    },
    children: { control: 'text' },
    className: { control: false },
  },
  args: {
    variant: 'neutral',
    children: 'Badge',
  },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Playground: Story = {
  render: (args) => {
    return <Badge {...args} />;
  },
};

/** All five semantic variants side by side. */
export const AllStates: Story = {
  render: () => (
    <Inline gap="nano" wrap>
      <Badge variant="neutral">Neutral</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="accent">Accent</Badge>
    </Inline>
  ),
};

/** Badges paired with text labels — the most common real-world usage. */
export const WithLabels: Story = {
  render: () => (
    <Surface padding="micro" radius="small">
      <Stack gap="nano">
        {[
          { name: 'Deployment pipeline', status: 'success', label: 'Live' },
          { name: 'User onboarding flow', status: 'warning', label: 'Review' },
          { name: 'Payment integration', status: 'error', label: 'Failed' },
          { name: 'Analytics dashboard', status: 'neutral', label: 'Draft' },
          { name: 'Design system', status: 'accent', label: 'Active' },
        ].map(({ name, status, label }) => (
          <Inline key={name} gap="nano" align="center" justify="space-between">
            <Text as="span">{name}</Text>
            <Badge variant={status as React.ComponentProps<typeof Badge>['variant']}>{label}</Badge>
          </Inline>
        ))}
      </Stack>
    </Surface>
  ),
};
