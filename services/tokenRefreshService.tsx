import { getTokenData, storeTokens, clearTokens } from '@/hooks/token';
import { authEmitter, handleErrorMessages } from '@/utils/utils';
import { refreshToken as refreshTokenApi } from "@/api/authApi";
import { TokenData } from "@/api/types";

class TokenRefreshService {

    private refreshTimer: number = 0;
    private isRefreshing = false;

    start() {
        console.log('Token refresh service started');
        this.stop();
        this.scheduleNextRefresh();
    }

    stop() {
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
            this.refreshTimer = 0;
        }
        console.log('Token refresh service stopped');
    }

    private async scheduleNextRefresh() {
        const tokenData: TokenData | null = await getTokenData();

        if (!tokenData?.expires_at) {
            console.log('No token data, stopping refresh scheduling');
            return;
        }

        const now = Date.now();
        const expiresAt = tokenData.expires_at;
        console.log('token expires at: ', expiresAt);
        const refreshBuffer = 5 * 60 * 1000;

        const timeUntilRefresh = expiresAt - now - refreshBuffer;

        if (timeUntilRefresh <= 0) {
            console.log('Token almost expired, refreshing now');
            await this.refreshToken();
            return;
        }
        console.log(`⏳ Next refresh in ${Math.round(timeUntilRefresh / 1000)} seconds`);

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
            const tokenData = await getTokenData();

            if (!tokenData?.refresh_token) {
                console.error("No refresh token available");
                await this.handleRefreshFailure();
                return false;
            }

            console.log('Refreshing access token...');

            const response = await refreshTokenApi({
                access_token: tokenData.access_token,
                refresh_token: tokenData.refresh_token,
                expires_at: tokenData.expires_at
            });
            const { access_token, refresh_token, expires_in } = response.data;

            await storeTokens(access_token, refresh_token, expires_in);
            console.log('Token refreshed successfully');
            this.scheduleNextRefresh();
            return true;
        } catch (error) {
            const message = handleErrorMessages(error);
            console.error("Refresh failed:", message);
            await this.handleRefreshFailure();
            return false;
        } finally {
            this.isRefreshing = false;
        }
    }

    private async handleRefreshFailure() {
        console.log('Refresh failed → clearing session');
        await clearTokens();
        authEmitter.emit("authChanged");
        this.stop();
    }
}

export const tokenRefreshService = new TokenRefreshService();
