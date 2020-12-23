const API = require('discord.js')

async function fn (client, msg, db) {
  const already = new API.MessageEmbed({
    title: ':warning: 계정이 이미 존재합니다.',
    description: '이미 겜블링 서비스를 이용하시고 계십니다.\ng>은행 을 통해 게임을 시작해보세요'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)
  const create = new API.MessageEmbed({
    title: '<:success:791086585864388638> 회원가입 되었습니다.',
    description: 'g>은행 을 통해 게임을 시작해보세요'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)
  const [exist] = await db.select('*').where({ id: msg.author.id }).from('users')
  if (exist) return msg.channel.send(already)
  db.insert({ id: msg.author.id, coin: 10000 }).from('users').select('*').then((data) => {
    msg.channel.send(create)
  })
}

module.exports = fn
module.exports.aliases = ['가입', '회원가입', 'register', 'regist']
module.exports.unlogin = true
