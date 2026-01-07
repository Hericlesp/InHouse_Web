// API utility for making requests to backend
const API_URL = import.meta.env.DEV ? 'http://localhost:3001/api' : '/api';

export async function apiRequest(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint} `, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || 'Request failed');
    }

    return response.json();
}

// Auth API
export const authApi = {
    login: (email, password) =>
        apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),

    signup: (name, email, password, user_type) =>
        apiRequest('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ name, email, password, user_type }),
        }),

    updateProfile: (profileData) =>
        apiRequest('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        }),
};

// Posts API
export const postsApi = {
    getAll: () => apiRequest('/posts'),

    create: (postData) =>
        apiRequest('/posts', {
            method: 'POST',
            body: JSON.stringify(postData),
        }),

    like: (postId, liked) =>
        apiRequest(`/posts/${postId}/like`, {
            method: 'POST',
            body: JSON.stringify({ liked }),
        }),
};

// Properties API
export const propertiesApi = {
    getAll: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        const query = params.toString();
        return apiRequest(`/properties${query ? `?${query}` : ''}`);
    },

    getById: (id) => apiRequest(`/properties/${id}`),
};

// Favorites API
export const favoritesApi = {
    add: (user_email, property_id) =>
        apiRequest('/favorites', {
            method: 'POST',
            body: JSON.stringify({ user_email, property_id }),
        }),

    remove: (property_id, user_email) =>
        apiRequest(`/favorites/${property_id}?user_email=${user_email}`, {
            method: 'DELETE',
        }),

    getAll: (user_email) =>
        apiRequest(`/favorites?user_email=${user_email}`),
};

// Interactions API
export const interactionsApi = {
    add: (user_email, property_id, interaction_type) =>
        apiRequest('/interactions', {
            method: 'POST',
            body: JSON.stringify({ user_email, property_id, interaction_type }),
        }),

    getStats: (propertyId) =>
        apiRequest(`/interactions/stats/${propertyId}`),
};

// Owner API
export const ownerApi = {
    getDashboard: (owner_email) =>
        apiRequest(`/owner/dashboard?owner_email=${owner_email}`),

    getProperties: (owner_email) =>
        apiRequest(`/owner/properties?owner_email=${owner_email}`),

    getLeads: (owner_email) =>
        apiRequest(`/owner/leads?owner_email=${owner_email}`),

    updateLead: (leadId, status) =>
        apiRequest(`/owner/leads/${leadId}`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        }),
};

// Chat API
export const chatApi = {
    getChats: (user_email) =>
        apiRequest(`/chats?user_email=${user_email}`),

    createChat: (user1_email, user2_email) =>
        apiRequest('/chats', {
            method: 'POST',
            body: JSON.stringify({ user1_email, user2_email }),
        }),

    getMessages: (chatId) =>
        apiRequest(`/chats/${chatId}/messages`),

    sendMessage: (chat_id, sender_email, content, message_type, related_id) =>
        apiRequest('/messages', {
            method: 'POST',
            body: JSON.stringify({ chat_id, sender_email, content, message_type, related_id }),
        }),
};

export default {
    auth: authApi,
    posts: postsApi,
    properties: propertiesApi,
    favorites: favoritesApi,
    interactions: interactionsApi,
};
