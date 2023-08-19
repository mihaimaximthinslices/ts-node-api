export function saySomething(something: string) {
  return `I am saying ${something}`
}

export function getCurrentTimeMessage(dateGetter: () => Date) {
  const NOW = dateGetter()
  return `The time is ${NOW.toLocaleString()}`
}
