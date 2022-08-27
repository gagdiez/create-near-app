import { logging, storage } from 'near-sdk-as';

const DEFAULT_MESSAGE = 'Hello';

// Public - returns the stored greeting defaulting to DEFAULT_MESSAGE
export function get_greeting(): string {
  return storage.getPrimitive('message', DEFAULT_MESSAGE);
}

// Public - accepts a greeting, such as 'howdy', and records it
export function set_greeting(message: string): void {
  // Use logging.log to record logs permanently to the blockchain!
  logging.log(`Saving greeting '${message}'`);
  storage.set('message', message);
}