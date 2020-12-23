async function fn (client, msg, db) {
  const embed = {
    embed: {
      title: 'Ganbling 봇 명령어.',
      description: '겜블링 봇의 모든 명령어, 그 이상도 그 이하도 아닌',
      timestamp: '2020-12-23T02:58:39.983Z',
      footer: {
        text: msg.author.username
      },
      fields: [
        {
          name: '은행 관련 명령어',
          value: 'g>은행 : 현재 자신의 자산을 알려줌\ng>자살 : 모든 자산을 포기하고 초기화함\ng>이체 [맨션] [금액] : 돈을 다른 사람에게 이체함'
        },
        {
          name: '계정',
          value: 'g>가입 : 겜블링 서비스에 가입합니다\ng>탈퇴 : 겜블링 서비스를 탈퇴합니다'
        },
        {
          name: '도박',
          value: 'g>슬롯머신 [금액] : 슬롯머신 도박을 진행합니다 (최소 10000원)\ng>연속슬롯머신 [금액] [반복할 수] : 슬롯머신 도박을 최대 25번까지 연속으로 진행합니다 (최소 10000원)\ng>업다운 [금액] : 업다운 도박을 진행합니다 (최소 2000원)\ng>제비뽑기 [금액] : 제비뽑기 도박을 진행합니다 (최소 2000원)\ng>주사위 [금액] : 예상 주사위 숫자를 맞추는 도박입니다 (최소 5000원)'
        },
        {
          name: ':thinking: 돈은 어떻게 버나요?',
          value: '채팅을 칠때마다 100원씩 지급됩니다\n1초의 쿨타임을 가지고 있습니다.',
          inline: true
        },
        {
          name: ':thinking: 실수로 자살,탈퇴 했는데 복구가 가능한가요',
          value: '해당 사항은 개발자도 복구할수 없습니다. ~~유감~~',
          inline: true
        }
      ]
    }
  }
  msg.channel.send(embed)
}

module.exports = fn
module.exports.aliases = ['명령어', '명령', '도움', '도움말', 'help']
module.exports.unlogin = true
