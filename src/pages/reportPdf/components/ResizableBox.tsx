// ResizableBox.tsx
import React, { useRef } from "react";

type Direction = "horizontal" | "vertical" | "both";

interface ResizableBoxProps {
  children: React.ReactNode;
  direction?: Direction;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  className?: string;
  width?: number;
  height?: number;
  onResize?: (size: { width: number; height: number }) => void;
}

const ResizableBox: React.FC<ResizableBoxProps> = ({
  children,
  direction = "both",
  minWidth = 100,
  minHeight = 100,
  maxWidth = 1000,
  maxHeight = 1000,
  className = "",
  width,
  height,
  onResize,
}) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const resizing = useRef(false);
  const controlled = typeof width === "number" && typeof height === "number";
  const [internalSize, setInternalSize] = React.useState({
    width: width ?? 800,
    height: height ?? 200,
  });

  // Keep internal state in sync with controlled props
  React.useEffect(() => {
    if (typeof width === "number" && typeof height === "number") {
      setInternalSize({ width, height });
    }
  }, [width, height]);

  const size = controlled ? { width: width!, height: height! } : internalSize;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    resizing.current = true;
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const onMouseMove = (e: MouseEvent) => {
      if (!resizing.current) return;

      const newWidth =
        direction === "horizontal" || direction === "both"
          ? Math.min(
              Math.max(startWidth + e.clientX - startX, minWidth),
              maxWidth
            )
          : startWidth;

      const newHeight =
        direction === "vertical" || direction === "both"
          ? Math.min(
              Math.max(startHeight + e.clientY - startY, minHeight),
              maxHeight
            )
          : startHeight;

      if (controlled) {
        onResize?.({ width: newWidth, height: newHeight });
      } else {
        setInternalSize({ width: newWidth, height: newHeight });
        onResize?.({ width: newWidth, height: newHeight });
      }
    };

    const onMouseUp = () => {
      resizing.current = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const resizerClass =
    direction === "horizontal"
      ? "right-0 top-0 h-full w-2 cursor-ew-resize"
      : direction === "vertical"
      ? "bottom-0 left-0 w-full h-2 cursor-ns-resize"
      : "right-0 bottom-0 w-3 h-3 cursor-nwse-resize";

  return (
    <div
      ref={boxRef}
      className={`relative ${className}`}
      style={{ width: size.width, height: size.height }}
    >
      {children}
      <div
        className={`absolute ${resizerClass} bg-transparent z-10`}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};

export default ResizableBox;
