import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { categories, defaultProducts, money, readStore, writeStore } from "./data";
import { getCurrentUser, getUsers, login, logout, signup } from "./auth";

export default function AuthForm({ mode, onAuth }) {
  const nav = useNavigate();
  const [role, setRole] = useState("user");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const isSignup = mode === "signup";
  function change(e) { setForm({ ...form, [e.target.name]: e.target.value }); }
  function submit(e) {
    e.preventDefault();
    if (isSignup) {
      const result = signup(form);
      setMessage(result.message);
      if (result.ok) nav("/login");
    } else {
      const result = login({ ...form, role });
      setMessage(result.message);
      if (result.ok) {
        onAuth(result.user);
        nav(result.user.role === "admin" ? "/admin" : "/");
      }
    }
  }
  return <main className="auth-wrap">
    <form className="auth-card" onSubmit={submit}>
      <div className="auth-logo">🌿 KLU <span>Fresh</span></div>
      <h1>{isSignup ? "Create your account" : "Welcome back"}</h1>
      <p>{isSignup ? "Sign up to shop fresh essentials." : "Login to continue to KLU Fresh."}</p>
      {!isSignup && <div className="role-switch">
        <button type="button" className={role === "user" ? "selected" : ""} onClick={() => setRole("user")}>Customer</button>
        <button type="button" className={role === "admin" ? "selected" : ""} onClick={() => setRole("admin")}>Admin</button>
      </div>}
      {isSignup && <input name="name" placeholder="Full name" value={form.name} onChange={change} required />}
      <input name="email" type="email" placeholder="Email address" value={form.email} onChange={change} required />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={change} required />
      {isSignup && <input name="confirmPassword" type="password" placeholder="Confirm password" value={form.confirmPassword} onChange={change} required />}
      <button className="primary-btn full" type="submit">{isSignup ? "Create account" : "Login"}</button>
      {message && <p className="notice">{message}</p>}
      <p className="auth-bottom">{isSignup ? "Already registered?" : "New to KLU Fresh?"} <Link to={isSignup ? "/login" : "/signup"}>{isSignup ? "Login" : "Create an account"}</Link></p>
      {!isSignup && role === "admin" && <small>Demo: admin@klufresh.com / admin123</small>}
    </form>
  </main>;
}

