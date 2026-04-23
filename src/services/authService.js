import * as userRepo from '../repositories/userRepo.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export async function signup(email, password, role) {
  const existingUser = await userRepo.findByEmail(email);
  if (existingUser) {
    const error = new Error('Conflict: Email already exists');
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userRepo.create({
    email,
    password: hashedPassword,
    role: role || 'USER'
  });

  return { id: user.id, email: user.email, role: user.role };
}

export async function login(email, password) {
  const user = await userRepo.findByEmail(email);
  if (!user) {
    const error = new Error('Unauthorized: Invalid credentials');
    error.status = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Unauthorized: Invalid credentials');
    error.status = 401;
    throw error;
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
  return token;
}