function generateId() {
  const characters = "abcdefghij0123456789";
  let id = "";
  for (let i = 0; i < 4; i++) {
    id += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return id;
}

module.exports = generateId;
