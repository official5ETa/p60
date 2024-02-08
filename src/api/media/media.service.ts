import { Injectable } from '@nestjs/common';
import { readdirSync, readFileSync } from 'fs';
import { lookup } from 'mime-types';
import { join } from 'path';

@Injectable()
export class MediaService {
  getMediaList() {
    const dir = join(__dirname, '../../../public/resource/queue');
    return readdirSync(dir)
      .filter((file) => !file.startsWith('.'))
      .map((file, index) => {
        const mimetype = lookup(file),
          type = mimetype.startsWith('video')
            ? 'video'
            : mimetype.startsWith('audio')
              ? 'audio'
              : file.endsWith('.teleprompt.txt')
                ? 'teleprompt'
                : 'unknown',
          content =
            type === 'teleprompt'
              ? readFileSync(join(dir, file)).toString().split('\n\n')
              : undefined;
        return {
          id: index,
          src: encodeURI(join('/resource/queue', file)),
          name: file,
          type,
          content,
        };
      });
  }
}
