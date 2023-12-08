import { Buffer } from 'buffer';

/**
 * 将卡组id列表转换为卡组分享码
 * @param code The code string to decode.
 * @returns An array of numbers.
 */
export function encode(cardIds: number[], salt: number): string {
  const bytes = Buffer.alloc(51);
  for(let i = 0; i < 16; i++) {
    const threeByteStr = `${idToBinStr(cardIds[2*i])}${idToBinStr(cardIds[2*i+1])}`;
    bytes.writeUInt8(bytesSalt(parseInt(threeByteStr.slice(0, 8), 2), salt), 3*i);
    bytes.writeUInt8(bytesSalt(parseInt(threeByteStr.slice(8, 16), 2), salt), 3*i + 1);
    bytes.writeUInt8(bytesSalt(parseInt(threeByteStr.slice(16, 24), 2), salt), 3*i + 2);
  }
  const lastCardBinStr = `${idToBinStr(cardIds[32]).padEnd(16, '0')}`;
  bytes.writeUInt8(bytesSalt(parseInt(lastCardBinStr.slice(0, 8), 2), salt), 48);
  bytes.writeUInt8(bytesSalt(parseInt(lastCardBinStr.slice(8, 16), 2), salt), 49);
  const newBytes = Buffer.alloc(51);
  for(let i = 0; i < 25; i++) {
    newBytes.writeUInt8(bytes[i], 2*i);
  }
  for(let i = 25; i < 50; i++) {
    newBytes.writeUInt8(bytes[i], 2*i - 49);
  }
  newBytes.writeUInt8(salt, 50);
  return newBytes.toString('base64');
}

const idToBinStr = (id: number) => id.toString(2).padStart(12, '0');
const byteToBinStr = (byte: number) => byte.toString(2).padStart(8, '0');
const bytesSalt = (bytes: number, salt: number) => {
  return (bytes + salt) % 256;
}
const bytesSaltOut = (bytes: number, salt: number) => {
  return bytes - salt < 0 ? bytes - salt + 256 : bytes - salt;
}
/**
 * 将卡组分享码转换为卡组id列表
 * @param code The code string to decode.
 * @returns An array of numbers.
 */
export function decode(code: string): any[] {
  const bytes = Buffer.from(code, 'base64');
  const salt = bytes[bytes.length - 1];
  const newBytes = Buffer.alloc(50);
  for(let i = 0; i < 25; i++) {
    newBytes.writeUInt8(bytesSaltOut(bytes[2*i], salt), i);
  }
  for(let i = 25; i < 50; i++) {
    newBytes.writeUInt8(bytesSaltOut(bytes[2*i - 49], salt), i);
  }
  const cardIds: number[] = [];
  for(let i = 0; i < 16; i++) {
    const head = 3 * i
    const binStr = `${byteToBinStr(newBytes[head])}${byteToBinStr(newBytes[head+1])}${byteToBinStr(newBytes[head+2])}`;
    const cardId1 = parseInt(binStr.slice(0, 12), 2);
    const cardId2 = parseInt(binStr.slice(13), 2);
    cardIds.push(cardId1);
    cardIds.push(cardId2);
  }
  const lastCardBinStr = `${byteToBinStr(newBytes[48])}${byteToBinStr(newBytes[49])}`;
  const lastCardId = parseInt(lastCardBinStr.slice(0, 12), 2);
  cardIds.push(lastCardId)
  return cardIds;
}