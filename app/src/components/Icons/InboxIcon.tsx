interface InboxIconProps {
  className?: string;
}
export function InboxIcon({ className }: InboxIconProps) {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_173_13858)">
        <path d="M14.25 2.25H3.75C2.925 2.25 2.25 2.925 2.25 3.75V14.25C2.25 15.075 2.9175 15.75 3.75 15.75H14.25C15.075 15.75 15.75 15.075 15.75 14.25V3.75C15.75 2.925 15.075 2.25 14.25 2.25ZM14.25 14.25H3.75V12H6.42C6.9375 12.8925 7.8975 13.5 9.0075 13.5C10.1175 13.5 11.07 12.8925 11.595 12H14.25V14.25ZM14.25 10.5H10.5075C10.5075 11.325 9.8325 12 9.0075 12C8.1825 12 7.5075 11.325 7.5075 10.5H3.75V3.75H14.25V10.5Z" />
      </g>
      <defs>
        <clipPath id="clip0_173_13858">
          <rect width="18" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
export default InboxIcon;
