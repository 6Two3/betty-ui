import { TokenBalance } from "../types/ProjectTypes";
import {
  bettyRenderDouble,
  bettyRenderPrice,
  bettyRenderValue,
} from "../../utils/numberFormat";
import TokenImage from "./TokenImage";

import { tokenColors } from "../../utils/utils";
import { getDenomDisplayString } from "../../utils/utils";

export default function TokenListRow(props: {
  tBal: TokenBalance;
  totalValue: number;
  valueDisplay: string;
  detailedRow?: boolean;
}) {
  const getStyleObj = (tObj: TokenBalance) => {
    let color = "rgba(0, 136, 254,0.5)";
    if (tokenColors[tObj.denom] !== undefined) {
      color = tokenColors[tObj.denom];
    }

    return {
      width: (tObj.usdValue / props.totalValue) * 100.0 + "%",
      background: color,
    };
  };
  if (props.detailedRow !== undefined && props.detailedRow) {
    return (
      <>
        <div className="hover:bg-white/10 py-1 rounded">
          <div>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div className="flex gap-x-2 text-white h-full">
                <div className="ps-3">
                  <TokenImage denom={props.tBal.denom} size={18}></TokenImage>
                </div>
                <div>
                  <div className="text-white/50">
                    {getDenomDisplayString(props.tBal.denom)}
                  </div>
                  <div className="font-bold text-lg text-white/80">
                    {bettyRenderDouble(props.tBal.amount, 1)}
                  </div>
                </div>
              </div>

              <div className="relative w-full pe-2">
                <div className="text-xl font-bold text-right">
                  {bettyRenderDouble(props.tBal.usdValue, 2)}
                </div>
                <div
                  className="rounded bg-blue-500 h-1 text-right absolute right-2"
                  style={getStyleObj(props.tBal)}
                >
                  <span className="text-sm font-normal text-white/50"></span>{" "}
                </div>
                <div className="text-right py-1 text-white/50">
                  {bettyRenderDouble(
                    (props.tBal.usdValue / props.totalValue) * 100.0,
                    2,
                  )}
                  %
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-white/5"></div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="hover:bg-white/10 py-1 rounded">
          <div>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div className="flex gap-x-2 text-white h-full">
                <div className="ps-3">
                  <TokenImage denom={props.tBal.denom} size={18}></TokenImage>
                </div>
                <div>
                  <div className="text-white/50">
                    {getDenomDisplayString(props.tBal.denom)}
                  </div>
                </div>
              </div>

              <div className="relative w-full pe-2">
                <div className="text-xl font-bold text-right">
                  {bettyRenderValue(props.tBal.usdValue)}
                </div>
                <div
                  className="rounded bg-blue-500 h-1 text-right absolute right-2"
                  style={getStyleObj(props.tBal)}
                >
                  <span className="text-sm font-normal text-white/50"></span>{" "}
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-white/5"></div>
        </div>
      </>
    );
  }
}
