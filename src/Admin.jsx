import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Header, Stat, OrdersTable } from "./Shared";
import { categories, money } from "./data";
import { getUsers, logout } from "./auth";

export default function Admin({ user, products, setProducts, orders, setOrders }) {
  const [tab,setTab]=useState("dashboard");
  const [search,setSearch]=useState("");
  const [filter,setFilter]=useState("all");
  const [editing,setEditing]=useState(null);
  const [form,setForm]=useState({name:"",category:categories[0],qty:"1 kg",price:"",original:"",stock:"",emoji:"🛒"});
  const revenue=orders.filter(o=>o.status!=="Cancelled").reduce((s,o)=>s+o.total,0);
  const low=products.filter(p=>p.stock<=3).length;
  function saveProduct(e){
    e.preventDefault();
    const item={...form,id:editing?.id||Date.now(),price:Number(form.price),original:Number(form.original||form.price),stock:Number(form.stock),rating:editing?.rating||4.5};
    setProducts(old=>editing?old.map(p=>p.id===editing.id?item:p):[item,...old]);
    setEditing(null);setForm({name:"",category:categories[0],qty:"1 kg",price:"",original:"",stock:"",emoji:"🛒"});
  }
  function edit(p){setEditing(p);setForm({...p,price:String(p.price),original:String(p.original),stock:String(p.stock)});}
  function remove(id){if(window.confirm("Delete this product?"))setProducts(old=>old.filter(p=>p.id!==id));}
  function changeStatus(id,status){setOrders(old=>old.map(o=>o.id===id?{...o,status}:o));}
  const filtered=products.filter(p=>(p.name.toLowerCase().includes(search.toLowerCase())||p.category.toLowerCase().includes(search.toLowerCase()))&&(filter==="all"||p.category===filter));
  const users=getUsers();
  return <><Header user={user} onLogout={()=>{logout();window.location.href="/";}} cartCount={0} wishCount={0}/><div className="admin-layout"><aside className="admin-side"><h2>🛠 Admin panel</h2>{[["dashboard","📊 Dashboard"],["products","📦 Products"],["orders","📑 Orders"],["users","👥 Users"]].map(([id,label])=><button key={id} className={tab===id?"active":""} onClick={()=>{setTab(id);setEditing(null);}}>{label}</button>)}<Link to="/">← View storefront</Link></aside><main className="admin-main">
    {tab==="dashboard"&&<><div className="section-title"><div><span className="eyebrow">STORE MANAGEMENT</span><h1>Dashboard overview</h1><p>Welcome back, {user.name}</p></div><button className="primary-btn" onClick={()=>{setTab("products");setEditing(false);}}>+ Add product</button></div><div className="stats-grid"><Stat label="Total revenue" value={money(revenue)} icon="💰"/><Stat label="Total orders" value={orders.length} icon="📑"/><Stat label="Products" value={products.length} icon="📦"/><Stat label="Registered users" value={users.length} icon="👥"/><Stat label="Low stock items" value={low} icon="⚠️"/></div><div className="admin-card"><h2>Recent customer orders</h2><OrdersTable orders={orders.slice(0,5)} changeStatus={changeStatus}/></div></>}
    {tab==="products"&&<><div className="section-title"><div><h1>Product catalog</h1><p>Add, edit, delete products and adjust stock.</p></div><button className="primary-btn" onClick={()=>{setEditing(false);setForm({name:"",category:categories[0],qty:"1 kg",price:"",original:"",stock:"",emoji:"🛒"});}}>+ Add product</button></div>{editing!==null&&<form className="product-form admin-card" onSubmit={saveProduct}><h2>{editing?"Edit product":"Add new product"}</h2><div className="form-grid"><input required placeholder="Product name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{categories.map(c=><option key={c}>{c}</option>)}</select><input required placeholder="Unit / quantity" value={form.qty} onChange={e=>setForm({...form,qty:e.target.value})}/><input required type="number" min="1" placeholder="Selling price" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/><input type="number" min="1" placeholder="Original price" value={form.original} onChange={e=>setForm({...form,original:e.target.value})}/><input required type="number" min="0" placeholder="Stock units" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})}/><input placeholder="Emoji" value={form.emoji} onChange={e=>setForm({...form,emoji:e.target.value})}/></div><button className="primary-btn">Save product</button> <button type="button" className="outline-btn" onClick={()=>setEditing(null)}>Cancel</button></form>}<div className="admin-card"><div className="filters"><input placeholder="Search products..." value={search} onChange={e=>setSearch(e.target.value)}/><select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">All categories</option>{categories.map(c=><option key={c}>{c}</option>)}</select></div><div className="table-wrap"><table><thead><tr><th>Item</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead><tbody>{filtered.map(p=><tr key={p.id}><td>{p.emoji}</td><td>{p.name}</td><td>{p.category}</td><td>{money(p.price)}</td><td><span className={p.stock<=3?"low-stock":"status"}>{p.stock}</span></td><td><button className="table-btn" onClick={()=>setProducts(old=>old.map(x=>x.id===p.id?{...x,stock:x.stock+5}:x))}>+5</button> <button className="table-btn" onClick={()=>edit(p)}>Edit</button> <button className="table-btn danger" onClick={()=>remove(p.id)}>Delete</button></td></tr>)}</tbody></table></div></div></>}
    {tab==="orders"&&<><h1>Customer orders</h1><div className="admin-card"><OrdersTable orders={orders} changeStatus={changeStatus} detailed/></div></>}
    {tab==="users"&&<><h1>Registered users</h1><div className="admin-card table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Registered on</th><th>Orders</th></tr></thead><tbody>{users.map(u=><tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td><td>{new Date(u.createdAt).toLocaleDateString()}</td><td>{orders.filter(o=>o.userId===u.id).length}</td></tr>)}</tbody></table>{!users.length&&<p>No registered customers yet.</p>}</div></>}
  </main></div></>;
}

