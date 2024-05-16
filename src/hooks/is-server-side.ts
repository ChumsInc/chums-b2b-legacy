import {useEffect, useState} from "react";

export const useIsSSR = () => {
    const [isSSR, setIsSSR] = useState(!(typeof window !== 'undefined'
        && window.document
        && window.document.createElement));

    useEffect(() => {
        setIsSSR(() => false);
    }, [])

    return isSSR;
}
