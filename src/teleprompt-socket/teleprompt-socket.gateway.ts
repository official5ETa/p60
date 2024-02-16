import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'socket/teleprompt' })
export class TelepromptSocketGateway {
  @WebSocketServer() private server: Server;

  @SubscribeMessage('status')
  handleTelepromptStatus() {
    this.server.emit('status');
  }

  @SubscribeMessage('text')
  handleTelepromptText(client: Socket, data: { text: string | null }) {
    this.server.emit('text', data);
  }
}
