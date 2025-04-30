// Utility for API requests with consistent headers and error handling
import { API_URL, API_KEY } from '../constants/API_constants';

export async function apiRequest({ method = 'GET', endpoint = '', body = null, userToken = null })
{
    const headers = {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY,
    };
    if (userToken)
    {
        headers['Authorization'] = `Bearer ${userToken}`;
    }
    const options = {
        method,
        headers,
    };
    if (body)
    {
        options.body = JSON.stringify(body);
    }
    const url = endpoint ? `${API_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}` : API_URL;
    const response = await fetch(url, options);
    let json;
    try
    {
        json = await response.json();
    } catch
    {
        throw new Error('Invalid JSON response');
    }
    if (!response.ok)
    {
        const error = new Error(json.message || 'API error');
        error.status = response.status;
        throw error;
    }
    return json;
}
