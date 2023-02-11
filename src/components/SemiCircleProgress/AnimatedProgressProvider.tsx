import React from "react";
import { Animate } from "react-move";

export type AnimatedProgressProviderProps = {
  interval?: number;
  repeat?: boolean;
  duration?: number;
  valueStart?: number;
  valueEnd?: number;
  easingFunction?: string;
  children: any
};

export type AnimatedProgressProviderState = {
  isAnimated?: boolean
}

class AnimatedProgressProvider extends React.Component<AnimatedProgressProviderProps, 
  AnimatedProgressProviderState> {
  interval = undefined; 

  constructor(props: AnimatedProgressProviderProps) {
    super(props);
    
    this.state = {
      isAnimated: false
    }
  }

  componentDidMount() {
    const {repeat, duration} = this.props
    const {isAnimated} = this.state

    if (repeat) {
      this.interval = window.setInterval(() => {
        this.setState({
          isAnimated: !isAnimated
        });
      }, duration * 1000);
    } else {
      this.setState({
        isAnimated: !isAnimated
      });
    }
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
  }

  render() {
    const { valueStart, valueEnd, duration, easingFunction, children } = this.props
    const { isAnimated } = this.state

    return (
      <Animate
        start={() => ({
          value: valueStart
        })}
        update={() => ({
          value: [
            isAnimated ? valueEnd : valueStart
          ],
          timing: {
            duration: duration * 1000,
            ease: easingFunction
          }
        })}
      >
        {({ value }) => children(value)}
      </Animate>
    )
  }
}

export default AnimatedProgressProvider;
