import React from 'react';

const getWindowSize = () => {
  return { width: window.innerWidth, height: window.innerHeight };
};

class ComponentDecoratorClass extends React.Component {
  state = {
    ...getWindowSize(),
  };

  componentDidMount = () => {
    window.addEventListener('resize', this.handleResize);
  };

  handleResize = () => {
    this.setState({ ...getWindowSize });
  };

  render() {
    return (
      <div className="component-decorator">
        {this.props.children}
        <span className="component-decorator__size" />
      </div>
    );
  }
}

export default function ComponentDecorator({ children }) {
  return <ComponentDecoratorClass>{children}</ComponentDecoratorClass>;
}
