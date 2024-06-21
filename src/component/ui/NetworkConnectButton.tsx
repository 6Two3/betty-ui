"use client";

import { useNetwork } from "@/providers/network";
import { useEffect } from "react";
export function SettingsButton() {
  const [{ network, rpcs, rpc, setRpc, preferred, tmClient }, setNetwork] =
    useNetwork();
  useEffect(() => {
    setNetwork("harpoon-4");
  }, [network]);
  return <>{network}</>;
}
