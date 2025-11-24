import { v4 as uuidv4 } from 'uuid';
import type { ChatState } from '../types';

const STORAGE_KEY = 'bot_compass_session';

export const getSessionId = (): string => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (parsed.sessionId) return parsed.sessionId;
        } catch (e) {
            console.error('Failed to parse session', e);
        }
    }

    const newId = uuidv4();
    // We don't save immediately here, we wait for the first state save or explicit save
    return newId;
};

export const loadSession = (): Partial<ChatState> | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    try {
        return JSON.parse(stored);
    } catch (e) {
        console.error('Failed to load session', e);
        return null;
    }
};

export const saveSession = (state: Partial<ChatState>) => {
    try {
        // We might not want to save everything, e.g., isLoading
        const { messages, currentUser, sessionId } = state;
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, currentUser, sessionId }));
    } catch (e) {
        console.error('Failed to save session', e);
    }
};

export const clearSession = () => {
    localStorage.removeItem(STORAGE_KEY);
};
