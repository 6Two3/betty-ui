import { ReactNode } from "react";
export default function BorderedButton(props: {
  children: ReactNode;
  px?: number;
  py?: number;
  minWidth?: number;
  selected?: boolean;
  style?: string;
}) {
  let px = 2;
  let py = 2;
  let minWidth = "";
  let selected = "";
  if (props.px != undefined) {
    px = props.px;
  }
  if (props.py != undefined) {
    py = props.py;
  }

  if (props.minWidth) {
    minWidth = "min-w-" + props.minWidth;
  }
  if (props.selected) {
    selected = "border border-darkGray text-darkGray ";
    if (props.style === "ligh") {
      selected = "border border-darkGray text-indigo-600 ";
    }
  } else {
    selected = "border border-white/10 text-white/70";
  }

  return (
    <>
      <div
        className={
          selected +
          minWidth +
          ` px-` +
          px +
          ` py-` +
          py +
          ` outline-none text-center rounded-full bg-white/5 cursor-pointer transition duration-500 ease-in-out hover:bg-white/10`
        }
      >
        {props.children}
      </div>
    </>
  );
}
