const API = require('discord.js')

const num = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣']

async function fn (client, msg, db) {
  const dice = Math.floor(Math.random() * (6 - 1 + 1))
  const timeout = new API.MessageEmbed({
    title: ':warning: 30초가 지났습니다.',
    description: '배팅 금액 전부를 잃습니다.'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)
  const warn = new API.MessageEmbed({
    title: ':warning: 배팅할수 없습니다.'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)
  const success = new API.MessageEmbed({
    title: '<:success:791086585864388638> 배팅결과!'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)
  const fail = new API.MessageEmbed({
    title: ':warning: 배팅 실패.'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)
  const start = new API.MessageEmbed({
    title: '<:success:791086585864388638> 주사위 맞추기!',
    description: '총 6개의 선택지중 예상하는 주사위 수를 맞춰주세요.\n30초 안에 선택하지 않으면 배팅한 모든 금액을 잃습니다.'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)

  const [user] = await db.where({ id: msg.author.id }).select('*').from('users')
  const money = Number(msg.content.split(' ')[1])
  if (!money) return msg.channel.send(warn.setDescription('배팅할 금액을 입력해 주세요.\n남은 돈 : **' + user.coin + '￦**'))
  if (user.coin < money) return msg.channel.send(warn.setDescription('유저의 돈이 부족합니다.\n남은 돈 : **' + user.coin + '￦**'))
  if (money < 2000) return msg.channel.send(warn.setDescription('2000 이하의 돈은 배팅할수 없습니다.\n남은 돈 : **' + user.coin + '￦**'))
  await db.where({ id: msg.author.id }).select('*').from('users').update({ coin: user.coin - money })
  const m = await msg.channel.send(start)
  m.react('1️⃣'); m.react('2️⃣'); m.react('3️⃣'); m.react('4️⃣'); m.react('5️⃣'); m.react('6️⃣')

  m.awaitReactions((r, u) => num.includes(r.emoji.name) && u.id === msg.author.id, { max: 1, time: 30000, errors: ['time'] })
    .then(async collected => {
      const reaction = collected.first()
      const [moneyuser] = await db.where({ id: msg.author.id }).select('*').from('users')
      if (num.indexOf(reaction.emoji.name) === dice) {
        await db.where({ id: msg.author.id }).update({ coin: moneyuser.coin + (money * 2) }).select('*').from('users')
        msg.channel.send(success.setDescription(num[dice] + ' 주사위 수를 맞춰 2배를 획득하셨습니다!\n추가 된 돈 : **' + money * 2 + '￦**'))
      } else {
        msg.channel.send(fail.setDescription('주사위는 ' + num[dice] + '이였습니다.\n추가 된 돈 : **' + money * 0 + '￦**'))
      }
    })
    .catch(collected => {
      msg.channel.send(timeout)
    })
}

module.exports = fn
module.exports.aliases = ['dice', '주사위']
