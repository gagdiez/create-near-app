import { NearContract, NearBindgen, near, call, view } from 'near-sdk-js'
import { POINT_ONE, PostedMessage } from './model'

@NearBindgen
class GuestBook extends NearContract {
  messages: PostedMessage[];

  constructor() {
    super()
    this.messages = [];
  }

  default() { return new GuestBook() }

  @call
  // Public - Adds a new message.
  add_message({ text }: { text: string }) {
    // If the user attaches more than 0.01N the message is premium
    const premium = near.attachedDeposit() >= BigInt(POINT_ONE);
    const sender = near.predecessorAccountId();

    const message = new PostedMessage({premium, sender, text});
    this.messages.push(message);
  }
  
  @view
  // Returns an array of last N messages.
  get_messages({ fromIndex = 0, limit = 10 }: { fromIndex: number, limit: number }): PostedMessage[] {
    // Paginate the messages using the fromIndex and limit parameters
    return this.messages.slice(fromIndex, fromIndex + limit);
  }
}