const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const db = new PrismaClient();
async function main(){
 const adminPassword=process.env.ADMIN_PASSWORD||'admin123';
 const schoolPassword=process.env.DEMO_SCHOOL_PASSWORD||'school12345';
 await db.user.upsert({where:{username:'admin'},update:{passwordHash:await bcrypt.hash(adminPassword,12),role:'ADMIN'},create:{username:'admin',passwordHash:await bcrypt.hash(adminPassword,12),role:'ADMIN'}});
 const school=await db.school.upsert({where:{id:'demo-school'},update:{status:'ACTIVE'},create:{id:'demo-school',name:'Demo School',address:'Replace with school address',status:'ACTIVE'}});
 await db.user.upsert({where:{username:'school_demo'},update:{passwordHash:await bcrypt.hash(schoolPassword,12),schoolId:school.id,role:'SCHOOL'},create:{username:'school_demo',passwordHash:await bcrypt.hash(schoolPassword,12),role:'SCHOOL',schoolId:school.id}});
 await db.design.createMany({data:[{name:'Classic Blue',rate:35},{name:'Modern Orange',rate:40}],skipDuplicates:true});
 const settings={businessName:'AK Painters Designer',upiName:'AK Painters',upiId:'',idCardRate:'35',weddingCardRate:'',businessCardRate:'',advancePercent:'50',phone:'',email:'',address:''};
 for(const [key,value] of Object.entries(settings)) await db.appSetting.upsert({where:{key},update:{},create:{key,value}});
 console.log({admin:'admin',adminPassword,school:'school_demo',schoolPassword});
}
main().finally(()=>db.$disconnect());
