(() => {
  'use strict'

  // Initialize WebSocket
  const wsUrl = 'wss://8yl33ihxd0.execute-api.eu-west-1.amazonaws.com/prod'
  const ws = new WebSocket(wsUrl)

  const state = {
    connected: false,
    username: ''
  }

  ws.onopen = event => {
    state.connected = true
    const payload = JSON.stringify({ action: 'getUserInfo' })
    ws.send(payload)
  }

  // Send message
  const focusInput = node => {
    const mobileRegexp = /android|webos|iphone|ipad|ipod|blackberry/i

    if (!mobileRegexp.test(navigator.userAgent)) {
      // Naive don't focus on mobile
      node.focus()
    }
  }

  const messageForm = document.querySelector('#messageForm')
  const messageInput = document.querySelector('#message')
  messageInput.value = ''

  focusInput(messageInput)

  messageForm.addEventListener('submit', event => {
    event.preventDefault()

    if (state.connected) {
      const message = messageInput.value
      const payload = {
        action: 'message',
        message
      }

      ws.send(JSON.stringify(payload))
      messageInput.value = ''

      focusInput(messageInput)
    }
  })

  // On message received, render message
  const renderMessage = (target, username, message, action) => {
    const flexContainer = document.createElement('div')
    flexContainer.className = 'd-flex flex-column'

    const node = document.createElement('div')
    node.className = 'mt-2 p-2 rounded'

    if (username === state.username && action === 'MESSAGE') {
      action = 'OWN_MESSAGE'
    }

    switch (action) {
      case 'CONNECTED':
        message = `<b>${username}</b> joined the channel`
        node.className += ' text-success align-self-start'
        break
      case 'DISCONNECTED':
        message = `<b>${username}</b> left the channel`
        node.className += ' text-danger align-self-start'
        break
      case 'MESSAGE':
        message = `<b>${username}</b></br>${message}`
        node.className += ' bg-success text-light align-self-start'
        break
      case 'OWN_MESSAGE':
        node.className += ' bg-primary text-light text-right align-self-end'
        break
      default:
        break
    }

    node.innerHTML = message
    flexContainer.appendChild(node)
    target.appendChild(flexContainer)
    node.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }

  ws.onmessage = incoming => {
    const target = document.querySelector('#target')
    const { username, action, message } = JSON.parse(incoming.data)

    if (action === 'INFO') {
      state.username = username
      return
    }

    renderMessage(target, username, message, action)
  }
})()
