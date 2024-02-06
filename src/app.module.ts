import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';
import { readdirSync } from 'fs';

@Module({
  imports: [
    ...readdirSync(join(__dirname, '..', 'public')).map((dir) =>
      ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', 'public', dir),
        serveRoot: join('/', dir),
      }),
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
