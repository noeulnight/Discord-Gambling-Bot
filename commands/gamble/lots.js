const API = require('discord.js')

async function fn (client, msg, db) {
  const slot = []
  slot.push(Math.floor(Math.random() * (3 - 2 + 2)) + 2)
  slot.push(1)
  slot.push((Math.floor(Math.random() * (3 - 2 + 1)) + 2) * -1)
  shuffle(slot)
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
  const start = new API.MessageEmbed({
    title: '<:success:791086585864388638> 제비뽑기 시작~',
    description: '총 3개의 선택지중 x2~3 카드 하나, 그대로 유지, x-1~3 카드가 있습니다.\n아래 3개의 이모지중 하나를 고르시면 됩니다.\n30초 안에 선택하지 않으면 배팅한 모든 금액을 잃습니다.'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)

  const [user] = await db.where({ id: msg.author.id }).select('*').from('users')
  const money = Number(msg.content.split(' ')[1])
  if (!money) return msg.channel.send(warn.setDescription('배팅할 금액을 입력해 주세요.\n남은 돈 : **' + user.coin + '￦**'))
  if (user.coin < money) return msg.channel.send(warn.setDescription('유저의 돈이 부족합니다.\n남은 돈 : **' + user.coin + '￦**'))
  if (money < 5000) return msg.channel.send(warn.setDescription('5000 이하의 돈은 배팅할수 없습니다.\n남은 돈 : **' + user.coin + '￦**'))
  await db.where({ id: msg.author.id }).select('*').from('users').update({ coin: user.coin - money })
  const m = await msg.channel.send(start)
  m.react('1️⃣'); m.react('2️⃣'); m.react('3️⃣')

  m.awaitReactions((r, u) => ['1️⃣', '2️⃣', '3️⃣'].includes(r.emoji.name) && u.id === msg.author.id, { max: 1, time: 30000, errors: ['time'] })
    .then(async collected => {
      const reaction = collected.first()
      const [moneyuser] = await db.where({ id: msg.author.id }).select('*').from('users')
      if (reaction.emoji.name === '1️⃣') {
        msg.channel.send(success.setDescription('1번의 결과는 ' + slot[0] + '배 입니다!\n추가 된 돈 : **' + money * slot[0] + '￦**'))
        await db.where({ id: msg.author.id }).update({ coin: moneyuser.coin + (money * slot[0]) }).select('*').from('users')
      } else if (reaction.emoji.name === '2️⃣') {
        msg.channel.send(success.setDescription('2번의 결과는 ' + slot[1] + '배 입니다!\n추가 된 돈 : **' + money * slot[1] + '￦**'))
        await db.where({ id: msg.author.id }).update({ coin: moneyuser.coin + (money * slot[1]) }).select('*').from('users')
      } else {
        msg.channel.send(success.setDescription('3번의 결과는 ' + slot[2] + '배 입니다!\n추가 된 돈 : **' + money * slot[2] + '￦**'))
        await db.where({ id: msg.author.id }).update({ coin: moneyuser.coin + (money * slot[2]) }).select('*').from('users')
      }
    })
    .catch(collected => {
      msg.channel.send(timeout)
    })
}

function shuffle (a) { var j, x, i; for (i = a.length; i; i -= 1) { j = Math.floor(Math.random() * i); x = a[i - 1]; a[i - 1] = a[j]; a[j] = x } }

module.exports = fn
module.exports.aliases = ['lots', '제비뽑기']
