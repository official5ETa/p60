import { Injectable } from '@nestjs/common';
import { lookup } from 'mime-types';
import { readdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class MediaService {
  getMediaList() {
    return readdirSync(join(__dirname, '../../../public/resource/queue'))
      .filter((file) => !file.startsWith('.'))
      .map((file) => ({
        src: encodeURI(join('/resource/queue', file)),
        name: file,
        mimetype: lookup(file),
      }));
  }
}
