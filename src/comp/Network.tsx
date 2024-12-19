import React from "react";
import { useNetworkState } from "use-network-state3";
import { ErrorAlert } from "./Alert";

const NetworkStatus = () => {
    const networkState = useNetworkState();

    return !networkState.online ? <ErrorAlert text={'У вас плохое соединение'} /> : null;
}

export {NetworkStatus}