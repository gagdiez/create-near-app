export const POINT_ONE = '10000000000000000000000';

export class PostedMessage {
  premium: boolean;
  sender: string;
  text: string;

  constructor({ premium, sender, text }: { premium: boolean, sender: string, text: string }) {
    this.premium = premium;
    this.sender = sender;
    this.text = text;
  }
}