"use client";
import { useEffect, useRef, memo } from 'react';

function TradingViewTicker() {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (container.current && container.current.innerHTML !== "") return;
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = `
      {
        "symbols": [
          { "proName": "BSE:SENSEX", "title": "Sensex" },
          { "proName": "BSE:NIFTY", "title": "Nifty 50" },
          { "proName": "FOREXCOM:SPXUSD", "title": "S&P 500" },
          { "proName": "FOREXCOM:NSXUSD", "title": "US 100" },
          { "proName": "FX_IDC:EURUSD", "title": "EUR to USD" },
          { "proName": "BITSTAMP:BTCUSD", "title": "Bitcoin" },
          { "proName": "BITSTAMP:ETHUSD", "title": "Ethereum" }
        ],
        "showSymbolLogo": true,
        "isTransparent": true,
        "displayMode": "regular",
        "colorTheme": "dark",
        "locale": "en"
      }`;
        container.current?.appendChild(script);
    }, []);

    return (
        <div className="h-[46px] border-b border-white/[0.06] bg-[#080b12] flex-shrink-0 relative overflow-hidden flex items-center">
            <div className="tradingview-widget-container" ref={container} style={{ width: "100%", display: "flex", alignItems: "center" }}>
                <div className="tradingview-widget-container__widget"></div>
            </div>
        </div>
    );
}

export default memo(TradingViewTicker);
