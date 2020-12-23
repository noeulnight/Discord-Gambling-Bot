const API = require('discord.js')

const slot = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']

async function fn (client, msg, db) {
  const warn = new API.MessageEmbed({
    title: ':warning: 배팅할수 없습니다.'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)

  const [user] = await db.where({ id: msg.author.id }).select('*').from('users')
  const money = Number(msg.content.split(' ')[1])
  if (!money) return msg.channel.send(warn.setDescription('배팅할 금액을 입력해 주세요.\n남은 돈 : **' + user.coin + '￦**'))
  if (user.coin < money) return msg.channel.send(warn.setDescription('유저의 돈이 부족합니다.\n남은 돈 : **' + user.coin + '￦**'))
  if (money < 10000) return msg.channel.send(warn.setDescription('10000 이하의 돈은 배팅할수 없습니다.\n남은 돈 : **' + user.coin + '￦**'))
  await db.where({ id: msg.author.id }).select('*').from('users').update({ coin: user.coin - money })

  const first = slotrun(slot)
  const second = slotrun(slot)
  const third = slotrun(slot)

  const embed = new API.MessageEmbed({
    title: ':slot_machine: 슬롯 머신을 돌렸습니다~',
    description: '<:success:791086585864388638>을 눌러 결과를 확인하세요.'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)
  const end = new API.MessageEmbed({
    title: `슬롯 결과는 :${first}: :${second}: :${third}: 입니다!`,
    description: '모든 슬롯이 맞지 않습니다 (배팅금액 x 0)\n추가 된 돈 : **' + money * 0 + '￦**'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)

  if (first === second || second === third || first === third) {
    await db.where({ id: msg.author.id }).select('*').from('users').update({ coin: user.coin + (money * 1.5) })
    end.setDescription('3개의 슬롯중 2개의 슬롯이 동일합니다! (배팅금액 x 1.5)\n추가 된 돈 : **' + money * 1.5 + '￦**')
  }
  if (first === second && second === third) {
    await db.where({ id: msg.author.id }).select('*').from('users').update({ coin: user.coin + (money * 2) })
    end.setDescription('3개의 슬롯이 모두 동일합니다! (배팅금액 x 2)\n추가 된 돈 : **' + money * 2 + '￦**')
  }
  if (first === second && second === third && first === 'seven') {
    await db.where({ id: msg.author.id }).select('*').from('users').update({ coin: user.coin + (money * 3) })
    end.setDescription('잭팟! 모든 슬롯이 7입니다! (배팅금액 x 3)\n추가 된 돈 : **' + money * 3 + '￦**')
  }

  const m = await msg.channel.send(embed)
  m.react(':success:791086585864388638')
  await m.awaitReactions((r, u) => r.emoji.id === '791086585864388638' && u.id === msg.author.id, { max: 1, time: 10000 })
  m.reactions.removeAll().catch(() => {})
  m.edit(end)
}

function slotrun (a) {
  return a[Math.floor(Math.random() * a.length)]
}

module.exports = fn
module.exports.aliases = ['슬롯머신', '슬롯', 'slot']
