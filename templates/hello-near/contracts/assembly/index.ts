import { logging, storage } from 'near-sdk-as';

const DEFAULT_MESSAGE = 'Hello';

// Public method - returns the greeting saved, defaulting to DEFAULT_MESSAGE
export function get_greeting(): string {
  return storage.getPrimitive<string>('message', DEFAULT_MESSAGE);
}

// Public method - accepts a greeting, such as 'howdy', and records it
export function set_greeting(message: string): void {
  // Use logging.log to record logs permanently to the blockchain!
  logging.log(`Saving greeting '${message}'`);
  storage.set<string>('message', message);
}