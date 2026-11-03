import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { categories, defaultProducts, money, readStore, writeStore } from "./data";
import { getCurrentUser, getUsers, login, logout, signup } from "./auth";

function useStored(key, initial) {
  const [value, setValue] = useState(() => readStore(key, initial));
  useEffect(() => writeStore(key, value), [key, value]);
  return [value, setValue];
}

function Header({ user, onLogout, cartCount, wishCount }) {
  return <header className="header">
    <Link className="brand" to="/">🌿 KLU <span>Fresh</span></Link>
    <nav><a href="/#home">Home</a><a href="/#products">Products</a><a href="/#about">About</a><a href="/#contact">Contact</a></nav>
    <div className="header-right">
      <Link to="/#products">🛒 Cart ({cartCount})</Link>
      <Link to="/#products">♡ Wishlist ({wishCount})</Link>
      {user ? <><span className="welcome">Hi, {user.name.split(" ")[0]}</span>
        {user.role === "admin" && <Link className="admin-link" to="/admin">Admin</Link>}
        <button className="small-btn" onClick={onLogout}>Logout</button></> :
        <><Link to="/login">Login</Link><Link className="small-btn" to="/signup">Sign up</Link></>}
    </div>
  </header>;
}

function ProductCard({ product, add, toggleWish, wished }) {
  const discount = product.original > product.price ? Math.round((1 - product.price / product.original) * 100) : 0;
  return <article className="product-card">
    <div className="product-emoji">{product.emoji || "🛒"}{discount > 0 && <span className="discount">{discount}% OFF</span>}</div>
    <button className={`heart ${wished ? "hearted" : ""}`} onClick={() => toggleWish(product.id)}>{wished ? "♥" : "♡"}</button>
    <div className="product-info"><small>{product.category}</small><h3>{product.name}</h3><p>{product.qty} · ⭐ {product.rating || "4.5"}</p>
      <div className="price-line"><strong>{money(product.price)}</strong><del>{money(product.original)}</del></div>
      <button className="primary-btn full" disabled={product.stock <= 0} onClick={() => add(product)}>{product.stock <= 0 ? "Out of stock" : "Add to cart"}</button>
    </div>
  </article>;
}

function Stat({label,value,icon}){return <article className="stat-card"><span>{icon}</span><div><small>{label}</small><h2>{value}</h2></div></article>}
function OrdersTable({orders,changeStatus,detailed=false}){return <div className="table-wrap"><table><thead><tr><th>Order ID</th><th>Customer</th>{detailed&&<th>Address</th>}<th>Items</th><th>Total</th><th>Status</th></tr></thead><tbody>{orders.map(o=><tr key={o.id}><td>#{o.id}<small className="block">{new Date(o.createdAt).toLocaleDateString()}</small></td><td>{o.customerName}<small className="block">{o.customerEmail}</small></td>{detailed&&<td>{o.address}, {o.city} - {o.pincode}</td>}<td>{o.items.map(i=>`${i.name} × ${i.qty}`).join(", ")}</td><td>{money(o.total)}</td><td><select value={o.status} onChange={e=>changeStatus(o.id,e.target.value)}>{["Placed","Processing","Out for Delivery","Delivered","Cancelled"].map(s=><option key={s}>{s}</option>)}</select></td></tr>)}</tbody></table>{!orders.length&&<p>No orders available.</p>}</div>}


export { useStored, Header, ProductCard, Stat, OrdersTable };
