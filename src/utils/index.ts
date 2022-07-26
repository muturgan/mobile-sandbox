import crypto = require('crypto');

export const hashPassword = (password: string) => crypto
   .createHash('sha256')
   .update(password)
   .digest('base64url');
