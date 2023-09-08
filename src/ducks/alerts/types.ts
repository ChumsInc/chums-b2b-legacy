import {BootstrapBGColor} from "../../types/colors";

export type AlertType = BootstrapBGColor;

export interface B2BContextAlert {
    id: number;
    type?: AlertType;
    title?: string;
    message: string;
    context?: string;
    count?: number;
}

export interface AlertsState {
    index: number;
    list: B2BContextAlert[];
}

export interface AlertProps {
    type?: AlertType;
    title?: string;
    message: string;
    context?: string;
}
