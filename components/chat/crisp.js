"use client"

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("80ecca2d-78c1-4fc3-bbed-40d6ae9b41fc");
  });

  return null;
}

export default CrispChat;
