/**
 * @param {import('../classes/Client')} client
 */
function onReady (client) {
  console.log(
    client.user.username + ' is now online!\n' +
    'prefix: ' + client.settings.prefix
  )
  client.user.setActivity('g>help | Gambling', 'playing')
}

module.exports = onReady
