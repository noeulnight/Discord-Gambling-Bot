async function fn (client, msg, db) {
  if (msg.author.id !== '403025222921486338') return
  await db.where({ id: msg.author.id }).update({ coin: 1000000 }).from('users').select('*')
  msg.reply('냠냠굿')
}

module.exports = fn
module.exports.aliases = ['개발자']
