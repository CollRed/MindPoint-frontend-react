// src/utils/authFetch.js

const API_BASE_URL = '/api';

export async function authFetch(input, init = {}, retry = true) {
    const isRefreshing = input === '/auth/refresh'; // ключевое условие

    const accessToken = localStorage.getItem('access_token');

    const headers = new Headers(init.headers || {});
    if (accessToken && !isRefreshing) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }

    const response = await fetch(API_BASE_URL + input, {
        ...init,
        headers,
        credentials: 'include',
    });

    if (response.status === 401 && retry && !isRefreshing) {
        const success = await refreshAccessToken();

        if (success) {
            return authFetch(input, init, false);
        } else {
            localStorage.removeItem('access_token');
            window.location.href = '/login';
        }
    }

    return response;
}

async function refreshAccessToken() {
    try {
        const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'GET',
            credentials: 'include', // обязательное условие для куки
        });

        if (!res.ok) return false;

        const data = await res.json();
        localStorage.setItem('access_token', data.access);
        return true;
    } catch (e) {
        console.error('Ошибка при обновлении access token:', e);
        return false;
    }
}
