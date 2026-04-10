import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Card, Heading, Stack, Text, Button, Inline } from '@cre/web-ui';

const meta: Meta<typeof Card> = {
  title: 'Web/Components/Card',
  component: Card,
  parameters: { layout: 'padded', docs: { page: null } },
  argTypes: {
    header: { control: false },
    footer: { control: false },
    children: { control: false },
    padding: { control: 'text' },
    variant: { control: 'text' },
    className: { control: false },
    style: { control: false },
  },
  args: {
    padding: 'micro',
    variant: 'raised',
  },
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Playground: Story = {
  render: (args) => (
    <Card
      {...args}
      header={
        <Inline align="center" justify="space-between" wrap>
          <Heading level={4}>Card title</Heading>
          <Button>Action</Button>
        </Inline>
      }
      footer={<Text as="p" tone="muted">Footer content</Text>}
    >
      <Stack gap="nano">
        <Text as="p">Grouped content goes here.</Text>
        <Text as="p" tone="muted">
          Use Card for metrics, forms, tables, or details.
        </Text>
      </Stack>
    </Card>
  ),
};

export const AllStates: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack gap="micro">
      <Card padding="micro" variant="raised">
        <Text as="p">Raised / micro</Text>
      </Card>
      <Card padding="none" variant="raised">
        <Stack gap="nano">
          <Text as="p">Raised / none</Text>
          <Text as="p" tone="muted">Shows content flush to edges (e.g. tables).</Text>
        </Stack>
      </Card>
    </Stack>
  ),
};

export const Basic: Story = {
  render: () => (
    <Card
      header={
        <Inline align="center" justify="space-between" wrap>
          <Heading level={4}>Card title</Heading>
          <Button>Action</Button>
        </Inline>
      }
      footer={<Text as="p" tone="muted">Footer content</Text>}
    >
      <Stack gap="nano">
        <Text as="p">Grouped content goes here.</Text>
        <Text as="p" tone="muted">
          Use Card for metrics, forms, tables, or details.
        </Text>
      </Stack>
    </Card>
  ),
};
