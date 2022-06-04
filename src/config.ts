import fs = require('fs');
import path = require('path');

// APPLICATION
const appPort = process.env.APP_PORT;
if (!appPort) {
   throw new Error('APP_PORT enviroment variable is not set');
}
const APP_PORT = parseInt(appPort, 10);
if (!APP_PORT) {
   throw new Error('incorrect APP_PORT value');
}

// JWT
let privateKey: Buffer;
try {
   privateKey = fs.readFileSync(path.join(process.cwd(), 'private_key.pem'));
} catch {
   throw new Error('private_key.pem is not shiped');
}

let publicKey: Buffer;
try {
   publicKey = fs.readFileSync(path.join(process.cwd(), 'public_key.pem'));
} catch {
   throw new Error('public_key.pem is not shiped');
}


export const config = Object.freeze({
   // APPLICATION
   APP_PORT,

   // JWT
   PRIVATE_KEY: privateKey.toString(),
   PUBLIC_KEY: publicKey.toString(),
});