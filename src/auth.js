import { readStore, writeStore } from "./data";

const USERS = "grocery_users";
const SESSION = "grocery_current_user";

const admins = [
  { id: "admin_001", name: "Store Administrator", email: "admin@klufresh.com", password: "admin123", role: "admin" },
  { id: "admin_002", name: "Store Administrator", email: "admin123@klufresh.in", password: "admin11", role: "admin" }
];

function passwordHash(password) {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = ((hash << 5) - hash + password.charCodeAt(i)) | 0;
  }
  return `demo_${Math.abs(hash).toString(36)}_${password.length}`;
}

export function getUsers() {
  return readStore(USERS, []);
}

export function getCurrentUser() {
  return readStore(SESSION, null);
}

export function signup({ name, email, password, confirmPassword }) {
  name = name.trim();
  email = email.trim().toLowerCase();
  if (!name || !email || !password || !confirmPassword) return { ok: false, message: "Please fill in all fields." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, message: "Enter a valid email address." };
  if (admins.some(a => a.email === email)) return { ok: false, message: "This email is reserved for an administrator." };
  if (password.length < 6) return { ok: false, message: "Password must contain at least 6 characters." };
  if (password !== confirmPassword) return { ok: false, message: "Passwords do not match." };
  const users = getUsers();
  if (users.some(u => u.email === email)) return { ok: false, message: "An account with this email already exists." };
  const user = { id: `u_${Date.now()}`, name, email, password: passwordHash(password), role: "user", createdAt: new Date().toISOString() };
  users.push(user);
  writeStore(USERS, users);
  return { ok: true, message: "Account created. Please log in." };
}

export function login({ email, password, role }) {
  email = email.trim().toLowerCase();
  if (!email || !password) return { ok: false, message: "Enter email and password." };
  let found;
  if (role === "admin") {
    found = admins.find(a => a.email === email && a.password === password);
  } else {
    const user = getUsers().find(u => u.email === email && u.password === passwordHash(password));
    if (user) found = user;
  }
  if (!found) return { ok: false, message: "Invalid email or password." };
  const session = { id: found.id, name: found.name, email: found.email, role: found.role };
  writeStore(SESSION, session);
  return { ok: true, user: session, message: `Welcome, ${found.name}!` };
}

export function logout() {
  localStorage.removeItem(SESSION);
}
