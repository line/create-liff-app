"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const LIFFContext = createContext({
  liff: null,
  liffError: null,
});

function LIFFProvider({ children }) {
  const [liffObject, setLiffObject] = useState(null);
  const [liffError, setLiffError] = useState(null);

  // 在组件挂载时执行 liff.init()
  useEffect(() => {
    // 动态导入 @line/liff，以避免在 Next.js 服务端渲染时出现 window is not defined 的错误
    import("@line/liff")
      .then((liff) => liff.default)
      .then((liff) => {
        console.log("LIFF init...");
        const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
        if (!liffId) {
          throw new Error("NEXT_PUBLIC_LIFF_ID is not defined.");
        }

        liff
          .init({ liffId: liffId })
          .then(() => {
            console.log("LIFF init succeeded.");
            setLiffObject(liff);
          })
          .catch((error) => {
            console.log("LIFF init failed.");
            setLiffError(error.toString());
          });
      })
      .catch((error) => {
        console.log("LIFF init failed.");
        setLiffError(error.toString());
      });
  }, []);

  const value = {
    liff: liffObject,
    liffError: liffError,
  };

  return <LIFFContext.Provider value={value}>{children}</LIFFContext.Provider>;
}

function useLIFF() {
  const context = useContext(LIFFContext);

  if (context === undefined) {
    throw new Error("useLIFF must be used within a LIFFProvider");
  }

  return context;
}

export { LIFFProvider, useLIFF };
