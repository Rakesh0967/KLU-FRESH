import React, { useMemo, useState } from "react";
import { Header, ProductCard, useStored } from "./Shared";
import { categories, money } from "./data";
import { logout } from "./auth";

const PRODUCTS = "grocery_products", ORDERS = "grocery_orders", CART = "klu_cart", WISH = "klu_wishlist";
export default function User({ user, products, setProducts, orders, setOrders }) {
  const [cart, setCart] = useStored(CART, []);
  const [wishlist, setWishlist] = useStored(WISH, []);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const [showCart, setShowCart] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [details, setDetails] = useState({ name: user?.name || "", phone: "", address: "", city: "Vijayawada", pincode: "522502", slot: "10 AM – 12 PM", payment: "Cash on Delivery" });
  const [notice, setNotice] = useState("");
  const [showOrders, setShowOrders] = useState(false);

  const visible = useMemo(() => {
    let list = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) && (category === "all" || p.category === category));
    if (sort === "price-low") list.sort((a,b) => a.price-b.price);
    if (sort === "price-high") list.sort((a,b) => b.price-a.price);
    if (sort === "rating") list.sort((a,b) => (b.rating||0)-(a.rating||0));
    if (sort === "discount") list.sort((a,b) => (b.original-b.price)-(a.original-a.price));
    return list;
  }, [products, search, category, sort]);

  function add(product) {
    setCart(old => {
      const found = old.find(x => x.id === product.id);
      if (found) return old.map(x => x.id === product.id ? { ...x, qty: Math.min(x.qty + 1, product.stock) } : x);
      return [...old, { ...product, qty: 1 }];
    });
    setNotice(`${product.name} added to cart`);
  }
  function toggleWish(id) { setWishlist(old => old.includes(id) ? old.filter(x => x !== id) : [...old, id]); }
  function updateQty(id, qty) {
    setCart(old => old.map(x => x.id === id ? { ...x, qty: Math.max(1, Math.min(Number(qty), x.stock)) } : x));
  }
  const subtotal = cart.reduce((sum, x) => sum + x.price*x.qty, 0);
  const discount = subtotal >= 500 ? Math.round(subtotal * .1) : 0;
  const total = subtotal - discount;
  function placeOrder(e) {
    e.preventDefault();
    if (!user) { window.location.href = "/login"; return; }
    if (!cart.length) return;
    const order = {
      id: "KLF" + Date.now().toString().slice(-8), userId: user.id,
      customerName: details.name, customerEmail: user.email, phone: details.phone,
      address: details.address, city: details.city, pincode: details.pincode,
      slot: details.slot, paymentMethod: details.payment,
      items: cart.map(x => ({ id: x.id, name: x.name, qty: x.qty, price: x.price, emoji: x.emoji })),
      subtotal, discount, total, status: "Placed", createdAt: new Date().toISOString()
    };
    setOrders([order, ...orders]);
    setProducts(old => old.map(p => {
      const item = cart.find(c => c.id === p.id);
      return item ? { ...p, stock: Math.max(0, p.stock-item.qty) } : p;
    }));
    setCart([]);
    setCheckout(false);
    setShowCart(false);
    setNotice(`Order ${order.id} placed successfully!`);
  }

  const myOrders = orders.filter(o => o.userId === user?.id);
  return <><Header user={user} onLogout={() => { logout(); window.location.href="/"; }} cartCount={cart.reduce((s,x)=>s+x.qty,0)} wishCount={wishlist.length}/>
    <section className="hero" id="home"><div><span className="eyebrow">FRESHNESS AT YOUR DOORSTEP 🌱</span><h1>Fresh groceries,<br/>delivered to your doorstep.</h1><p>Shop everyday essentials at great prices with KLU Fresh.</p><a className="primary-btn" href="#products">Shop now</a><div className="hero-stats"><span><b>15 min</b>Fast delivery</span><span><b>200+</b>Daily essentials</span><span><b>4.8★</b>Customer rating</span></div></div><div className="hero-art"><div>🍅 🥦 🍌<br/>🥛 🍞 🥑<p>Farm fresh & on time</p></div><span>UP TO<br/><b>30% OFF</b></span></div></section>
    <section className="section" id="products"><div className="section-title"><div><span className="eyebrow">OUR STORE</span><h2>Fresh picks for you</h2><p>Quality groceries at honest prices</p></div><div className="quick-actions"><button className="outline-btn" onClick={()=>setShowCart(true)}>🛒 Cart ({cart.length})</button><button className="outline-btn" onClick={()=>setShowOrders(!showOrders)}>📦 My Orders</button></div></div>
      <div className="filters"><input placeholder="Search groceries..." value={search} onChange={e=>setSearch(e.target.value)}/><select value={category} onChange={e=>setCategory(e.target.value)}><option value="all">All categories</option>{categories.map(c=><option key={c}>{c}</option>)}</select><select value={sort} onChange={e=>setSort(e.target.value)}><option value="default">Featured</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="rating">Rating</option><option value="discount">Discount</option></select></div>
      <div className="product-grid">{visible.map(p=><ProductCard key={p.id} product={p} add={add} toggleWish={toggleWish} wished={wishlist.includes(p.id)}/>)}</div>
      {!visible.length && <p className="empty">No products found.</p>}
    </section>
    {showOrders && <section className="section orders-panel"><h2>My Orders</h2>{myOrders.length ? myOrders.map(o=><div className="order-row" key={o.id}><div><b>#{o.id}</b><p>{o.items.map(i=>`${i.name} × ${i.qty}`).join(", ")}</p></div><strong>{money(o.total)}</strong><span className="status">{o.status}</span></div>) : <p>No orders yet. Start shopping!</p>}</section>}
    <section className="section about" id="about"><div className="section-title"><div><span className="eyebrow">WHY KLU FRESH</span><h2>Shopping made simple</h2></div></div><div className="about-grid"><article>🌱<h3>Farm fresh</h3><p>Fresh essentials selected for everyday needs.</p></article><article>⚡<h3>Fast delivery</h3><p>Convenient delivery slots for campus and city.</p></article><article>💰<h3>Honest prices</h3><p>Great prices and regular discounts for students.</p></article></div></section>
    <footer id="contact"><div><b>🌿 KLU Fresh</b><p>Fresh groceries across Vijayawada & KL University.</p></div><div><b>Customer Support</b><p>support@klufresh.com</p><p>+91 866 245 6789</p></div><div>© 2026 KLU Fresh</div></footer>
    {notice && <div className="toast" onClick={()=>setNotice("")}>{notice} ✕</div>}
    {showCart && <div className="drawer-backdrop" onClick={()=>setShowCart(false)}><aside className="drawer" onClick={e=>e.stopPropagation()}><div className="drawer-head"><h2>Your Cart</h2><button onClick={()=>setShowCart(false)}>✕</button></div>{cart.length ? cart.map(x=><div className="cart-row" key={x.id}><span className="cart-emoji">{x.emoji}</span><div className="cart-desc"><b>{x.name}</b><small>{money(x.price)} each</small><div className="qty"><button onClick={()=>updateQty(x.id,x.qty-1)}>−</button>{x.qty}<button onClick={()=>updateQty(x.id,x.qty+1)}>+</button><button className="remove" onClick={()=>setCart(c=>c.filter(y=>y.id!==x.id))}>Remove</button></div></div><b>{money(x.price*x.qty)}</b></div>) : <p className="empty">Your cart is empty.</p>}<div className="cart-total"><p>Subtotal <b>{money(subtotal)}</b></p><p>Discount <b>-{money(discount)}</b></p><h3>Total <b>{money(total)}</b></h3><button className="primary-btn full" disabled={!cart.length} onClick={()=>{setShowCart(false);setCheckout(true);}}>Proceed to checkout</button></div></aside></div>}
    {checkout && <div className="modal-backdrop"><form className="checkout-modal" onSubmit={placeOrder}><div className="drawer-head"><h2>Checkout</h2><button type="button" onClick={()=>setCheckout(false)}>✕</button></div><div className="checkout-grid">{[["name","Full name"],["phone","Phone number"],["address","Delivery address"],["city","City"],["pincode","Pincode"]].map(([key,label])=><input key={key} required placeholder={label} value={details[key]} onChange={e=>setDetails({...details,[key]:e.target.value})}/>)}</div><label>Delivery slot<select value={details.slot} onChange={e=>setDetails({...details,slot:e.target.value})}>{["10 AM – 12 PM","12 PM – 2 PM","4 PM – 6 PM","6 PM – 8 PM"].map(s=><option key={s}>{s}</option>)}</select></label><label>Payment method<select value={details.payment} onChange={e=>setDetails({...details,payment:e.target.value})}>{["Cash on Delivery","UPI","Card"].map(s=><option key={s}>{s}</option>)}</select></label><h3>Order total: {money(total)}</h3><button className="primary-btn full">Place order</button></form></div>}
  </>;
}

