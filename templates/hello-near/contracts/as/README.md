# Hello NEAR Contract

The smart contract consists of two methods available for the user to call.

```ts
const DEFAULT_GREETING: string = 'Hello';

// Public - returns the stored greeting defaulting to 'Hello'
export function get_greeting(): string {
  return storage.getPrimitive('message', DEFAULT_GREETING);
}

// Public - accepts a new greeting, such as 'howdy', and records it
export function set_greeting(message: string): void {
  storage.set('message', message);
}
```

---

# Quickstart

You can automatically compile and deploy the contract in a "dev-account" by running:

```bash
npm run deploy
```

Once finished, check the `neardev/dev-account` file to find the address in which the contract was deployed:

```bash
cat ./neardev/dev-account
# e.g. dev-1659899566943-21539992274727
```

---

## Calling Methods From the Terminal
Once your contract is deployed you can interact with it from the `../frontend` or directly in the terminal. 

### Retrieving the Greeting
`get_greeting` is a read-only method (aka `view` method). `View` methods can be called for **free** by anyone, even people without a NEAR account!
```bash
near view <dev-account> get_greeting
```

### Storing a Greeting
`set_greeting` changes the contract's state, meaning it is a `call` method. `Call` methods can only be invoked using a NEAR account, since the account needs to pay GAS for the transaction.

```bash
# call the `set_greeting` method
near call <dev-account> set_greeting '{"message":"howdy"}' --accountId <dev-account>
```

#### Tip
If you would like to call `set_greeting` using your own account, first login into NEAR using:

```bash
near login
```

and then use your account to sign the transaction: `--accountId <your-account>`.