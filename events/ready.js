module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`${client.user.tag} olarak giriş yapıldı!`);
    client.user.setActivity('/yardım | Moderasyon Botu', { type: 3 });
  },
};
