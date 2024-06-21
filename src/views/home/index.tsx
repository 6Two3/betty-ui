"use client";

import { NetworkContext } from "@/providers/network";
import { WalletContext } from "@/providers/wallet";
import { usePathname } from "next/navigation";
import { PasskeyContext } from "@/providers/passkey";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import ListBetsModule from "@/component/ui/ListBets";
// import StakeComponent from "@/component/ui/StakeComponent";
import Header from "@/component/ui/heading/header";
import StakeComponent from "../stake";
import StakeView from "../stake";

const contextClass = {
  success: "bg-blue-600",
  error: "bg-red-800",
  info: "bg-indigo-600",
  warning: "bg-orange-400",
  default: "bg-purple-950",
  dark: "bg-white-600 font-gray-300",
};

export default function HomeView() {
  const [priceData, setPriceData] = useState({ updated: 0, prices: new Map() });

  /*
    //   const fetchPrice=async()=>{
    //       const priceData = await getTokenPriceData(swapApi)
    //       //console.log('Loaded priceData: ' +JSON.stringify(priceData))
    //       setPriceData(priceData)
          
    //   }*/

  const [selecetedModule, setSelectedModule] = useState("main");
  const onSelectModule = (selecetedMenu: string) => {
    if (selecetedMenu === "stake") {
      setSelectedModule("stake");
    } else {
      setSelectedModule("main");
    }
  };

  let selecetedModuleContent = <></>;
  if (selecetedModule === "main") {
    selecetedModuleContent = <ListBetsModule></ListBetsModule>;
  } else if (selecetedModule === "stake") {
    selecetedModuleContent = <StakeView priceData={priceData}></StakeView>;
  }

  return (
    <>
      <NetworkContext>
        <PasskeyContext>
          <WalletContext>
            <ToastContainer
              position="bottom-left"
              toastClassName={(context) =>
                contextClass[context?.type || "default"] +
                " relative flex p-1 min-h-24 rounded-md justify-between overflow-hidden cursor-pointer"
              }
              autoClose={5000}
              hideProgressBar={true}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
            <Header onselectMenuItem={onSelectModule} priceData={priceData} />
            <div className="text-center text-2xl font-bold mt-5">
              Welcome to Betty
            </div>
            <div className="container px-2 lg:px-20 mx-auto pb-10">
              <div className="mt-5">{selecetedModuleContent}</div>
            </div>
          </WalletContext>
        </PasskeyContext>
      </NetworkContext>
    </>
  );
}
