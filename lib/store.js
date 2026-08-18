import { DEFAULT_CATALOG, DEMO_SHOPS } from "./data";

const KEY="hanout-direct-db-v2";

const initial = {
 catalog: DEFAULT_CATALOG,
 shops: DEMO_SHOPS.map(x=>({...x,balance:0})),
 orders: [],
 ledger: []
};

function load(){
 if(typeof window==="undefined") return initial;
 try{
   const raw=localStorage.getItem(KEY);
   if(!raw){ localStorage.setItem(KEY,JSON.stringify(initial)); return structuredClone(initial); }
   return JSON.parse(raw);
 }catch{return structuredClone(initial)}
}
function save(db){ if(typeof window!=="undefined") localStorage.setItem(KEY,JSON.stringify(db)); }

export function getDB(){ return load(); }
export function setDB(db){ save(db); return db; }

export function getShop(db, shopId){ return db.shops.find(s=>s.id===shopId); }

export async function ensureShop(db, profile){
 let shop = db.shops.find((s) => s.phone === profile.phone);

if (shop) return shop;

const newShop = {
  id: "shop-" + Date.now(),
  shopName: profile.shopName,
  phone: profile.phone,
  balance: 0,
};

db.shops.push(newShop);
await saveDB(db);

return newShop;
}

export function createOrder(db,{shop,items,total,note=""}){
 const order={
  id:"CMD-"+Date.now().toString().slice(-7),
  shopId:shop.id,shopName:shop.shopName,phone:shop.phone,items,total,note,status:"pending",
  paymentStatus:"unpaid",paidAmount:0,creditAmount:0,createdAt:Date.now()
 };
 db.orders.push(order); return order;
}

export function addLedger(db,{shopId,type,amount,orderId=null,note=""}){
 const tx={id:"TX-"+Date.now().toString().slice(-8),shopId,type,amount,orderId,note,createdAt:Date.now()};
 db.ledger.push(tx);
 const shop=getShop(db,shopId);
 if(shop) shop.balance=Math.max(0, Number(shop.balance||0)+amount);
 return tx;
}

export function settleOrder(db,orderId,mode,paidAmount=0){
 const o=db.orders.find(x=>x.id===orderId); if(!o) return;
 if(o.paymentStatus!=="unpaid") return o;
 const paid=Math.max(0,Math.min(Number(paidAmount)||0,o.total));
 const credit=o.total-paid;
 o.paidAmount=paid;o.creditAmount=credit;
 if(mode==="paid" || (mode==="partial" && credit===0)){o.paymentStatus="paid";return o;}
 if(mode==="partial"){o.paymentStatus="partial";}
 if(mode==="credit"){o.paymentStatus="credit";o.paidAmount=0;o.creditAmount=o.total;}
 if(paid>0) addLedger(db,{shopId:o.shopId,type:"order_payment",amount:0,orderId:o.id,note:"Payment recorded in order"});
 if(credit>0) addLedger(db,{shopId:o.shopId,type:"credit",amount:credit,orderId:o.id});
 return o;
}

export function recordPayment(db,shopId,amount,note=""){
 const n=Math.max(0,Number(amount)||0);
 const shop=getShop(db,shopId); if(!shop||n<=0) return null;
 const actual=Math.min(n,Number(shop.balance||0));
 const tx=addLedger(db,{shopId,type:"payment",amount:-actual,note});
 return tx;
}

export function migrateLegacy(){
 const db=load();
 db.catalog=(db.catalog||DEFAULT_CATALOG).map(p=>({lowStock:false,...p}));
 db.shops=db.shops||[];
 db.orders=(db.orders||[]).map(o=>({
   ...o,shopId:
  o.shopId ||
  ("shop-" + String(o.phone || "unknown").replace(/\D/g, "")),paymentStatus:o.paymentStatus||"unpaid",
   paidAmount:o.paidAmount||0,creditAmount:o.creditAmount||0,note:o.note||""
 }));
 db.ledger=db.ledger||[];
 if(!db.shops.length){
   const seen={};
   db.orders.forEach(o=>{if(!seen[o.shopId])seen[o.shopId]={id:o.shopId,shopName:o.shopName,phone:o.phone,balance:0}});
   db.shops=Object.values(seen);
 }
 setDB(db); return db;
}
