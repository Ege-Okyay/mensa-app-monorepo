import type { Context } from 'hono';
import { MenuService } from '../services/menu.service.js';

export class MenuController {
  private menuService: MenuService;

  constructor() {
    this.menuService = new MenuService();
  }
}