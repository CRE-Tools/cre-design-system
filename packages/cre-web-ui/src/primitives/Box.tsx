import React from 'react';

export type BoxProps<T extends React.ElementType = 'div'> = {
  as?: T;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'className' | 'style' | 'children'>;

export function Box<T extends React.ElementType = 'div'>(props: BoxProps<T>) {
  const { as, className, style, children, ...rest } = props;
  const Component = (as ?? 'div') as React.ElementType;

  return (
    <Component className={className} style={style} {...rest}>
      {children}
    </Component>
  );
}
