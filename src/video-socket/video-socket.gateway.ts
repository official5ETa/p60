import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'socket/video' })
export class VideoSocketGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('status')
  handleVideoStatus(client: Socket, data: object) {
    this.server.emit('status', data);
  }

  @SubscribeMessage('play')
  handleVideoPlay(client: Socket, data: { src: string }) {
    this.server.emit('play', data);
  }

  @SubscribeMessage('pause')
  handleVideoPause() {
    this.server.emit('pause');
  }

  @SubscribeMessage('stop')
  handleVideoStop() {
    this.server.emit('stop');
  }

  @SubscribeMessage('seekPerc')
  handleVideoSeekPerc(client: Socket, data: { value: number }) {
    this.server.emit('seekPerc', data);
  }
}
