const API = require('discord.js')

async function fn (client, msg, db) {
  let left = 4
  const number = Math.floor(Math.random() * (100 - 1 + 1)) + 1
  const warn = new API.MessageEmbed({
    title: ':warning: 배팅할수 없습니다.'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)
  const typewarn = new API.MessageEmbed({
    title: ':warning: 올바른 숫자를 입력해주세요.'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)
  const timeout = new API.MessageEmbed({
    title: ':warning: 30초가 지났습니다.',
    description: '배팅 금액 전부를 잃습니다.'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)
  const fail = new API.MessageEmbed({
    title: ':warning: 배팅 실패.'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)
  const alert = new API.MessageEmbed({
    title: ':slot_machine: 업다운 알림'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)
  const start = new API.MessageEmbed({
    title: '<:success:791086585864388638> 업다운 시작~',
    description: '1부터 100 사이의 숫자를 총 5번 기회안에 맞춰보세요!\n30초 안에 작성하지 않을경우 배팅금액을 잃습니다.\n\nu>숫자 로 숫자를 맞추세요.'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)
  const success = new API.MessageEmbed({
    title: '<:success:791086585864388638> 배팅성공!~'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)

  const [user] = await db.where({ id: msg.author.id }).select('*').from('users')
  const money = Number(msg.content.split(' ')[1])
  if (!money) return msg.channel.send(warn.setDescription('배팅할 금액을 입력해 주세요.\n남은 돈 : **' + user.coin + '￦**'))
  if (user.coin < money) return msg.channel.send(warn.setDescription('유저의 돈이 부족합니다.\n남은 돈 : **' + user.coin + '￦**'))
  if (money < 2000) return msg.channel.send(warn.setDescription('2000 이하의 돈은 배팅할수 없습니다.\n남은 돈 : **' + user.coin + '￦**'))
  await db.where({ id: msg.author.id }).select('*').from('users').update({ coin: user.coin - money })
  msg.channel.send(start)

  question()
  function question () {
    msg.channel.awaitMessages(m => m.author.id === msg.author.id && m.content.startsWith('u>'), { max: 1, time: 30000 }).then(async collected => {
      if (!Number(collected.first().content.slice(2))) {
        msg.channel.send(typewarn)
        return question()
      }
      if (Number(collected.first().content.slice(2)) < number) {
        --left
        if (left === 0) return msg.channel.send(fail.setDescription('결과는 ' + number + '이였습니다!'))
        msg.channel.send(alert.setDescription('<@' + msg.author.id + '> 더 큽니다, ' + (left + 1) + '번 남음'))
        return question()
      } else if (Number(collected.first().content.slice(2)) > number) {
        --left
        if (left === 0) return msg.channel.send(fail.setDescription('결과는 ' + number + '이였습니다!'))
        msg.channel.send(alert.setDescription('<@' + msg.author.id + '> 더 작습니다, ' + (left + 1) + '번 남음'))
        return question()
      } else if (Number(collected.first().content.slice(2)) === number) {
        const [moneyuser] = await db.where({ id: msg.author.id }).select('*').from('users')
        msg.channel.send(success.setDescription('숫자를 맞췄습니다! (배팅금액 x 2)\n추가 된 돈 : **' + money * 2 + '￦**'))
        await db.where({ id: msg.author.id }).update({ coin: moneyuser.coin + (money * 2) }).select('*').from('users')
      }
    }).catch(() => {
      msg.channel.send(timeout)
    })
  }
}

module.exports = fn
module.exports.aliases = ['업다운', 'updown']
