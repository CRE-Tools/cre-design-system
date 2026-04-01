import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Container, Surface, Stack, Heading, Text } from '@cre/web-ui';

const meta: Meta = {
  title: 'Web/Primitives/Container',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const PageWidth: Story = {
  render: () => (
    <div style={{ background: 'var(--cre-color-bg)', minHeight: '100vh', paddingTop: 'var(--cre-space-large)' }}>
      <Container size="read">
        <Stack gap="micro">
          <Heading level={2}>Read container</Heading>
          <Text as="p" tone="muted">
            Container centers content and constrains max width using layout tokens.
          </Text>
          <Surface>
            <Text as="p">
              This surface is inside a <code>Container</code>.
            </Text>
          </Surface>
        </Stack>
      </Container>
    </div>
  )
};
