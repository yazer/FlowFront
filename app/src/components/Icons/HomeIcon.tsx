interface HomeIconProps {
  className?: string;
}
export function HomeIcon({ className }: HomeIconProps) {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 16 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M8 2.2675L11.75 5.6425V11.5H10.25V7H5.75V11.5H4.25V5.6425L8 2.2675ZM8 0.25L0.5 7H2.75V13H7.25V8.5H8.75V13H13.25V7H15.5L8 0.25Z" />
    </svg>
  );
}

export default HomeIcon;
