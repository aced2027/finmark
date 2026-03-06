"use client";
import { useEffect, useRef, memo } from 'react';

function LiveStockBar() {
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
          { "proName": "NSE:NIFTY", "title": "NIFTY 50" },
          { "proName": "BSE:SENSEX", "title": "S&P BSE Sensex" },
          { "proName": "NSE:BANKNIFTY", "title": "Nifty Bank Index" },
          { "proName": "BITSTAMP:BTCUSD", "title": "Bitcoin" },
          { "proName": "NSE:NIFTYMIDCAP50", "title": "Nifty Midcap 50" },
          { "proName": "NSE:NIFTYIT", "title": "Nifty IT" },
          { "proName": "FOREXCOM:SPXUSD", "title": "S&P 500" },
          { "proName": "BITSTAMP:ETHUSD", "title": "Ethereum" }
        ],
        "showSymbolLogo": true,
        "isTransparent": false,
        "displayMode": "adaptive",
        "colorTheme": "dark",
        "locale": "en"
      }`;
        container.current?.appendChild(script);
    }, []);

    return (
        <div className="w-full bg-[#080b12] border-b border-white/[0.06] overflow-hidden">
            <div className="tradingview-widget-container" ref={container} style={{ width: "100%" }}>
                <div className="tradingview-widget-container__widget"></div>
            </div>
        </div>
    );
}

export default memo(LiveStockBar);
