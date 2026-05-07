'use client';
import { useState, useEffect } from 'react';

const C = { blue:'#2563eb', darkBlue:'#1e3a5f', gray:'#6b7280', border:'#e5e7eb', white:'#ffffff', light:'#f8fafc' };
const card: React.CSSProperties = { background:C.white, borderRadius:16, padding:20, boxShadow:'0 1px 3px rgba(0,0,0,.08)', border:`1px solid ${C.border}`, marginBottom:16 };
const inp: React.CSSProperties  = { width:'100%', border:`1px solid #cbd5e1`, borderRadius:10, padding:'10px 12px', fontSize:14, outline:'none', background:C.white, boxSizing:'border-box', color:'#111827', fontWeight:500 };
const lbl: React.CSSProperties  = { display:'block', fontSize:11, fontWeight:700, color:'#374151', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:4 } as React.CSSProperties;

const ALL_CALCS = [
  ['/mortgage','Mortgage Calculator'],['/qualify','Mortgage Qualifier'],['/rent-vs-buy','Rent vs Buy'],
  ['/loan','Loan & EMI'],['/salary','Salary Calculator'],['/tax','Income Tax'],
  ['/compound-interest','Compound Interest'],['/percentage','Percentage Calc'],
  ['/bmi','BMI Calculator'],['/tdee','TDEE & Calories'],['/tip','Tip Calculator'],
];

const DAYS_IN_MONTH = [31,28,31,30,31,30,31,31,30,31,30,31];
function isLeap(y:number){return (y%4===0&&y%100!==0)||(y%400===0);}

function calcAge(dob:Date, ref:Date) {
  let years = ref.getFullYear() - dob.getFullYear();
  let months = ref.getMonth() - dob.getMonth();
  let days = ref.getDate() - dob.getDate();
  if(days<0){ months--; const prevMonth=(ref.getMonth()-1+12)%12; days+=DAYS_IN_MONTH[prevMonth]+(prevMonth===1&&isLeap(ref.getFullYear())?1:0); }
  if(months<0){ years--; months+=12; }
  const totalDays = Math.floor((ref.getTime()-dob.getTime())/(1000*60*60*24));
  const totalWeeks = Math.floor(totalDays/7);
  const totalHours = totalDays*24;
  const totalMinutes = totalHours*60;
  const totalMonths = years*12+months;
  return {years,months,days,totalDays,totalWeeks,totalHours,totalMonths};
}

function getZodiac(month:number,day:number):string {
  const signs=[['Capricorn',1,19],['Aquarius',2,18],['Pisces',3,20],['Aries',4,19],['Taurus',5,20],['Gemini',6,20],['Cancer',7,22],['Leo',8,22],['Virgo',9,22],['Libra',10,22],['Scorpio',11,21],['Sagittarius',12,21],['Capricorn',12,31]] as [string,number,number][];
  for(let i=0;i<signs.length-1;i++){
    const [sign,endMo,endDay]=signs[i];
    if((month===endMo&&day<=endDay)||(i>0&&month===signs[i-1][1]&&day>signs[i-1][2])){
      if(month===signs[i][1]&&day<=signs[i][2]) return sign;
    }
  }
  const [sign,endMo,endDay]=signs[0];
  return sign;
}

function getChineseZodiac(year:number):string {
  const animals=['Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat','Monkey','Rooster','Dog','Pig'];
  return animals[(year-1900)%12];
}

function getGeneration(year:number):string {
  if(year<1928) return 'Greatest Generation';
  if(year<1946) return 'Silent Generation';
  if(year<1965) return 'Baby Boomer';
  if(year<1981) return 'Generation X';
  if(year<1997) return 'Millennial';
  if(year<2013) return 'Generation Z';
  return 'Generation Alpha';
}

function getDayOfWeek(date:Date):string {
  return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][date.getDay()];
}

export default function AgeCalculator(){
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const [dob, setDob] = useState('1990-06-15');
  const [refDate, setRefDate] = useState(todayStr);
  const [futureDate, setFutureDate] = useState('');
  const [res, setRes] = useState<ReturnType<typeof calcAge>|null>(null);

  useEffect(()=>{
    const d=new Date(dob);
    const r=new Date(refDate||todayStr);
    if(!isNaN(d.getTime())&&!isNaN(r.getTime())&&d<r){
      setRes(calcAge(d,r));
    }
  },[dob,refDate,todayStr]);

  const dobDate = new Date(dob);
  const dobValid = !isNaN(dobDate.getTime());
  const zodiac = dobValid ? getZodiac(dobDate.getMonth()+1,dobDate.getDate()) : '';
  const chinese = dobValid ? getChineseZodiac(dobDate.getFullYear()) : '';
  const generation = dobValid ? getGeneration(dobDate.getFullYear()) : '';
  const dayBorn = dobValid ? getDayOfWeek(dobDate) : '';

  const nextBirthday = ()=>{
    if(!dobValid) return null;
    const now = new Date();
    const next = new Date(now.getFullYear(),dobDate.getMonth(),dobDate.getDate());
    if(next<=now) next.setFullYear(now.getFullYear()+1);
    const diff = Math.ceil((next.getTime()-now.getTime())/(1000*60*60*24));
    return {date:next,daysAway:diff};
  };
  const bday = nextBirthday();

  const ageOnFuture = ()=>{
    if(!futureDate||!dobValid) return null;
    const fd=new Date(futureDate);
    if(isNaN(fd.getTime())||fd<=dobDate) return null;
    return calcAge(dobDate,fd);
  };
  const futureAge = ageOnFuture();

  const StatCard = ({label,value,sub}:{label:string;value:string|number;sub?:string})=>(
    <div style={{background:'#f8fafc',borderRadius:12,padding:'12px 14px',border:`1px solid ${C.border}`,textAlign:'center'}}>
      <p style={{fontSize:11,color:C.gray,fontWeight:600,textTransform:'uppercase',letterSpacing:'.04em',margin:'0 0 4px'}}>{label}</p>
      <p style={{fontSize:20,fontWeight:700,color:'#111827',margin:'0 0 2px'}}>{value.toLocaleString()}</p>
      {sub&&<p style={{fontSize:11,color:'#9ca3af',margin:0}}>{sub}</p>}
    </div>
  );

  return(
    <div style={{fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',background:C.light,minHeight:'100vh'}}>
      <style>{`@media(max-width:640px){.age-grid{grid-template-columns:1fr!important;}.age-stats{grid-template-columns:1fr 1fr!important;}}`}</style>

      <div style={{background:`linear-gradient(135deg,${C.darkBlue},${C.blue})`,color:C.white,padding:'32px 16px 40px'}}>
        <div style={{maxWidth:960,margin:'0 auto'}}>
          <a href="/" style={{color:'#93c5fd',fontSize:13,textDecoration:'none'}}>&lt;- freecalcs.io</a>
          <h1 style={{fontSize:28,fontWeight:700,margin:'12px 0 8px',color:C.white}}>Age Calculator</h1>
          <p style={{color:'#93c5fd',fontSize:14,margin:'0 0 16px'}}>Calculate your exact age in years, months, weeks, days, and hours. Find your next birthday countdown, zodiac sign, generation, and more.</p>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {['Exact Age','Birthday Countdown','Zodiac Sign','Chinese Zodiac','Generation','Future Age'].map(t=>(
              <span key={t} style={{background:'rgba(255,255,255,.15)',fontSize:12,padding:'4px 12px',borderRadius:20,color:C.white}}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:960,margin:'0 auto',padding:'24px 16px'}}>
        <div style={{display:'grid',gridTemplateColumns:'minmax(0,2fr) minmax(0,3fr)',gap:20}} className="age-grid">

          {/* LEFT */}
          <div>
            <div style={{...card}}>
              <div style={{marginBottom:14}}>
                <label style={lbl}>Date of Birth</label>
                <input style={inp} type="date" value={dob} max={todayStr} onChange={e=>setDob(e.target.value)}/>
              </div>
              <div style={{marginBottom:14}}>
                <label style={lbl}>Calculate Age As Of</label>
                <input style={inp} type="date" value={refDate} max={new Date(Date.now()+365*5*24*3600*1000).toISOString().split('T')[0]} onChange={e=>setRefDate(e.target.value)}/>
                <button onClick={()=>setRefDate(todayStr)} style={{marginTop:6,fontSize:12,color:C.blue,background:'none',border:'none',cursor:'pointer',padding:0,textDecoration:'underline'}}>Reset to today</button>
              </div>

              {/* Quick ages */}
              <div style={{marginBottom:16}}>
                <p style={{fontSize:11,fontWeight:700,color:'#374151',textTransform:'uppercase',letterSpacing:'.05em',margin:'0 0 8px'}}>Quick Select DOB</p>
                <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                  {[['Baby (1yr)','2024'],['Child (10yr)','2015'],['Teen (16yr)','2009'],['Millennial (30yr)','1995'],['GenX (50yr)','1975'],['Boomer (65yr)','1960']].map(([label,year])=>{
                    const d=new Date(parseInt(year),5,15);
                    const dStr=d.toISOString().split('T')[0];
                    return(
                      <button key={label} onClick={()=>setDob(dStr)} style={{padding:'4px 10px',fontSize:11,fontWeight:600,borderRadius:6,border:`1px solid ${C.border}`,background:C.white,color:'#374151',cursor:'pointer'}}>{label}</button>
                    );
                  })}
                </div>
              </div>

              {/* Fun facts */}
              {dobValid&&(
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  {[
                    {label:'Day You Were Born',value:dayBorn},
                    {label:'Zodiac Sign',value:zodiac},
                    {label:'Chinese Zodiac',value:`Year of the ${chinese}`},
                    {label:'Generation',value:generation},
                  ].map(({label,value})=>(
                    <div key={label} style={{display:'flex',justifyContent:'space-between',padding:'8px 12px',borderRadius:9,background:'#f8fafc',border:`1px solid ${C.border}`}}>
                      <span style={{fontSize:13,color:C.gray}}>{label}</span>
                      <span style={{fontSize:13,fontWeight:700,color:'#111827'}}>{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Future age */}
            <div style={{...card}}>
              <p style={{fontSize:12,fontWeight:700,color:'#374151',textTransform:'uppercase',letterSpacing:'.05em',margin:'0 0 10px'}}>How Old Will I Be On...</p>
              <input style={inp} type="date" value={futureDate} onChange={e=>setFutureDate(e.target.value)}/>
              {futureAge&&(
                <div style={{marginTop:12,padding:'12px 14px',background:'#eff6ff',borderRadius:10,border:'1px solid #bfdbfe'}}>
                  <p style={{fontSize:16,fontWeight:700,color:C.blue,margin:'0 0 4px'}}>{futureAge.years} years, {futureAge.months} months, {futureAge.days} days</p>
                  <p style={{fontSize:12,color:'#374151',margin:0}}>on {new Date(futureDate).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div>
            {res&&(
              <>
                {/* Hero */}
                <div style={{background:`linear-gradient(135deg,${C.darkBlue},${C.blue})`,borderRadius:16,padding:20,color:C.white,marginBottom:16,boxShadow:'0 4px 20px rgba(37,99,235,.3)'}}>
                  <p style={{fontSize:11,fontWeight:600,letterSpacing:'.1em',color:'#93c5fd',margin:'0 0 8px',textTransform:'uppercase'}}>Your Exact Age</p>
                  <div style={{display:'flex',alignItems:'baseline',gap:8,flexWrap:'wrap',marginBottom:8}}>
                    <span style={{fontSize:52,fontWeight:700,lineHeight:1}}>{res.years}</span>
                    <span style={{fontSize:18,color:'#93c5fd'}}>years</span>
                    <span style={{fontSize:32,fontWeight:600}}>{res.months}</span>
                    <span style={{fontSize:16,color:'#93c5fd'}}>months</span>
                    <span style={{fontSize:24,fontWeight:600}}>{res.days}</span>
                    <span style={{fontSize:14,color:'#93c5fd'}}>days</span>
                  </div>
                  {bday&&(
                    <div style={{background:'rgba(255,255,255,.12)',borderRadius:10,padding:'10px 14px',marginTop:8}}>
                      <p style={{fontSize:12,color:'#93c5fd',margin:'0 0 2px'}}>Next Birthday</p>
                      <p style={{fontSize:15,fontWeight:700,margin:0}}>{bday.date.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})} - in {bday.daysAway} days</p>
                    </div>
                  )}
                </div>

                {/* Stats grid */}
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:16}} className="age-stats">
                  <StatCard label="Total Months" value={res.totalMonths}/>
                  <StatCard label="Total Weeks" value={res.totalWeeks}/>
                  <StatCard label="Total Days" value={res.totalDays}/>
                  <StatCard label="Total Hours" value={res.totalHours} sub="approx."/>
                  <StatCard label="Total Minutes" value={res.totalMinutes} sub="approx."/>
                  <StatCard label="Heartbeats" value={Math.round(res.totalMinutes*70)} sub="avg 70 bpm"/>
                </div>

                {/* Life milestones */}
                <div style={{...card}}>
                  <p style={{fontSize:12,fontWeight:700,color:'#111827',textTransform:'uppercase',letterSpacing:'.05em',margin:'0 0 14px'}}>Life Milestones</p>
                  {dobValid&&[
                    {label:'Sweet 16',age:16},{label:'Legal adult (18)',age:18},{label:'Legal drinking (21)',age:21},
                    {label:'Quarter century',age:25},{label:'Thirty',age:30},{label:'Forty',age:40},
                    {label:'Half century',age:50},{label:'Retirement (67)',age:67},{label:'Century',age:100},
                  ].map(({label,age})=>{
                    const milestoneDate=new Date(dobDate.getFullYear()+age,dobDate.getMonth(),dobDate.getDate());
                    const isPast=milestoneDate<=new Date();
                    const daysAway=Math.ceil((milestoneDate.getTime()-new Date().getTime())/(1000*60*60*24));
                    return(
                      <div key={label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 10px',borderRadius:8,marginBottom:4,background:isPast?'#f8fafc':res.years<age?'#fffbeb':'#f0fdf4',border:`1px solid ${isPast?C.border:res.years<age?'#fde047':'#86efac'}`}}>
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <span style={{fontSize:13,color:isPast?C.gray:'#111827',fontWeight:isPast?400:500,textDecoration:isPast?'line-through':'none'}}>{label}</span>
                        </div>
                        <div style={{textAlign:'right'}}>
                          <p style={{fontSize:12,fontWeight:600,color:isPast?C.gray:C.blue,margin:0}}>{milestoneDate.toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'})}</p>
                          {!isPast&&<p style={{fontSize:10,color:'#9ca3af',margin:0}}>in {daysAway} days</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        <div style={{background:'linear-gradient(135deg,#eff6ff,#eef2ff)',borderRadius:16,padding:20,border:'1px solid #bfdbfe',marginTop:20}}>
          <p style={{fontSize:13,fontWeight:600,color:'#374151',marginBottom:12}}>All freecalcs.io Calculators</p>
          <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
            {ALL_CALCS.map(([href,name])=>(<a key={href} href={href} style={{background:C.white,fontSize:13,color:C.blue,fontWeight:500,padding:'8px 16px',borderRadius:10,border:'1px solid #bfdbfe',textDecoration:'none'}}>{name}</a>))}
          </div>
        </div>
      </div>
    </div>
  );
}
