(() => {
  'use strict'

  // Initialize WebSocket
  const slsWsExample = 'wss://8yl33ihxd0.execute-api.eu-west-1.amazonaws.com/prod'
  const ws = new WebSocket(slsWsExample)
  let connected = false

  ws.onopen = _event => {
    connected = true
  }

  // Send message
  const sendMessageBtn = document.querySelector('#sendMessage')
  sendMessageBtn.addEventListener('click', event => {
    event.preventDefault()

    if (connected) {
      const message = document.querySelector('#message').value
      const payload = {
        action: 'message',
        message
      }

      ws.send(JSON.stringify(payload))
    }
  })

  // On message received, render message
  const target = document.querySelector('#target')
  ws.onmessage = message => {
    const node = document.createElement('div')
    node.className = 'bg-success text-light mt-2 p-2 rounded w-50'
    node.textContent = message.data
    target.appendChild(node)
    node.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }
})()
