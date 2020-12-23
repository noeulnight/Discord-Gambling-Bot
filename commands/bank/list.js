const API = require('discord.js')

async function fn (client, msg, db) {
  const embed = new API.MessageEmbed({
    title: 'Gabling봇 전체 서버 순위'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)
  const list = await db.select('*').from('users')
  list.sort(function (a, b) { return b.coin - a.coin })
  embed.setDescription(msg.author.username + '님의 순위는 ' + (list.findIndex(e => e.id === msg.author.id) + 1) + '등 입니다.')
  list.slice(0, 9).forEach((v, i) => {
    embed.addField((i + 1) + '등', '<@' + v.id + '> : ' + v.coin, true)
  })
  msg.channel.send(embed)
}

module.exports = fn
module.exports.aliases = ['순위']
