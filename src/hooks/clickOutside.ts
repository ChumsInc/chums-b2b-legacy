import React, {useEffect} from "react";

export function useClickOutside(ref:React.RefObject<any>, handler: () => void) {
    useEffect(() => {
        const listener = (ev:MouseEvent|TouchEvent) => {
            if (!ref.current || ref.current?.contains(ev.target)) {
                return;
            }
            handler();
        }
        window.addEventListener('mousedown', listener);
        window.addEventListener('touchstart', listener);
        return () => {
            window.removeEventListener('mousedown', listener);
            window.removeEventListener('touchstart', listener);
        }
    }, [ref, handler]);
}
