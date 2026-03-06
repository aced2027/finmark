"use client";
import { useEffect, useRef, memo } from 'react';

function TradingViewMarketOverview() {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (container.current && container.current.innerHTML !== "") return;
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = `
      {
        "colorTheme": "dark",
        "dateRange": "12M",
        "showChart": true,
        "locale": "en",
        "largeChartUrl": "",
        "isTransparent": true,
        "showSymbolLogo": true,
        "showFloatingTooltip": false,
        "width": "100%",
        "height": "100%",
        "tabs": [
          {
            "title": "Indices",
            "symbols": [
              { "s": "BSE:SENSEX", "d": "Sensex" },
              { "s": "BSE:NIFTY", "d": "Nifty 50" },
              { "s": "BSE:BANKNIFTY", "d": "Bank Nifty" },
              { "s": "BSE:MIDCAP", "d": "BSE Midcap" }
            ],
            "originalTitle": "Indices"
          }
        ]
      }`;
        container.current?.appendChild(script);
    }, []);

    return (
        <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
            <div className="tradingview-widget-container__widget" style={{ height: "100%", width: "100%" }}></div>
        </div>
    );
}

export default memo(TradingViewMarketOverview);
