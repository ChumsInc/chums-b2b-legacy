import {BootstrapBGColor} from "../../types/colors";

export type AlertType = BootstrapBGColor;

export interface B2BAlert {
    id: number;
    type?: AlertType;
    title?: string;
    message: string;
    context?: string;
    count?: number;
}

export interface AlertsState {
    index: number;
    list: B2BAlert[];
}

export interface AlertProps {
    type?: AlertType;
    title?: string;
    message: string;
    context?: string;
}
