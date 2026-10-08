'use client';
import {FormEvent,useEffect,useMemo,useState} from 'react';

const fallbackServices=['School ID Cards','Wedding Cards','Business Printing','Graphic Design','Other'];
const slug=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');

export default function CustomerOrderForm(){
 const [rates,setRates]=useState<Record<string,number>>({});
 const [serviceName,setServiceName]=useState(''); const [quantity,setQuantity]=useState(1);
 const [loading,setLoading]=useState(false); const [message,setMessage]=useState(''); const [error,setError]=useState('');
 useEffect(()=>{fetch('/api/public/order-settings').then(r=>r.json()).then(d=>setRates(d.rates||{})).catch(()=>{});},[]);
 const services=useMemo(()=>Array.from(new Set([...fallbackServices,...Object.keys(rates).map(k=>k.split('_').map(x=>x.charAt(0).toUpperCase()+x.slice(1)).join(' '))])),[rates]);
 const rate=rates[slug(serviceName)]||0; const total=rate*quantity;
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setLoading(true);setMessage('');setError('');const form=new FormData(e.currentTarget);const payload=Object.fromEntries(form.entries());
  try{const res=await fetch('/api/public/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...payload,serviceName,quantity})});const data=await res.json();if(!res.ok)throw new Error(data.error||'Order submit failed');
   setMessage(`Order submitted successfully. Order ID: ${data.orderId} • Total: ₹${data.amount}`);e.currentTarget.reset();setServiceName('');setQuantity(1);
   if(data.whatsapp){const text=encodeURIComponent(`New Customer Order - AK Painters Designer\nOrder ID: ${data.orderId}\nCustomer: ${payload.name}\nMobile: ${payload.phone}\nService: ${serviceName}\nQuantity: ${quantity}\nRate: ₹${data.rate}/unit\nTotal: ₹${data.amount}\nRequirement: ${payload.notes||'-'}`);window.location.href=`https://wa.me/${data.whatsapp}?text=${text}`;}
  }catch(err){setError(err instanceof Error?err.message:'Order submit failed');}finally{setLoading(false);}}
 return <section id="customer-order" className="customer-order"><div className="customer-order-copy"><span className="eyebrow">CUSTOMER ORDER</span><h2>Need a design or printing service?</h2><p>Choose a service, see its current rate, enter quantity and send your requirement directly to AK Painters.</p><div className="order-points"><span>✓ Service-wise rate</span><span>✓ Quantity × Rate = Total</span><span>✓ Admin receives order details on WhatsApp</span></div></div>
 <form className="customer-order-form" onSubmit={submit}><div className="form-grid"><div className="field"><label>Customer Name *</label><input name="name" required placeholder="Your full name"/></div><div className="field"><label>Mobile Number *</label><input name="phone" required inputMode="tel" placeholder="10-digit mobile number"/></div><div className="field"><label>Email</label><input name="email" type="email" placeholder="your@email.com"/></div><div className="field"><label>Service *</label><select name="serviceName" required value={serviceName} onChange={e=>setServiceName(e.target.value)}><option value="" disabled>Select service</option>{services.map(s=><option key={s}>{s}</option>)}</select></div><div className="field"><label>Quantity</label><input name="quantity" type="number" min="1" value={quantity} onChange={e=>setQuantity(Math.max(1,Number(e.target.value)||1))}/></div><div className="field"><label>Rate / Unit</label><input value={serviceName?`₹${rate}`:'Select service'} readOnly/></div><div className="field field-full"><label>Total Amount</label><div className="order-total">₹{total.toLocaleString('en-IN')}</div></div><div className="field field-full"><label>Requirement / Details</label><textarea name="notes" rows={4} placeholder="Tell us what you need..."/></div></div>{message&&<div className="order-success">✓ {message}</div>}{error&&<div className="error">{error}</div>}<button className="btn primary order-submit" disabled={loading}>{loading?'Submitting...':'Submit Customer Order →'}</button></form></section>
}
