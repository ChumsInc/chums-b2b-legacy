export type AlertType = 'primary' | 'success' | 'info' | 'secondary' | 'danger' |
    'warning' | 'light' | 'dark';

export interface B2BAlert {
    id: number;
    type: AlertType;
    title: string;
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
