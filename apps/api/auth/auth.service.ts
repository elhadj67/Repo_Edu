// auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private users = []; // remplacer par une vraie DB

  constructor(private jwtService: JwtService) {}

  async register(userData: any) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = { ...userData, password: hashedPassword };
    this.users.push(user);
    return { ...user, password: undefined };
  }

  async validateUser(email: string, password: string) {
    const user = this.users.find(u => u.email === email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
