
import { User, AppEvent } from '../types';
import DB from '../db';
import EventBus from '../bus';

type AuthListener = (user: User | null) => void;

class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private listeners: Set<AuthListener> = new Set();
  private readonly SESSION_KEY = 'zhiyu_session';

  private constructor() {
    this.loadSession();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private loadSession() {
    const sessionData = localStorage.getItem(this.SESSION_KEY);
    if (sessionData) {
      this.currentUser = JSON.parse(sessionData);
    }
  }

  public async login(username: string): Promise<User | null> {
    // In this prototype, we treat username as password for simplicity
    const user = await DB.findOne<User>(DB.COLLECTIONS.USERS, u => u.username === username);
    
    if (user) {
      this.currentUser = user;
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
      this.notify();
      EventBus.emit(AppEvent.AUTH_STATE_CHANGED, user);
      return user;
    }
    return null;
  }

  public async updateProfile(updates: Partial<User>): Promise<User | null> {
    if (!this.currentUser) return null;
    
    const updatedUser = await DB.update<User>(DB.COLLECTIONS.USERS, this.currentUser.id, updates);
    if (updatedUser) {
      this.currentUser = updatedUser;
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(updatedUser));
      this.notify();
      EventBus.emit(AppEvent.AUTH_STATE_CHANGED, updatedUser);
    }
    return updatedUser;
  }

  public logout() {
    this.currentUser = null;
    localStorage.removeItem(this.SESSION_KEY);
    this.notify();
    EventBus.emit(AppEvent.AUTH_STATE_CHANGED, null);
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public subscribe(listener: AuthListener): () => void {
    this.listeners.add(listener);
    listener(this.currentUser);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.currentUser));
  }
}

export default AuthService.getInstance();
