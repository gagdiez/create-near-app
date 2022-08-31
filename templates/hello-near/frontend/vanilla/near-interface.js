export class Contract{
  wallet;

  constructor({wallet}){
    this.wallet = wallet
  }

  async getGreeting(){
    return await wallet.viewMethod({method: "get_greeting"});
  }
  
  async setGreeting(message){
    return await wallet.callMethod({method: "set_greeting", args:{message}})
  }
}