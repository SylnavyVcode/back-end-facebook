import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway(8001) // Autoriser le CORS
export class AppGateway {
  @SubscribeMessage('valmy')
  sendMessage(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
    console.log('bonjour Valmy !');
    console.log('data>>>', data);
    socket.emit('chat_sv', "Salut le nouveau chat");
  } 
}
