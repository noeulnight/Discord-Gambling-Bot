const API = require('discord.js')

async function fn (client, msg, db) {
  const noaccount = new API.MessageEmbed({
    title: ':warning: 계정이 없습니다',
    description: 'g>가입 을 통해 겜블링 서비스에 가입해보세요'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)
  const already = new API.MessageEmbed({
    title: ':warning: 정말 계정을 삭제하시겠습니까?',
    description: '계정 삭제시 개발자도 복구할수 없습니다. 그래도 진행 하시겠습니까?\n<:success:791086585864388638>를 눌러 계정을 삭제합니다.'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)
  const success = new API.MessageEmbed({
    title: '<:success:791086585864388638> 계정을 삭제했습니다'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)
  const timeout = new API.MessageEmbed({
    title: ':warning: 시간초과'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)
  const [exist] = await db.select('*').where({ id: msg.author.id }).from('users')
  if (!exist) return msg.channel.send(noaccount)

  const m = await msg.channel.send(already)
  m.react(':success:791086585864388638')
  await m.awaitReactions((r, u) => r.emoji.id === '791086585864388638' && u.id === msg.author.id, { max: 1, time: 30000, errors: ['time'] }).then(() => {
    m.delete()
    db.delete().select('*').where({ id: msg.author.id }).from('users').then((data) => {
      return msg.channel.send(success)
    })
  }).catch(() => {
    m.delete()
    return msg.channel.send(timeout)
  })
}

module.exports = fn
module.exports.aliases = ['탈퇴', '회원탈퇴', 'remove', 'removeaccount']
