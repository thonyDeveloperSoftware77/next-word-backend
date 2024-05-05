/* eslint-disable prettier/prettier */

export default function isValidUid(uid) {
  console.log(uid);
  return uid.length == 27;
}



/**
 * Generates a code.
 * This function generates a code for course, length 8.
 */
export function codeGenerator() {
  let code = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}    