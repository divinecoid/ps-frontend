import { useEffect, useState } from "react";

export function useFullscreen() {
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        window.electronAPI.onFullscreenChange(setIsFullscreen);
    }, []);

    return isFullscreen;
}