import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { FieldSelector, flattenFields, Stack, Text, Inline, Card } from '@cre/web-ui';

const sampleData: Record<string, unknown>[] = [
  {
    name: 'Alice',
    contact: { email: 'alice@example.com', phone: '+1-555-0101' },
    address: { city: 'New York', country: 'US' },
    meta: { status: 'active', createdAt: '2024-01-15' },
  },
  {
    name: 'Bob',
    contact: { email: 'bob@example.com', phone: '+1-555-0202' },
    address: { city: 'London', country: 'UK' },
    meta: { status: 'new', createdAt: '2024-03-22' },
  },
];

const allFields = flattenFields(sampleData);

const meta: Meta<typeof FieldSelector> = {
  title: 'Web/Components/FieldSelector',
  component: FieldSelector,
  parameters: { layout: 'centered', docs: { page: null } },
  argTypes: {
    data: { control: false, description: 'Row data used to derive fields when `fields` is not provided' },
    fields: { control: false, description: 'Explicit list of dot-path field names (overrides `data` derivation)' },
    visibleFields: { control: false, description: 'Controlled list of currently-visible field paths' },
    onVisibleFieldsChange: { action: 'visibleFieldsChange' },
    labelParser: { control: false, description: 'Custom formatter for a field path label' },
    ariaLabel: { control: 'text', description: 'Accessible label for the trigger button' },
    className: { control: false },
    style: { control: false },
  },
  args: {
    ariaLabel: 'Select visible columns',
  },
};

export default meta;

type Story = StoryObj<typeof FieldSelector>;

/** Interactive playground — toggle columns and observe the visible-fields list below. */
export const Playground: Story = {
  render: () => {
    const [visibleFields, setVisibleFields] = useState<string[]>(allFields.slice(0, 3));

    return (
      <Card>
        <Stack gap="nano">
          <Inline justify="flex-end">
            <FieldSelector
              fields={allFields}
              visibleFields={visibleFields}
              onVisibleFieldsChange={setVisibleFields}
            />
          </Inline>
          <Text as="p" tone="muted">
            Visible: {visibleFields.length > 0 ? visibleFields.join(', ') : '(none)'}
          </Text>
        </Stack>
      </Card>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `
const [visibleFields, setVisibleFields] = useState(['name', 'email', 'status']);

<FieldSelector
  fields={['name', 'email', 'status', 'city', 'createdAt']}
  visibleFields={visibleFields}
  onVisibleFieldsChange={setVisibleFields}
/>
        `.trim(),
      },
    },
  },
};

/** Fields derived automatically from row data — no need to specify them explicitly. */
export const DerivedFromData: Story = {
  render: () => {
    const [visibleFields, setVisibleFields] = useState<string[]>(allFields);

    return (
      <Card>
        <Stack gap="nano">
          <Inline justify="flex-end">
            <FieldSelector
              data={sampleData}
              visibleFields={visibleFields}
              onVisibleFieldsChange={setVisibleFields}
            />
          </Inline>
          <Text as="p" tone="muted">
            Visible: {visibleFields.length > 0 ? visibleFields.join(', ') : '(none)'}
          </Text>
        </Stack>
      </Card>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `
const rows = [{ name: 'Alice', contact: { email: 'alice@example.com' } }];
const [visibleFields, setVisibleFields] = useState(['name', 'contact.email']);

<FieldSelector
  data={rows}
  visibleFields={visibleFields}
  onVisibleFieldsChange={setVisibleFields}
/>
        `.trim(),
      },
    },
  },
};

/** Custom label parser — override the default "Segment / Segment" format. */
export const CustomLabelParser: Story = {
  render: () => {
    const [visibleFields, setVisibleFields] = useState<string[]>(allFields);

    const labelParser = (path: string) =>
      path
        .split('.')
        .map((s) => s[0].toUpperCase() + s.slice(1))
        .join(' › ');

    return (
      <Card>
        <Stack gap="nano">
          <Inline justify="flex-end">
            <FieldSelector
              fields={allFields}
              visibleFields={visibleFields}
              onVisibleFieldsChange={setVisibleFields}
              labelParser={labelParser}
            />
          </Inline>
          <Text as="p" tone="muted">
            Visible: {visibleFields.length > 0 ? visibleFields.join(', ') : '(none)'}
          </Text>
        </Stack>
      </Card>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `
const [visibleFields, setVisibleFields] = useState(['name', 'contact.email']);

const labelParser = (path: string) =>
  path.split('.').map(s => s[0].toUpperCase() + s.slice(1)).join(' › ');

<FieldSelector
  fields={['name', 'contact.email', 'address.city']}
  visibleFields={visibleFields}
  onVisibleFieldsChange={setVisibleFields}
  labelParser={labelParser}
/>
        `.trim(),
      },
    },
  },
};

export const NoFieldsAvailable: Story = {
  render: (args) => {
    const [visibleFields, setVisibleFields] = useState<string[]>([]);

    return (
      <Card>
        <Stack gap="nano">
          <Inline justify="flex-end">
            <FieldSelector
              {...args}
              fields={[]}
              visibleFields={visibleFields}
              onVisibleFieldsChange={(next) => {
                args.onVisibleFieldsChange?.(next);
                setVisibleFields(next);
              }}
            />
          </Inline>
          <Text as="p" tone="muted">
            Visible: {visibleFields.length > 0 ? visibleFields.join(', ') : '(none)'}
          </Text>
        </Stack>
      </Card>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `
const [visibleFields, setVisibleFields] = useState<string[]>([]);

<FieldSelector
  fields={[]}
  visibleFields={visibleFields}
  onVisibleFieldsChange={setVisibleFields}
/>
        `.trim(),
      },
    },
  },
};

/** Hierarchical fields with slash-separated paths — renders as an indented tree with group checkboxes. */
export const HierarchicalFields: Story = {
  render: () => {
    const fields = [
      'sessionDurationMs',
      'platform',
      'tutorial_scene_a/durationMs',
      'tutorial_scene_a/buttonClicks/buttonA',
      'tutorial_scene_a/buttonClicks/buttonB',
      'main_experience/durationMs',
      'main_experience/buttonClicks/rightTrigger',
    ];

    const [visibleFields, setVisibleFields] = useState<string[]>([
      'sessionDurationMs',
      'platform',
      'tutorial_scene_a/durationMs',
    ]);

    return (
      <Card>
        <Stack gap="nano">
          <Inline justify="flex-end">
            <FieldSelector
              fields={fields}
              visibleFields={visibleFields}
              onVisibleFieldsChange={setVisibleFields}
            />
          </Inline>
          <Text as="p" tone="muted">
            Visible: {visibleFields.length > 0 ? visibleFields.join(', ') : '(none)'}
          </Text>
        </Stack>
      </Card>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `
const fields = [
  'sessionDurationMs',
  'platform',
  'tutorial_scene_a/durationMs',
  'tutorial_scene_a/buttonClicks/buttonA',
  'tutorial_scene_a/buttonClicks/buttonB',
  'main_experience/durationMs',
  'main_experience/buttonClicks/rightTrigger',
];

const [visibleFields, setVisibleFields] = useState([
  'sessionDurationMs',
  'platform',
  'tutorial_scene_a/durationMs',
]);

<FieldSelector
  fields={fields}
  visibleFields={visibleFields}
  onVisibleFieldsChange={setVisibleFields}
/>
        `.trim(),
      },
    },
  },
};

/** All states — open trigger (simulated via inline rendering). */
export const AllStates: Story = {
  render: () => {
    const [visibleFields, setVisibleFields] = useState<string[]>(allFields.slice(0, 2));
    const [allVisible, setAllVisible] = useState<string[]>(allFields);
    const [noneVisible, setNoneVisible] = useState<string[]>([]);

    return (
      <Stack gap="micro">
        <Stack gap="quark">
          <Text as="p" variant="label">Some fields selected</Text>
          <FieldSelector
            fields={allFields}
            visibleFields={visibleFields}
            onVisibleFieldsChange={setVisibleFields}
          />
        </Stack>
        <Stack gap="quark">
          <Text as="p" variant="label">All fields selected</Text>
          <FieldSelector
            fields={allFields}
            visibleFields={allVisible}
            onVisibleFieldsChange={setAllVisible}
          />
        </Stack>
        <Stack gap="quark">
          <Text as="p" variant="label">No fields selected</Text>
          <FieldSelector
            fields={allFields}
            visibleFields={noneVisible}
            onVisibleFieldsChange={setNoneVisible}
          />
        </Stack>
      </Stack>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `
const [visibleFields, setVisibleFields] = useState(['name', 'email']);

<FieldSelector
  fields={['name', 'email', 'status', 'city']}
  visibleFields={visibleFields}
  onVisibleFieldsChange={setVisibleFields}
/>
        `.trim(),
      },
    },
  },
};
