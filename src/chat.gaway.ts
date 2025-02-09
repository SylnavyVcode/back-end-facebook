import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true }) // Autoriser le CORS
export class ChatGateway {
  @WebSocketServer()
  server: Server; // Référence au serveur WebSocket

  // Un utilisateur envoie un message
  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: { sender: string; message: string }) {
    console.log(`Message reçu : ${payload.sender}: ${payload.message}`);

    // Envoyer le message à tous les clients
    this.server.emit('message', payload);
  }

  // Détecte quand un client se connecte
  handleConnection(client: Socket) {
    console.log(`Client connecté: ${client.id}`);
    this.server.emit('users', { message: `Un utilisateur s'est connecté` });
  }

  // Détecte quand un client se déconnecte
  handleDisconnect(client: Socket) {
    console.log(`Client déconnecté: ${client.id}`);
    this.server.emit('users', { message: `Un utilisateur s'est déconnecté` });
  }

  @SubscribeMessage('privateMessage')
  handlePrivateMessage(
    client: Socket,
    payload: { to: string; message: string },
  ) {
    this.server.to(payload.to).emit('privateMessage', payload.message);
  }

  // rejoindre un salon de communication
  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    client.emit('joinedRoom', `Tu as rejoint ${room}`);
  }
  // un message peut ^^etre envoyer à tout le monde du salon
  @SubscribeMessage('roomMessage')
  handleRoomMessage(
    client: Socket,
    payload: { room: string; message: string },
  ) {
    this.server.to(payload.room).emit('roomMessage', payload.message);
  }
}
