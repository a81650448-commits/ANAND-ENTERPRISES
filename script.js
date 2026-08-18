const menu=document.querySelector(".menu"),nav=document.querySelector("nav");
menu.addEventListener("click",()=>nav.classList.toggle("open"));
document.querySelectorAll("nav a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
const cartBtn=document.getElementById("cartBtn"),drawer=document.getElementById("cartDrawer"),overlay=document.getElementById("cartOverlay");
const itemsEl=document.getElementById("cartItems"),totalEl=document.getElementById("cartTotal"),countEl=document.getElementById("cartCount");
let cart=JSON.parse(localStorage.getItem("anandRakhiCart")||"[]");
function save(){localStorage.setItem("anandRakhiCart",JSON.stringify(cart));render()}
function openCart(){drawer.classList.add("open");overlay.classList.add("show")}
function closeCart(){drawer.classList.remove("open");overlay.classList.remove("show")}
cartBtn.addEventListener("click",openCart);document.getElementById("closeCart").addEventListener("click",closeCart);overlay.addEventListener("click",closeCart);
document.querySelectorAll(".add-cart").forEach(btn=>btn.addEventListener("click",()=>{const name=btn.dataset.name,price=+btn.dataset.price,image=btn.dataset.image;const found=cart.find(x=>x.name===name);found?found.qty++:cart.push({name,price,image,qty:1});save();openCart()}));
function render(){const count=cart.reduce((s,x)=>s+x.qty,0),total=cart.reduce((s,x)=>s+x.price*x.qty,0);countEl.textContent=count;totalEl.textContent="₹"+total;if(!cart.length){itemsEl.innerHTML='<div class="empty-cart">Your cart is empty.<br><span>Add your favourite Rakhis to get started.</span></div>';return}itemsEl.innerHTML=cart.map((x,i)=>`<div class="cart-row"><img src="${x.image}" alt="${x.name}"><div><h4>${x.name}</h4><div class="price">₹${x.price} each</div><div class="qty"><button data-a="minus" data-i="${i}">−</button><span>${x.qty}</span><button data-a="plus" data-i="${i}">+</button></div><button class="remove" data-a="remove" data-i="${i}">Remove</button></div><strong>₹${x.price*x.qty}</strong></div>`).join("");itemsEl.querySelectorAll("[data-a]").forEach(b=>b.addEventListener("click",()=>{const i=+b.dataset.i,a=b.dataset.a;if(a==="plus")cart[i].qty++;if(a==="minus"){cart[i].qty--;if(cart[i].qty<=0)cart.splice(i,1)}if(a==="remove")cart.splice(i,1);save()}))}
document.getElementById("clearCart").addEventListener("click",()=>{cart=[];save()});
document.getElementById("checkoutBtn").addEventListener("click",()=>{if(!cart.length){alert("Your cart is empty.");return}const lines=cart.map(x=>`${x.name} x ${x.qty} = ₹${x.price*x.qty}`).join("\n");const total=cart.reduce((s,x)=>s+x.price*x.qty,0);const msg=`Hello Anand Enterprises,\n\nI want to order:\n${lines}\n\nTotal: ₹${total}\n\nPlease confirm availability and delivery details.`;window.open("https://wa.me/917007596728?text="+encodeURIComponent(msg),"_blank")});
render();
const copyUpi=document.getElementById("copyUpi");
if(copyUpi){copyUpi.addEventListener("click",()=>{navigator.clipboard.writeText("7007596728@ptyes").then(()=>{copyUpi.textContent="Copied ✓";setTimeout(()=>copyUpi.textContent="Copy UPI ID",1800)}).catch(()=>alert("UPI ID: 7007596728@ptyes"));});}
const payUpi=document.getElementById("payUpi");
function updateUpiPayLink(){
  if(!payUpi)return;
  const total=cart.reduce((s,x)=>s+x.price*x.qty,0);
  const params=new URLSearchParams({pa:"7007596728@ptyes",pn:"ANAND ENTERPRISES",cu:"INR"});
  if(total>0)params.set("am",total.toFixed(2));
  payUpi.href="upi://pay?"+params.toString();
}
const originalRender=render;
render=function(){originalRender();updateUpiPayLink();};
render();

const cartPayUpi=document.getElementById("cartPayUpi");
if(cartPayUpi){cartPayUpi.addEventListener("click",()=>{const total=cart.reduce((s,x)=>s+x.price*x.qty,0);if(!total){alert("Your cart is empty.");return}const u="upi://pay?pa=7007596728%40ptyes&pn=ANAND%20ENTERPRISES&am="+total.toFixed(2)+"&cu=INR";window.location.href=u;});}

const upiModal=document.getElementById("upiModal"),closeUpi=document.getElementById("closeUpi"),modalTotal=document.getElementById("upiModalTotal"),modalPay=document.getElementById("modalPayLink"),paidContinue=document.getElementById("paidContinue");
const openPayment=()=>{const total=cart.reduce((s,x)=>s+x.price*x.qty,0);if(!total){alert("Your cart is empty.");return}modalTotal.textContent="₹"+total;modalPay.href="upi://pay?pa=7007596728%40ptyes&pn=ANAND%20ENTERPRISES&am="+total.toFixed(2)+"&cu=INR";upiModal.classList.add("show")};
if(cartPayUpi){cartPayUpi.onclick=openPayment}
if(closeUpi){closeUpi.onclick=()=>upiModal.classList.remove("show")}
if(upiModal){upiModal.addEventListener("click",e=>{if(e.target===upiModal)upiModal.classList.remove("show")})}
if(paidContinue){paidContinue.onclick=()=>{upiModal.classList.remove("show");checkoutBtn.click()}}
