import React from 'react';

export default function ViewContainer({ children, height = undefined }) {
  return <div className="ic-view-container" style={{ height }}>{children}</div>;
}
