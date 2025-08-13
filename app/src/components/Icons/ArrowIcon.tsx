interface ArrowIconProps {
  className?: string;
}
export function ArrowIcon({ className }: ArrowIconProps) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_173_13873)">
        <path d="M13.1325 2.90251L11.7975 1.57501L4.38 9.00001L11.805 16.425L13.1325 15.0975L7.03501 9.00001L13.1325 2.90251Z" />
      </g>
      <defs>
        <clipPath id="clip0_173_13873">
          <rect width="18" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default ArrowIcon;
