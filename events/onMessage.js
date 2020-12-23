const Query = require('../classes/Query')
const knex = require('knex')
const { MessageEmbed } = require('discord.js')
const cooldown = new Set()
const moneycooldown = new Set()

const options = { host: 'localhost', port: 3306, user: 'gambling', database: 'gambling' }
const db = knex({ client: 'mysql', connection: options })

/**
 * @param {import('../classes/Client')} client
 * @param {import('discord.js').Message} msg
 */
async function onMessage (client, msg) {
  const { prefix } = client.settings
  const { author, content } = msg

  const [user] = await db.where({ id: msg.author.id }).from('users').select('*')
  if (user) {
    if (!moneycooldown.has(msg.author.id)) await db.where({ id: msg.author.id }).update({ coin: user.coin + 100 }).from('users').select('*')
    moneycooldown.add(msg.author.id)
    setTimeout(() => moneycooldown.delete(msg.author.id), 1000)
  }

  if (author.bot) return
  if (!content.startsWith(prefix)) return

  const query = new Query(prefix, content)
  const target = client.commands.find(
    (command = { aliases: [] }) =>
      typeof command === 'function' &&
      command.aliases.includes(query.cmd)
  )

  const noaccount = new MessageEmbed({
    title: ':warning: 계정이 없습니다.',
    description: 'g>가입 을 통해 겜블링 서비스에 가입해보세요.'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)
  const cooldowns = new MessageEmbed({
    title: ':warning: 메세지 쿨다운.',
    description: '잠시후 다시 이용해주세요.'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)
  const creating = new MessageEmbed({
    title: ':warning: 해당 기능은 준비중입니다.',
    description: '이용에 불편을드려 죄송합니다.'
  }).setTimestamp().setFooter(msg.author.username, msg.author.avatarURL)

  if (!target) return
  if (target.stop) return msg.channel.send(creating)
  if (!target.unlogin) {
    const [exist] = await db.where({ id: msg.author.id }).from('users').select('*')
    if (!exist) return msg.channel.send(noaccount)
  }
  if (cooldown.has(msg.author.id)) {
    const m = await msg.channel.send(cooldowns)
    return setTimeout(() => m.delete(), 1000)
  }
  target(client, msg, db)
  cooldown.add(msg.author.id)
  setTimeout(() => {
    cooldown.delete(msg.author.id)
  }, 3000)
}

module.exports = onMessage
