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

const APP_DOMAIN = process.env.APP_DOMAIN;
if (!APP_DOMAIN) {
   throw new Error('APP_DOMAIN enviroment variable is not set');
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
   APP_DOMAIN,

   // JWT
   PRIVATE_KEY: privateKey.toString(),
   PUBLIC_KEY: publicKey.toString(),

   // DEV
   DEV_MODE: process.env.NODE_ENV === 'develop',
});