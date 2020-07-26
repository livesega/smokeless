const startInput = document.getElementById('start')
const endInput = document.getElementById('end')
const cigarettesCountInput = document.getElementById('cigarettes')
const generateButton = document.getElementById('generate')
const scheduleElement = document.getElementById('schedule')

generateButton.addEventListener('click', generate)

restore()

function generate() {
  const t1 = startInput.value.split(':')
  const start = moment().set({ hours: t1[0], minutes: t1[1], seconds: '00' })
  const t2 = endInput.value.split(':')
  const end = moment().set({ hours: t2[0], minutes: t2[1], seconds: '00' })
  const cigarettesLimit = cigarettesCountInput.value
  const diff = moment.utc(moment(end).diff(moment(start)))
  const diffMinutes = moment.duration(moment(diff)).asMinutes()
  const period = diffMinutes / (cigarettesLimit - 1)

  clearSchedule()

  let res = {
    start: startInput.value,
    end: endInput.value,
    cigarettesLimit,
    entries: []
  }

  let curDateTime = moment(start)
  for (let i = 0; i < cigarettesLimit; i++) {
    res.entries.push(curDateTime.format('HH:mm'))
    createScheduleElement(`${i + 1}. ${curDateTime.format('HH:mm')}`)
    curDateTime = curDateTime.add(period, 'minutes')
  }

  localStorage.setItem('schedule', JSON.stringify(res))
}

function createScheduleElement(text) {
  const el = document.createElement('div')
  el.classList.add('schedule-element')
  el.innerText = text
  scheduleElement.appendChild(el)
}

function clearSchedule() {
  scheduleElement.innerHTML = ''
}

function restore() {
  const res = JSON.parse(localStorage.getItem('schedule'))
  startInput.value = res.start
  endInput.value = res.end
  cigarettesCountInput.value = res.cigarettesLimit
  res.entries.forEach((entry, i) => createScheduleElement(`${i + 1}. ${entry}`))
}