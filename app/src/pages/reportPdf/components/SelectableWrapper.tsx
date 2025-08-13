import { useEffect, useRef, useState } from "react";

type SelectableWrapperProps = {
  children: React.ReactNode;
  className?: string;
  onSelect?: () => void;
  onDeselect?: () => void;
  selectBorder?: "primary" | "secondary" | "none";
  selected?: boolean; // Optional controlled prop
};

export default function SelectableWrapper({
  children,
  className = "",
  onSelect,
  onDeselect,
  selectBorder = "primary",
  selected,
}: SelectableWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [internalSelected, setInternalSelected] = useState(false);

  const isControlled = selected !== undefined;
  const isSelected = isControlled ? selected : internalSelected;

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const target = event.target as HTMLElement;

      // If clicked on a node with data-ignore-deselect attribute, skip
      if (target.closest("[data-ignore-deselect]")) return;

      if (wrapperRef.current && !wrapperRef.current.contains(target)) {
        if (isSelected) {
          if (!isControlled) setInternalSelected(false);
          onDeselect?.();
        }
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isSelected, isControlled, onDeselect]);

  const handleClickInside = () => {
    if (!isSelected) {
      if (!isControlled) setInternalSelected(true);
      onSelect?.();
    }
  };

  const borderClass =
    selectBorder === "none"
      ? "border-transparent"
      : isSelected
      ? selectBorder === "primary"
        ? "border-blue-500"
        : "border-gray-500"
      : "border-transparent";

  return (
    <div
      ref={wrapperRef}
      onClick={handleClickInside}
      className={`relative border ${borderClass} ${className}`}
    >
      {children}
    </div>
  );
}
