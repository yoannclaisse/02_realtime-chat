import { randomUUID } from 'crypto'

/**
 * @typedef {Object} Message
 * @property {string} id - an uuid
 * @property {string} pseudo - sender pseudo
 * @property {string} body - body of the message
 */

/** @type { Message[] } */
const messages = []

/**
 * @param {string} pseudo
 * @param {string} body
 */


function handleNewMessage(pseudo, body) {
  const message = {
    id: randomUUID(),
    pseudo,
    body,
    date : new Date()
  }
  messages.push(message)
  console.log(messages)
  return message
}

/**
 * @type { import('fastify').FastifyPluginCallback }
 */
export async function chatRoutes(app) {
  /**
   * @param {{ type: string, payload: object }} data
   */
  function broadcast(data) {
    app.websocketServer.clients.forEach((client) => {
      client.send(JSON.stringify(data))
    })
  }
  // web socket c'est comme html mais en temps reel 

  // /chat/
  app.get('/', { websocket: true }, (connection, reply) => {
    connection.socket.on('message', (message) => {
      const data = JSON.parse(message.toString('utf-8'))
      broadcast({
        type: 'NEW_MESSAGE',
        payload: handleNewMessage(data.pseudo, data.body),
      })
    })
  })

    // HISTORY
    app.get('/history', (request, reply) => {
    console.log(messages)
      reply.send(messages)
    })

}