import { Test, TestingModule } from '@nestjs/testing';
import { VideoSocketGateway } from './video-socket.gateway';

describe('VideoSocketGateway', () => {
  let gateway: VideoSocketGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VideoSocketGateway],
    }).compile();

    gateway = module.get<VideoSocketGateway>(VideoSocketGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
