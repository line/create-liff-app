"use client";

import { createContext, useContext, useEffect, useState } from "react";

const LIFFContext = createContext({
  liff: null,
  liffError: null,
});

function LIFFProvider({ children }) {
  const [liffObject, setLiffObject] = useState(null);
  const [liffError, setLiffError] = useState(null);

  // Execute liff.init() when the app is initialized
  useEffect(() => {
    // to avoid `window is not defined` error
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
