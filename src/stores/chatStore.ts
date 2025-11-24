import { writable } from 'svelte/store';
import type { ChatState, Message, User } from '../types';
import { loadSession, saveSession, getSessionId } from '../services/session';

const initialState: ChatState = {
    messages: [],
    currentUser: null,
    sessionId: getSessionId(),
    isLoading: false
};

// Load persisted state if available
const persisted = loadSession();
const startState = persisted ? { ...initialState, ...persisted } : initialState;

function createChatStore() {
    const { subscribe, set, update } = writable<ChatState>(startState);

    return {
        subscribe,
        addMessage: (message: Message) => update(state => {
            const newState = { ...state, messages: [...state.messages, message] };
            saveSession(newState);
            return newState;
        }),
        setLoading: (loading: boolean) => update(state => ({ ...state, isLoading: loading })),
        setUser: (user: User) => update(state => {
            const newState = { ...state, currentUser: user };
            saveSession(newState);
            return newState;
        }),
        reset: () => {
            set(initialState);
            // Optionally clear session from storage too, or just reset in memory
        }
    };
}

export const chatStore = createChatStore();
