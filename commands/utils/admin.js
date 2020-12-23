const API = require('discord.js')

async function fn (client, msg, db) {
  const embed = new API.MessageEmbed({
    title: '<:success:791086585864388638> 지급성공'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)
  const entermoney = new API.MessageEmbed({
    title: ':thumbsup: 지급할 금액을 입력해주세요.',
    description: 'c>'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)
  const fail = new API.MessageEmbed({
    title: ':warning: 정확한 유저를 맨션해주세요'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)
  const warn = new API.MessageEmbed({
    title: ':warning: 관리자만 가능합니다.'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)
  if (msg.author.id !== '403025222921486338') return msg.channel.send(warn)
  if (msg.mentions.members.first()) {
    const [exist] = await db.where({ id: msg.mentions.members.first().user.id }).select('*').from('users')
    if (!exist) return msg.channel.send(fail)
    msg.channel.send(entermoney)
    msg.channel.awaitMessages(m => m.author.id === msg.author.id && m.content.startsWith('c>'), { max: 1, time: 30000 }).then(async collected => {
      await db.where({ id: msg.mentions.members.first().user.id }).select('*').from('users').update({ coin: exist.coin + Number(collected.first().content.slice(2)) })
      return msg.channel.send(embed)
    })
  } else {
    return msg.channel.send(fail)
  }
}

module.exports = fn
module.exports.aliases = ['관리자입금']
