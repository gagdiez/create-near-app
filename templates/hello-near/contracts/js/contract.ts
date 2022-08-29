import { NearBindgen, NearContract, near, call, view } from 'near-sdk-js';

// The @NearBindgen decorator allows this code to compile
// to a NEAR-compatible Wasm file.
@NearBindgen
class HelloNear extends NearContract {
  greeting: string;

  constructor({greeting}:{greeting: string}) {
    super();
    this.greeting = greeting;
  }

  default(){ return new HelloNear({greeting: 'Hello'}) }

  // @call indicates that this is a method that changes the
  // contract's state. Change methods cost gas to the caller.
  @call
  set_greeting({ greeting }: { greeting: string }): void {
    // Record a log permanently to the blockchain!
    near.log(`Saving greeting ${greeting}`);
    this.greeting = greeting;
  }

  // @view indicates the function performs read-only operations
  // View calls are free and do not cost gas to the caller.
  @view
  get_greeting(): string {
    return this.greeting;
  }
}
