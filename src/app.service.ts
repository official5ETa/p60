import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class AppService {
  dashboardRedirect(response: Response) {
    response.redirect('/dashboard');
  }
}
