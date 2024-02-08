import { Test, TestingModule } from '@nestjs/testing';
import { TelepromptSocketGateway } from './teleprompt-socket.gateway';

describe('TelepromptSocketGateway', () => {
  let gateway: TelepromptSocketGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TelepromptSocketGateway],
    }).compile();

    gateway = module.get<TelepromptSocketGateway>(TelepromptSocketGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
