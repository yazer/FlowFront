interface FlowBuilderIconProps {
  className?: string;
}
export default function FlowBuilderIcon({ className }: FlowBuilderIconProps) {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_173_13853)">
        <path d="M16.5 8.25V2.25H11.25V4.5H6.75V2.25H1.5V8.25H6.75V6H8.25V13.5H11.25V15.75H16.5V9.75H11.25V12H9.75V6H11.25V8.25H16.5ZM5.25 6.75H3V3.75H5.25V6.75ZM12.75 11.25H15V14.25H12.75V11.25ZM12.75 3.75H15V6.75H12.75V3.75Z" />
      </g>
      <defs>
        <clipPath id="clip0_173_13853">
          <rect width="18" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
