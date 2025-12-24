
import { User, FishRecord, SystemMessage, GearSet, FishingSpot } from '../types';

class DatabaseService {
  private static instance: DatabaseService;
  private readonly STORAGE_KEYS = {
    USERS: 'zhiyu_users',
    RECORDS: 'zhiyu_records',
    MESSAGES: 'zhiyu_messages',
    GEAR_SETS: 'zhiyu_gear_sets',
    SPOTS: 'zhiyu_spots',
  };

  private constructor() {
    this.init();
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private init() {
    const users = this.getRaw(this.STORAGE_KEYS.USERS);
    if (!users || users.length === 0) {
      this.seedData();
    }
  }

  private seedData() {
    const initialUsers: User[] = [
      {
        id: 'u_1',
        username: 'admin',
        name: '系统管理员',
        role: 'admin',
        status: 'active',
        createdAt: Date.now(),
      },
      {
        id: 'u_2',
        username: 'fisher',
        name: '资深钓友',
        role: 'user',
        status: 'active',
        createdAt: Date.now(),
      }
    ];
    this.saveRaw(this.STORAGE_KEYS.USERS, initialUsers);
    this.saveRaw(this.STORAGE_KEYS.RECORDS, []);
    this.saveRaw(this.STORAGE_KEYS.MESSAGES, [
      {
        id: 'm_1',
        title: '欢迎来到知渔',
        content: '开启你的传奇钓鱼生涯，记录每一次精彩瞬间。',
        type: 'success',
        createdAt: Date.now(),
        isRead: false
      }
    ]);
    this.saveRaw(this.STORAGE_KEYS.GEAR_SETS, [
      {
        id: 'g_1',
        userId: 'u_2',
        name: '轻量化路亚套装',
        rod: 'Luremaster UL 1.8m',
        reel: 'Shimano Stradic 1000',
        line: '0.6 PE + 4lb 前导',
        hook: '微物曲柄钩'
      },
      {
        id: 'g_2',
        userId: 'u_2',
        name: '台钓综合竿',
        rod: '综合碳素竿 4.5m',
        reel: undefined,
        line: '2.0 主线 + 1.2 子线',
        hook: '新关东 0.5#'
      }
    ]);
    this.saveRaw(this.STORAGE_KEYS.SPOTS, [
      {
        id: 's_1',
        userId: 'u_2',
        name: '老张家鱼塘',
        type: '黑坑'
      },
      {
        id: 's_2',
        userId: 'u_2',
        name: '千岛湖',
        type: '水库'
      }
    ]);
  }

  private getRaw(key: string): any[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private saveRaw(key: string, data: any[]) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  public async findAll<T>(collection: string): Promise<T[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getRaw(collection) as T[]);
      }, 100);
    });
  }

  public async findById<T extends { id: string }>(collection: string, id: string): Promise<T | null> {
    const items = await this.findAll<T>(collection);
    return items.find(item => item.id === id) || null;
  }

  public async findOne<T>(collection: string, predicate: (item: T) => boolean): Promise<T | null> {
    const items = await this.findAll<T>(collection);
    return items.find(predicate) || null;
  }

  public async create<T extends { id: string }>(collection: string, item: T): Promise<T> {
    const items = await this.findAll<T>(collection);
    items.push(item);
    this.saveRaw(collection, items);
    return item;
  }

  public async update<T extends { id: string }>(collection: string, id: string, updates: Partial<T>): Promise<T | null> {
    const items = await this.findAll<T>(collection);
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    items[index] = { ...items[index], ...updates };
    this.saveRaw(collection, items);
    return items[index];
  }

  public async delete(collection: string, id: string): Promise<boolean> {
    const items = await this.findAll<any>(collection);
    const filtered = items.filter(item => item.id !== id);
    if (items.length === filtered.length) return false;
    this.saveRaw(collection, filtered);
    return true;
  }

  public get COLLECTIONS() {
    return this.STORAGE_KEYS;
  }
}

export default DatabaseService.getInstance();
