import React from 'react';

export function getChildRef(
  child: React.ReactElement,
  version = React.version
): React.Ref<HTMLElement> | null | undefined {
  return parseInt(version, 10) >= 19
    ? (child.props as any).ref
    : (child as any).ref;
}
