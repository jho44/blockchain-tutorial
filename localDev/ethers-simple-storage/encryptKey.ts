/*
plan A: store wallet's private key in .env
plan B: in case you're scared of accidentally pushing .env to github,
you can do sth like `RPC_URL=<blah> PRIVATE_KEY=<blah> node deploy.sh` in your terminal

however, plan A is just neater
plan C: improving on plan A
don't just leave your private key lying around in plaintext; encrypt it
run this file once to get .encryptedKey.json
then can rm PRIVATE_KEY and PRIVATE_KEY_PASSWORD from .env
oh but still have to provide PRIVATE_KEY_PASSWORD like `PRIVATE_KEY_PASSWORD=<blah> node deploy.sh`

and if you're concerned about someone hacking your computer and looking through your terminal history
for the PRIVATE_KEY_PASSWORD, you can clear your history with `history -c`
*/
import { ethers } from "ethers";
import * as fs from "fs";
import "dotenv/config";

async function main() {
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!);
  const encryptedJsonKey = await wallet.encrypt(
    process.env.PRIVATE_KEY_PASSWORD!,
    process.env.PRIVATE_KEY!,
  );
  console.log(encryptedJsonKey);
  fs.writeFileSync("./.encryptedKey.json", encryptedJsonKey);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
