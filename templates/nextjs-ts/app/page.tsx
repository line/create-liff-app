"use client";

import type { Liff } from "@line/liff";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

export default function HomePage() {
  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initLiff = async () => {
      try {
        const liffModule = await import("@line/liff");
        const liff = (liffModule.default ?? liffModule) as Liff;

        console.log("LIFF init...");
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! });
        console.log("LIFF init succeeded.");

        if (isMounted) {
          setLiffObject(liff);
          setLiffError(null);
        }
      } catch (error) {
        console.log("LIFF init failed.");
        if (isMounted) {
          setLiffError(error instanceof Error ? error.toString() : "Unknown LIFF error");
        }
      }
    };

    initLiff();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className={styles.main}>
      <h1>create-liff-app</h1>
      {liffObject && <p>LIFF init succeeded.</p>}
      {liffError && (
        <>
          <p>LIFF init failed.</p>
          <p>
            <code>{liffError}</code>
          </p>
        </>
      )}
      <a
        href="https://developers.line.biz/ja/docs/liff/"
        target="_blank"
        rel="noreferrer"
      >
        LIFF Documentation
      </a>
    </main>
  );
}
