import React from 'react';

export default function ChildrenWrapper(props) {
  const { children, className, ...rest } = props;

  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => React.cloneElement(child, { ...rest, key: index }))}
    </div>
  );
}
