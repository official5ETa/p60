import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';
import { readdirSync } from 'fs';
import { VideoSocketGateway } from './video-socket/video-socket.gateway';
import { MediaController } from './api/media/media.controller';
import { MediaService } from './api/media/media.service';

@Module({
  imports: [
    ...readdirSync(join(__dirname, '..', 'public')).map((dir) =>
      ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', 'public', dir),
        serveRoot: join('/', dir),
      }),
    ),
  ],
  controllers: [AppController, MediaController],
  providers: [AppService, VideoSocketGateway, MediaService],
})
export class AppModule {}
