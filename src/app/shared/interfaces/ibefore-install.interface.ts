// Define the BeforeInstallPromptEvent interface if it's not available in your TypeScript environment
export interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}