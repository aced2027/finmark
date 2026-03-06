"use client";
import React, { useEffect, useRef, memo } from 'react';

function TradingViewScreener() {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (container.current && container.current.innerHTML !== "") return;

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = `
      {
        "width": "100%",
        "height": "100%",
        "defaultColumn": "overview",
        "defaultScreen": "general",
        "market": "india",
        "showToolbar": true,
        "colorTheme": "dark",
        "locale": "en",
        "isTransparent": true
      }`;
        container.current?.appendChild(script);
    }, []);

    return (
        <div className="tradingview-widget-container w-full h-full" ref={container}>
            <div className="tradingview-widget-container__widget w-full h-full"></div>
        </div>
    );
}

export default memo(TradingViewScreener);
