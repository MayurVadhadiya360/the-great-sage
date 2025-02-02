import React, { ReactNode } from "react";

interface TooltipProps {
  children: ReactNode;
  text: string;
  delay?: number;
}

interface TooltipState {
  visible: boolean;
  position: { x: number; y: number };
}

class Tooltip extends React.Component<TooltipProps, TooltipState> {
  timeoutId: number | null = null;

  static defaultProps = {
    delay: 500,
  };

  constructor(props: TooltipProps) {
    super(props);
    this.state = {
      visible: false,
      position: { x: 0, y: 0 },
    };
  }

  handleMouseEnter = (event: React.MouseEvent<HTMLSpanElement>) => {
    const { clientX, clientY } = event;
    // Set tooltip position near the cursor
    this.setState({ position: { x: clientX + 10, y: clientY + 10 } });
    // Delay before showing tooltip
    this.timeoutId = window.setTimeout(() => {
      this.setState({ visible: true });
    }, this.props.delay!);
  };

  handleMouseLeave = () => {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.setState({ visible: false });
  };

  render() {
    const { children, text } = this.props;
    const { visible, position } = this.state;

    return (
      <span
        style={{ display: "inline-block" }}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {children}
        {visible && (
          <div
            style={{
              position: "fixed",
              left: position.x,
              top: position.y,
              backgroundColor: "#333",
              color: "#fff",
              padding: "6px 10px",
              borderRadius: "5px",
              fontSize: "14px",
              whiteSpace: "nowrap",
              zIndex: 1000,
              boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
            }}
          >
            {text}
          </div>
        )}
      </span>
    );
  }
}

export { Tooltip };
