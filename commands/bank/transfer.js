const API = require('discord.js')

async function fn (client, msg, db) {
  const warn = new API.MessageEmbed({
    title: ':warning: 보낼수 없습니다.'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)
  const success = new API.MessageEmbed({
    title: '<:success:791086585864388638> 이체했습니다.'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)
  const [user] = await db.where({ id: msg.author.id }).from('users').select('*')
  const args = msg.content.slice(2).split(' ')
  const mention = getUserFromMention(args[1])
  const money = Number(args[2])

  if (!mention) return msg.channel.send(warn.setDescription('보낼수 없는 유저입니다.\n남은 돈 : **' + user.coin + '￦**'))
  if (mention.bot) return msg.channel.send(warn.setDescription('보낼수 없는 유저입니다.\n남은 돈 : **' + user.coin + '￦**'))
  if (mention.id === msg.author.id) return msg.channel.send(warn.setDescription('보낼수 없는 유저입니다.\n남은 돈 : **' + user.coin + '￦**'))
  const [senduser] = await db.where({ id: mention.id }).from('users').select('*')
  if (!senduser) return msg.channel.send(warn.setDescription('보낼수 없는 유저입니다.\n남은 돈 : **' + user.coin + '￦**'))
  if (money < 1000) return msg.channel.send(warn.setDescription('보낼수 있는 최소 단위는 1000￦ 입니다.\n남은 돈 : **' + user.coin + '￦**'))
  if (user.coin < money) return msg.channel.send(warn.setDescription('돈이 부족합니다.\n남은 돈 : **' + user.coin + '￦**'))

  // await db.update({ coin: }).where({ id: msg.author.id }).from('users').select('*')
  // await db.update({ coin:  }).where({ id: msg.author.id }).from('users').select('*')
  msg.channel.send(success)

  function getUserFromMention (mention) {
    if (!mention) return
    if (mention.startsWith('<@') && mention.endsWith('>')) {
      mention = mention.slice(3, -1)
      if (mention.startsWith('!')) mention = mention.slice(1)
      return client.users.cache.get(mention)
    }
  }
}

module.exports = fn
module.exports.aliases = ['계좌이체', '이체', 'transfer']
module.exports.stop = true
