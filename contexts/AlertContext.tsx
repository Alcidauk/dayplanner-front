import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Custom_alert from '@/components/custom_alert';
import { alertManager } from '@/utils/alertManager';

interface AlertOptions {
    title: string;
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}

interface AlertContextType {
    showAlert: (options: AlertOptions) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
    const [alertConfig, setAlertConfig] = useState<AlertOptions | null>(null);
    const [visible, setVisible] = useState(false);

    const showAlert = (options: AlertOptions) => {
        setAlertConfig(options);
        setVisible(true);
    };

    useEffect(() => {
        alertManager.setShowAlert(showAlert);
    }, []);

    const hideAlert = () => {
        setVisible(false);
        setTimeout(() => setAlertConfig(null), 300);
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            {alertConfig && (
                <Custom_alert
                    visible={visible}
                    title={alertConfig.title}
                    message={alertConfig.message}
                    type={alertConfig.type}
                    confirmText={alertConfig.confirmText}
                    cancelText={alertConfig.cancelText}
                    onConfirm={alertConfig.onConfirm}
                    onCancel={alertConfig.onCancel}
                    onClose={hideAlert}
                />
            )}
        </AlertContext.Provider>
    );
}

export function useAlert() {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
}
