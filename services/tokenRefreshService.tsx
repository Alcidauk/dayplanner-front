import { getTokenData, storeTokens, clearTokens, isTokenExpired } from '@/hooks/token';
import {authEmitter, handleErrorMessages} from '@/utils/utils';
import {refreshToken} from "@/api/authApi";
import {showAlert} from "@/utils/alertManager";
import {TokenData} from "@/api/types";

class TokenRefreshService {
    private refreshTimer: number = 0;
    private isRefreshing = false;

    start() {
        console.log('Token refresh service started');
        this.scheduleNextRefresh();
    }

    stop() {
        console.log('Token refresh service stopped');
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
            this.refreshTimer = 0;
        }
    }

    private async scheduleNextRefresh() {
        const tokenData: TokenData | null = await getTokenData();
        if (!tokenData) {
            console.log('No token data, stopping refresh service');
            return;
        }
        const now: number = Date.now();
        const expiresAt: number = tokenData.expires_at;
        const timeUntilExpiry: number = expiresAt - now;
        const refreshBuffer: number = 5 * 60 * 1000;
        const timeUntilRefresh: number = Math.max(0, timeUntilExpiry - refreshBuffer);
        console.log(`Next refresh scheduled in ${Math.round(timeUntilRefresh / 1000)} seconds`);
        this.refreshTimer = setTimeout(() => {
            this.refreshToken();
        }, timeUntilRefresh);
    }

    async refreshToken(): Promise<boolean> {
        if (this.isRefreshing) {
            console.log('Refresh already in progress');
            return false;
        }
        this.isRefreshing = true;
        try {
            const tokenData: TokenData | null = await getTokenData();
            if (!tokenData?.refresh_token) {
                console.error("Pas de refresh token disponible");
                await this.handleRefreshFailure();
                return false;
            }
            console.log('Refreshing access token...');

            const response = await refreshToken(tokenData)
            const { access_token, refresh_token, expires_in } = response.data;
            await storeTokens(access_token, refresh_token, expires_in);
            console.log('✅ Token refreshed successfully');
            this.scheduleNextRefresh();
            return true;
        } catch (error) {
            let message: string = handleErrorMessages(error)
            showAlert('error', "Erreur", message)
            await this.handleRefreshFailure();
            return false;
        } finally {
            this.isRefreshing = false;
        }
    }

    private async handleRefreshFailure() {
        await clearTokens();
        authEmitter.emit("authChanged");
        this.stop();
    }

    async checkAndRefresh(): Promise<boolean> {
        const expired: boolean = await isTokenExpired(300); // 5 minutes de buffer
        if (expired) {
            return await this.refreshToken();
        }
        return true;
    }
}
export const tokenRefreshService = new TokenRefreshService();
