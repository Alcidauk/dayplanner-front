interface AlertOptions {
    title: string;
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}

class AlertManager {
    private showAlertFunction: ((options: AlertOptions) => void) | null = null;

    setShowAlert(fn: (options: AlertOptions) => void) {
        this.showAlertFunction = fn;
    }

    show(options: AlertOptions) {
        if (this.showAlertFunction) {
            this.showAlertFunction(options);
        } else {
            console.warn('AlertProvider not initialized');
        }
    }
}

export const alertManager = new AlertManager();

export const showAlert = (type: 'success' | 'error' | 'warning' | 'info' = 'info', title: string, message: string) => {
    alertManager.show({ type, title, message });
};
