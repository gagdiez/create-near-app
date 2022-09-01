import {utils} from 'near-api-js';

export class Contract{
  wallet;

  constructor({wallet}){
    this.wallet = wallet
  }

  async getMessages(){
    const messages = await this.wallet.viewMethod({method: "get_messages"})
    console.log(messages)
    return messages
  }

  async addMessage(message, donation){
    const deposit = utils.format.parseNearAmount(donation);
    return await this.wallet.callMethod({method: "add_message", args: {text: message}, deposit});
  }
}