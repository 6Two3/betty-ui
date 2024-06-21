export default function WalletIcon(props: {
  size: number;
  strokeWidth?: number;
}) {
  let animateCss = "";
  let strokeWidth = 2;
  if (props.strokeWidth) {
    strokeWidth = props.strokeWidth;
  }

  return (
    <>
      <svg
        className={`h-` + props.size + ` w-` + props.size}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        strokeWidth={strokeWidth}
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {" "}
        <path stroke="none" d="M0 0h24v24H0z" />{" "}
        <path d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12" />{" "}
        <path d="M20 12v4h-4a2 2 0 0 1 0 -4h4" />
      </svg>
    </>
  );
}
