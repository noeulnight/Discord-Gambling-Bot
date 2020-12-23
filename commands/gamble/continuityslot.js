const API = require('discord.js')

const slot = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']

async function fn (client, msg, db) {
  const datas = []
  let resultmoney = 0
  const warn = new API.MessageEmbed({
    title: ':warning: 배팅할수 없습니다.'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)
  const [user] = await db.where({ id: msg.author.id }).select('*').from('users')
  const money = Number(msg.content.split(' ')[1])
  const many = Number(msg.content.split(' ')[2])
  if (!money) return msg.channel.send(warn.setDescription('배팅할 금액을 입력해 주세요.\n남은 돈 : **' + user.coin + '￦**'))
  if (!many) return msg.channel.send(warn.setDescription('연속으로 실행할 수를 입력해 주세요.\n남은 돈 : **' + user.coin + '￦**'))
  if (user.coin < money) return msg.channel.send(warn.setDescription('유저의 돈이 부족합니다.\n남은 돈 : **' + user.coin + '￦**'))
  if (money < 10000) return msg.channel.send(warn.setDescription('10000 이하의 돈은 배팅할수 없습니다.\n남은 돈 : **' + user.coin + '￦**'))
  if (many > 25) return msg.channel.send(warn.setDescription('25번 이상 반복할수 없습니다.\n남은 돈 : **' + user.coin + '￦**'))
  if ((many * money) > user.coin) return msg.channel.send(warn.setDescription('유저의 돈이 부족합니다.\n남은 돈 : **' + user.coin + '￦**, 필요한 돈 : **' + (many * money) + '￦**'))
  await db.where({ id: msg.author.id }).select('*').from('users').update({ coin: user.coin - (many * money) })

  const embed = new API.MessageEmbed({
    title: ':slot_machine: ' + many + '번 슬롯 머신을 돌렸습니다~',
    description: '<:success:791086585864388638>을 눌러 결과를 확인하세요.'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)
  const end = new API.MessageEmbed({
    title: '<:success:791086585864388638> 배팅결과!'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)

  for (let i = 0; i < many; i++) {
    const first = slotrun(slot)
    const second = slotrun(slot)
    const third = slotrun(slot)

    if (first === second || second === third || first === third) {
      await db.where({ id: msg.author.id }).select('*').from('users').update({ coin: user.coin + (money * 1.5) })
      datas.push({ one: first, two: second, three: third, text: '3개의 슬롯중 2개의 슬롯이 동일합니다! (배팅금액 x 1.5)\n추가 된 돈 : **' + money * 1.5 + '￦**' })
      resultmoney = resultmoney + (money * 1.5)
    } else
    if (first === second && second === third) {
      await db.where({ id: msg.author.id }).select('*').from('users').update({ coin: user.coin + (money * 2) })
      datas.push({ one: first, two: second, three: third, text: '3개의 슬롯이 모두 동일합니다! (배팅금액 x 2)\n추가 된 돈 : **' + money * 2 + '￦**' })
      resultmoney = resultmoney + (money * 2)
    } else
    if (first === second && second === third && first === 'seven') {
      await db.where({ id: msg.author.id }).select('*').from('users').update({ coin: user.coin + (money * 3) })
      datas.push({ one: first, two: second, three: third, text: '잭팟! 모든 슬롯이 7입니다! (배팅금액 x 3)\n추가 된 돈 : **' + money * 3 + '￦**' })
      resultmoney = resultmoney + (money * 3)
    } else {
      datas.push({ one: first, two: second, three: third, text: '돈을 얻지 못했습니다. (배팅금액 x 0)\n추가 된 돈 : **' + money * 0 + '￦**' })
      resultmoney = resultmoney + 0
    }
  }

  const m = await msg.channel.send(embed)
  m.react(':success:791086585864388638')
  await m.awaitReactions((r, u) => r.emoji.id === '791086585864388638' && u.id === msg.author.id, { max: 1, time: 10000 })
  m.reactions.removeAll().catch(() => {})
  datas.forEach((v, i) => {
    end.addField(`:${v.one}: :${v.two}: :${v.three}:, ${i + 1} 번`, v.text, true)
  })
  end.setDescription('배팅한 ' + (many * money) + '￦ 을' + resultmoney + '￦ 으로 바꿨습니다.')
  const [moneyuser] = await db.where({ id: msg.author.id }).select('*').from('users')
  await db.where({ id: msg.author.id }).select('*').from('users').update({ coin: moneyuser.coin + resultmoney })
  console.log(datas.length)
  m.edit(end)
}

function slotrun (a) {
  return a[Math.floor(Math.random() * a.length)]
}

module.exports = fn
module.exports.aliases = ['연속슬롯머신', '연속슬롯', 'continuityslot']
