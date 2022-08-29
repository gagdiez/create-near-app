import { logging, storage } from 'near-sdk-as';

const DEFAULT_GREETING = 'Hello';

// Public: Returns the stored greeting, defaulting to 'Hello'
export function get_greeting(): string {
  return storage.get('greeting', DEFAULT_GREETING)!;
}

// Public: Takes a greeting, such as 'howdy', and records it
export function set_greeting(greeting: string): void {
  // Record a log permanently to the blockchain!
  logging.log(`Saving greeting '${greeting}'`);
  storage.set('greeting', greeting);
}