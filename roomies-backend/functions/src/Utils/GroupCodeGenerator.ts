export function generateGroupCode(length = 6): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  return Array.from({length}, ()=>characters[Math.floor(Math.random() * charactersLength)]).join(' ')
}
