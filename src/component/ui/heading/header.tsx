"use client";

import ConnectButton from "../ConnectButton";
import { SettingsButton } from "../NetworkConnectButton";
import { usePasskeys } from "@/providers/passkey";
import WalletConnected from "./WalletConnected";
import { PriceData } from "../../types/ProjectTypes";
import StakeIcon from "../../icons/StakeIcon";
import BetIcon from "../../icons/BetIcon";
import Logo from "./Logo";
import { navItems } from "@/constant";
import { useState } from "react";

export default function Header(props: {
  onselectMenuItem: any;
  priceData: PriceData;
}) {
  const { signer } = usePasskeys();
  const [activeItem, setActiveItem] = useState(navItems[0].value);
  let accountButton = <ConnectButton />;
  let loggedIn = signer != undefined;

  if (loggedIn) {
    accountButton = <WalletConnected priceData={props.priceData} />;
  }

  const handleNavItem = (item: string) => {
    setActiveItem(item);
    props.onselectMenuItem(item);
  };

  return (
    <>
      <div className="bg-darkGray h-[60px] px-5 md:px-10 shadow-lg">
        <div className="flex w-full h-full justify-between items-center text-white">
          <div className="lg:min-w-64">
            <Logo />
          </div>
          <div className="hidden sm:flex h-full sm:justify-center p-1">
            <div className="flex flex-row bg-darkGray2 rounded-full p-1 lg:min-w-64 gap-1">
              {navItems.map((item, index) => (
                <div key={index} className="w-full">
                  <button
                    onClick={() => handleNavItem(item.value)}
                    className={`flex justify-center h-full w-full px-1 text-sm sm:text-base sm:px-3 items-center hover:bg-white/5 cursor-pointer transition duration-500 ease-in-out rounded-full ${activeItem === item.value ? "bg-darkGray" : "border-transparent"}`}
                  >
                    <span className="hidden sm:block">
                      {item.value === "main" ? (
                        <BetIcon size={6} />
                      ) : (
                        <StakeIcon size={5} />
                      )}
                    </span>
                    <span className="px-2 uppercase">{item.label}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-1 lg:min-w-64">
            <div className="flex items-end gap-1 lg:min-w-64">
              <div className="text-xs me-5">
                <SettingsButton />
              </div>
              {accountButton}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center sm:hidden bg-black/10 p-1 gap-1">
        {navItems.map((item, index) => (
          <div key={index} className="w-full">
            <button
              onClick={() => handleNavItem(item.value)}
              className={`flex justify-center py-4 w-full h-full text-sm sm:text-base sm:px-3 items-center hover:bg-white/5 cursor-pointer transition duration-500 ease-in-out rounded-full ${activeItem === item.value ? "bg-darkGray" : "border-transparent"}`}
            >
              <span className="flex">
                {item.value === "main" ? (
                  <BetIcon size={6} />
                ) : (
                  <StakeIcon size={5} />
                )}
              </span>
              <span className="px-2 uppercase">{item.label}</span>
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
