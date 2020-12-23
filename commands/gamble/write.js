const API = require('discord.js')

async function fn (client, msg, db) {
  const warn = new API.MessageEmbed({
    title: ':warning: 배팅할수 없습니다.'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)
  const timeout = new API.MessageEmbed({
    title: ':warning: 시간초과'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)

  const [user] = await db.where({ id: msg.author.id }).select('*').from('users')
  const money = Number(msg.content.split(' ')[1])
  if (!money) return msg.channel.send(warn.setDescription('배팅할 금액을 입력해 주세요.\n남은 돈 : **' + user.coin + '￦**'))
  if (user.coin < money) return msg.channel.send(warn.setDescription('유저의 돈이 부족합니다.\n남은 돈 : **' + user.coin + '￦**'))
  if (money < 2000) return msg.channel.send(warn.setDescription('2000 이하의 돈은 배팅할수 없습니다.\n남은 돈 : **' + user.coin + '￦**'))
  await db.where({ id: msg.author.id }).select('*').from('users').update({ coin: user.coin - money })
  const start = new API.MessageEmbed({
    title: '타자 대결을 시작합니다.',
    description: '대전하실 분은 아래 <:success:791086585864388638> 에 반응 해주세요 (30초 제안시간)\n판돈 : ' + money + '￦'
  })
  const m = await msg.channel.send(start)
  m.react(':success:791086585864388638')
  await m.awaitReactions((r, u) => r.emoji.id === '791086585864388638', { time: 30000, errors: ['time'] }).then(async collected => {
    msg.channel.send('lol')
    const [battle] = await db.where({ id: collected.first().author.id }).select('*').from('users')
    if (!battle) return msg.channel.send(`<@${collected.first().author.id}> 님의 통장 잔액이 부족합니다.`)
  }).catch(() => {
    m.delete()
    return msg.channel.send(timeout)
  })
}

module.exports = fn
module.exports.aliases = ['타자대결', '타자', 'write']
