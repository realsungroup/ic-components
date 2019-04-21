import React from 'react';
import debounce from 'lodash/debounce';
import Hammer from 'hammerjs';

export default class ViewContainer extends React.Component<any, any> {
  static defaultProps = {
    onPan: () => {},
  };

  ref: any = React.createRef();
  private hammer: any;
  private contentColumnElement: Element;
  private scrolling: boolean = false;

  componentDidMount() {
    const containerElement = this.ref.current;
    this.contentColumnElement = containerElement.querySelector('.ic-day-time-line__content-column');
    if (this.contentColumnElement) {
      this.contentColumnElement.addEventListener('scroll', this.handleScroll);
      this.contentColumnElement.addEventListener('touchend', this.handleScrollEnd);
    }
    this.hammer = new Hammer(containerElement);
    this.hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    this.hammer.on('pan', this.handlePan);
  }

  componentWillUnmount() {
    this.hammer.off('pan', this.handlePan);
    if (this.contentColumnElement) {
      this.contentColumnElement.removeEventListener('scroll', this.handleScroll);
      this.contentColumnElement.removeEventListener('touchend', this.handleScrollEnd);
    }
  }

  handleScroll = () => {
    this.scrolling = true;
  }

  handleScrollEnd = () => {
    setTimeout(() => {
      this.scrolling = false;
    }, 1000);
  }

  handlePan = debounce(e => {
    if (this.scrolling) {
      return;
    }

    this.props.onPan(e);
  }, 300);

  render() {
    const { children, height } = this.props;
    return (
      <div className="ic-view-container" style={{ height }} ref={this.ref}>
        {children}
      </div>
    );
  }
}
