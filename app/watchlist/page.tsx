import { WatchlistPanel } from "@/components/watchlist/WatchlistPanel";

export default function WatchlistPage() {
    return (
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 custom-scrollbar h-[calc(100vh-5.5rem)]">
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
                        My Watchlists
                    </h1>
                    <p className="text-sm text-slate-400">
                        Manage your personal watchlists, synchronized across all devices.
                    </p>
                </div>
                <div className="h-[600px]">
                    <WatchlistPanel />
                </div>
            </div>
        </div>
    );
}
