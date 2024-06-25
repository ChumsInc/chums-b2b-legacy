import {useEffect, useState} from "react";

const testIsBrowser = () => {
    return typeof window !== 'undefined'
        && window?.document
        && window?.document?.createElement
}

export const useIsSSR = () => {
    const [isSSR, setIsSSR] = useState(!testIsBrowser());

    useEffect(() => {
        setIsSSR(() => false);
    }, [])

    return isSSR;
}
