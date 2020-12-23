const API = require('discord.js')

async function fn (client, msg, db) {
  const embed = new API.MessageEmbed().setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)
  const warn = new API.MessageEmbed({
    title: ':warning: 유저가 존재하지 않습니다.'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)
  if (msg.mentions.members.first()) {
    db.where({ id: msg.mentions.members.first().user.id }).select('*').from('users').then(([data]) => {
      if (!data) return msg.channel.send(warn)
      msg.channel.send(embed.setDescription('총 ' + data.coin + '￦ 입니다').setTitle(msg.mentions.members.first().user.username + '님의 통장 잔고는'))
    })
  } else {
    db.where({ id: msg.author.id }).select('*').from('users').then(([data]) => {
      msg.channel.send(embed.setDescription('총 ' + data.coin + '￦ 입니다').setTitle(msg.author.username + '님의 통장 잔고는'))
    })
  }
}

module.exports = fn
module.exports.aliases = ['내돈', '은행', 'bank', 'money']
