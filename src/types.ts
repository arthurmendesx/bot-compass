export interface User {
    id: string;
    name: string;
    avatarUrl?: string;
}

export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: number;
    isTyping?: boolean;
}

export interface ChatState {
    messages: Message[];
    currentUser: User | null;
    sessionId: string;
    isLoading: boolean;
}
