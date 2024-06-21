export default function ExternalLinkIcon(props: {
  size: number;
  animate?: boolean;
}) {
  let animateCss = "";

  return (
    <>
      <svg
        className={`h-` + props.size + ` w-` + props.size}
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    </>
  );
}
