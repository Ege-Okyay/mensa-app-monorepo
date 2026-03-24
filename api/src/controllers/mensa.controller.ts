import type { Context } from 'hono';
import { MensaService } from '../services/mensa.service.js';

export class MensaController {
  private mensaService: MensaService;

  constructor() {
    this.mensaService = new MensaService();
  }
}
