import { IconProps } from "./IconProps";

export function InboxIcon({
  width = 20,
  height = 20,
  color = "#000000",
}: IconProps) {
  return (
    <>
      <svg
        width={width}
        height={height}
        viewBox="0 0 20 20"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          id="Page-1"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <g
            id="Dribbble-Light-Preview"
            transform="translate(-100.000000, -1039.000000)"
            fill={color}
          >
            <g id="icons" transform="translate(56.000000, 160.000000)">
              <path
                d="M61,889 L61,886 L62,889 L61,889 Z M62,897 L46,897 L46,891 L50,891 L50,895 L58,895 L58,891 L62,891 L62,897 Z M47,886 L47,889 L46,889 L47,886 Z M49,881 L53.014,881 L53.044,885.286 L51.166,883.407 L49.751,884.822 C53.282,888.352 52.579,887.649 53.994,889.064 C55.485,887.573 56.791,886.267 58.287,884.771 L56.894,883.336 L54.944,885.286 L54.964,881 L59,881 L59,889 L56,889 L56,893 L52,893 L52,889 L49,889 L49,881 Z M62,883 L61,883 L61,879 L47,879 L47,883 L46,883 L44,889 L44,899 L64,899 L64,889 L62,883 Z"
                id="inbox_down-[#1548]"
              ></path>
            </g>
          </g>
        </g>
      </svg>
    </>
  );
}
