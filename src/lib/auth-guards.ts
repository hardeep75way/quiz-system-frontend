import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

/**
 * Attempt to refresh the access token if refresh token exists
 * This is used by route loaders to handle token refresh during navigation
 */
export async function attemptTokenRefresh(): Promise<boolean> {
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken');

    // If we already have an access token, no need to refresh
    if (accessToken) {
        return true;
    }

    // If no refresh token, can't refresh
    if (!refreshToken) {
        return false;
    }

    try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
        });

        const { access_token, refresh_token: new_refresh_token } = response.data;

        // Update localStorage
        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('refreshToken', new_refresh_token);

        // Update Redux store
        try {
            const { store } = await import('@/store');
            const { setCredentials } = await import('@/store/slices/authSlice');

            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                store.dispatch(setCredentials({
                    user,
                    accessToken: access_token,
                    refreshToken: new_refresh_token,
                }));
            }
        } catch (storeError) {
            console.warn('Failed to update Redux store:', storeError);
        }

        return true;
    } catch (error) {
        // Refresh failed, clear tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        return false;
    }
}

/**
 * Check if user is authenticated, attempting token refresh if needed
 */
export async function isAuthenticated(): Promise<boolean> {
    // Try to refresh if access token is missing
    return await attemptTokenRefresh();
}

/**
 * Check if user is admin, attempting token refresh if needed
 */
export async function isAdmin(): Promise<boolean> {
    // First ensure we're authenticated
    const authenticated = await attemptTokenRefresh();
    if (!authenticated) {
        return false;
    }

    // Check user role from localStorage
    const userStr = localStorage.getItem('user');
    if (!userStr) {
        return false;
    }

    try {
        const user = JSON.parse(userStr);
        return user.role === 'admin';
    } catch {
        return false;
    }
}
