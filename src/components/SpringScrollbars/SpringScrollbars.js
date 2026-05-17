import React, { Component } from "react";
import PropTypes from "prop-types";
import { SpringSystem, MathUtil } from "rebound";
import { connect } from "react-redux";

import { setScrollToTop } from "../../state/store";

const forceCheck = () => {};

class SpringScrollbars extends Component {
  constructor(props, ...rest) {
    super(props, ...rest);
    this.handleSpringUpdate = this.handleSpringUpdate.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isNavigator && this.props.navigatorPosition !== "is-featured") {
      return;
    }

    if (this.props.scrollToTop && this.props.scrollToTop !== prevProps.scrollToTop) {
      this.scrollTop(0);
      this.props.setScrollToTop(false);
    }
  }
  componentDidMount() {
    this.springSystem = new SpringSystem();
    this.spring = this.springSystem.createSpring();
    this.spring.addListener({ onSpringUpdate: this.handleSpringUpdate });
  }

  componentWillUnmount() {
    if (this.springSystem && this.spring) {
      this.springSystem.deregisterSpring(this.spring);
      this.springSystem.removeAllListeners();
      this.spring.destroy();
    }
    this.spring = undefined;
    this.springSystem = undefined;
  }

  getScrollTop() {
    return this.scrollbars ? this.scrollbars.scrollTop : 0;
  }

  getScrollHeight() {
    return this.scrollbars ? this.scrollbars.scrollHeight : 0;
  }

  getHeight() {
    return this.scrollbars ? this.scrollbars.clientHeight : 0;
  }

  scrollTop(top) {
    if (!this.scrollbars) {
      return;
    }

    const scrollTop = this.scrollbars.scrollTop;
    const scrollHeight = this.scrollbars.scrollHeight;
    const val = MathUtil.mapValueInRange(
      top,
      0,
      scrollHeight,
      scrollHeight * 0.01,
      scrollHeight * 0.99
    );
    this.spring.setCurrentValue(scrollTop).setAtRest();
    this.spring.setEndValue(val);
  }

  handleSpringUpdate(spring) {
    window.requestAnimationFrame(() => {
      if (!this.scrollbars) {
        return;
      }

      const val = spring.getCurrentValue();
      this.scrollbars.scrollTop = val;
    });
  }

  render() {
    const { children, forceCheckOnScroll } = this.props;

    return (
      <div
        style={{ height: "100%", overflow: "auto" }}
        onScroll={forceCheckOnScroll && forceCheck}
        ref={comp => {
          this.scrollbars = comp;
        }}
      >
        {children}
      </div>
    );
  }
}

SpringScrollbars.propTypes = {
  children: PropTypes.node.isRequired,
  scrollToTop: PropTypes.bool.isRequired,
  setScrollToTop: PropTypes.func.isRequired,
  forceCheckOnScroll: PropTypes.bool,
  navigatorPosition: PropTypes.string.isRequired,
  isNavigator: PropTypes.bool
};

const mapStateToProps = (state, ownProps) => {
  return {
    scrollToTop: state.scrollToTop,
    navigatorPosition: state.navigatorPosition
  };
};

const mapDispatchToProps = {
  setScrollToTop
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpringScrollbars);
