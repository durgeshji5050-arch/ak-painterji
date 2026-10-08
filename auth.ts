import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'development-only-secret-change-me');
export type Session = { userId:string; role:'ADMIN'|'SCHOOL'; schoolId?:string };
export async function setSession(s:Session){const token=await new SignJWT(s).setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime('8h').sign(secret);(await cookies()).set('ak_session',token,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/'});}
export async function getSession():Promise<Session|null>{const token=(await cookies()).get('ak_session')?.value;if(!token)return null;try{return (await jwtVerify(token,secret)).payload as unknown as Session}catch{return null}}
