'use client';
import {useState} from 'react';

export default function LogoutButton(){
 const [loading,setLoading]=useState(false);
 async function logout(){
  setLoading(true);
  try{await fetch('/api/auth/logout',{method:'POST'});}finally{window.location.href='/';}
 }
 return <button type="button" className="logout-btn" onClick={logout} disabled={loading}>{loading?'Logging out…':'↪ Logout'}</button>;
}
