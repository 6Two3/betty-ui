export default function UpdateIcon(props: { size: number; animate?: boolean }) {
  let animateCss = "";
  //console.log('animate' + props.animate)
  if (props.animate) {
    animateCss = ` animate-spin`;
  }
  return (
    <>
      <svg
        className={`h-` + props.size + ` w-` + props.size + animateCss}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {" "}
        <path stroke="none" d="M0 0h24v24H0z" />{" "}
        <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -5v5h5" />{" "}
        <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 5v-5h-5" />
      </svg>
    </>
  );
}
