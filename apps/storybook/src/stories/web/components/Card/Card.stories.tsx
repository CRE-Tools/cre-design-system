import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Card, Heading, Stack, Text, Button, Inline } from '@cre/web-ui';

const meta: Meta<typeof Card> = {
  title: 'Web/Components/Card',
  component: Card,
  parameters: { layout: 'padded', docs: { page: null } },
};

export default meta;

type Story = StoryObj<typeof Card>;

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
