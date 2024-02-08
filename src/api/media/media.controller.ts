import { Controller, Get } from '@nestjs/common';
import { MediaService } from './media.service';

@Controller('api/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  getMediaList() {
    return this.mediaService.getMediaList();
  }
}
