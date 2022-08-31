import { NearContract, NearBindgen, near, call, view } from 'near-sdk-js'

// If the user attaches more than 0.01N the message is premium
const PREMIUM_PRICE = BigInt('10000000000000000000000');

class PostedMessage {
    premium: boolean;
    sender: string;
    text: string;

    constructor(text) {
        this.premium = near.attachedDeposit() >= PREMIUM_PRICE;
        this.sender = near.predecessorAccountId();
        this.text = text;
    }
}


@NearBindgen
class GuestBook extends NearContract {
    messages: PostedMessage[];

    constructor() {
        super()
        this.messages = [];
    }

    default() { return new Contract() }

    @call
    // Adds a new message under the name of the sender's account id.
    addMessage({ text }: { text: string }) {
        const message = new PostedMessage(text);
        near.log(message);
        this.messages.push(message);
    }
    
    @view
    // Returns an array of last N messages.
    getMessages({ fromIndex = 0, limit = 10 }: { fromIndex: number, limit: number }): PostedMessage[] {
        // Paginate the messages using the fromIndex and limit parameters
        return this.messages.slice(fromIndex, fromIndex + limit);
    }
}