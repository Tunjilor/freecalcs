// @ts-nocheck
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

const MONTH_DAYS = [31,28,31,30,31,30,31,31,30,31,30,31];
function isLeap(y:number){return (y%4===0&&y%100!==0)||(y%400===0);}

interface AgeResult {
  years:number; months:number; days:number;
  totalDays:number; totalWeeks:number; totalMonths:number;
  totalHours:number; totalMinutes:number; totalSeconds:number;
  nextBirthdayDays:number; nextBirthdayDate:string;
  dayOfWeek:string; zodiac:string; chineseZodiac:string; generation:string;
  daysToRetire:number; heartbeats:number;
  onMars:string; onJupiter:string; onSaturn:string;
  billionSecondsDate:string; billionSecondsReached:boolean;
  tenThousandDaysDate:string; tenThousandDaysReached:boolean;
}

function calcAge(dob:Date, ref:Date): AgeResult {
  let years = ref.getFullYear()-dob.getFullYear();
  let months = ref.getMonth()-dob.getMonth();
  let days = ref.getDate()-dob.getDate();
  if(days<0){ months--; const pm=(ref.getMonth()-1+12)%12; days+=MONTH_DAYS[pm]+(pm===1&&isLeap(ref.getFullYear())?1:0); }
  if(months<0){ years--; months+=12; }

  const ms = ref.getTime()-dob.getTime();
  const totalDays = Math.floor(ms/86400000);
  const totalWeeks = Math.floor(totalDays/7);
  const totalMonths = years*12+months;
  const totalHours = totalDays*24;
  const totalMinutes = totalHours*60;
  const totalSeconds = totalMinutes*60;
  const heartbeats = Math.round(totalMinutes*70);

  // Next birthday
  const nextBD = new Date(ref.getFullYear(), dob.getMonth(), dob.getDate());
  if(nextBD<=ref) nextBD.setFullYear(nextBD.getFullYear()+1);
  const nextBirthdayDays = Math.ceil((nextBD.getTime()-ref.getTime())/86400000);
  const nextBirthdayDate = nextBD.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});

  // Day of week born
  const dayOfWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][dob.getDay()];

  // Zodiac
  const m=dob.getMonth()+1, d=dob.getDate();
  const zodiacRanges:[number,number,string][] = [[1,20,'Aquarius'],[2,19,'Pisces'],[3,21,'Aries'],[4,20,'Taurus'],[5,21,'Gemini'],[6,21,'Cancer'],[7,23,'Leo'],[8,23,'Virgo'],[9,23,'Libra'],[10,23,'Scorpio'],[11,22,'Sagittarius'],[12,22,'Capricorn']];
  let zodiac='Capricorn';
  for(let zi=0;zi<zodiacRanges.length;zi++){
    const [zmo,zdy,zsign]=zodiacRanges[zi];
    if(m<zmo){ zodiac=zi>0?zodiacRanges[zi-1][2]:'Capricorn'; break; }
    if(m===zmo&&d>=zdy){ zodiac=zsign; break; }
    if(zi===zodiacRanges.length-1){ zodiac=zsign; }
  }

  // Chinese zodiac
  const animals=['Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat','Monkey','Rooster','Dog','Pig'];
  const chineseZodiac = animals[(dob.getFullYear()-1900)%12];

  // Generation
  const yr = dob.getFullYear();
  const generation = yr<1928?'Greatest Generation':yr<1946?'Silent Generation':yr<1965?'Baby Boomer':yr<1981?'Gen X':yr<1997?'Millennial':yr<2013?'Gen Z':'Gen Alpha';

  // Retirement (age 65)
  const retire = new Date(dob.getFullYear()+65, dob.getMonth(), dob.getDate());
  const daysToRetire = Math.max(0, Math.ceil((retire.getTime()-ref.getTime())/86400000));

  // Age on other planets (Earth days per year: Mars 687, Jupiter 4333, Saturn 10759)
  const onMars = (totalDays/687).toFixed(1)+' Mars years';
  const onJupiter = (totalDays/4333).toFixed(1)+' Jupiter years';
  const onSaturn = (totalDays/10759).toFixed(1)+' Saturn years';

  // 1 billion seconds milestone
  const billionSecondsDate = new Date(dob.getTime()+1000000000*1000).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});
  const billionSecondsReached = totalSeconds >= 1000000000;

  // 10,000 days milestone
  const tenThousandDaysDate = new Date(dob.getTime()+10000*86400000).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});
  const tenThousandDaysReached = totalDays >= 10000;

  return {years,months,days,totalDays,totalWeeks,totalMonths,totalHours,totalMinutes,totalSeconds,
    nextBirthdayDays,nextBirthdayDate,dayOfWeek,zodiac,chineseZodiac,generation,daysToRetire,
    heartbeats,onMars,onJupiter,onSaturn,billionSecondsDate,billionSecondsReached,
    tenThousandDaysDate,tenThousandDaysReached};
}

export default function AgeCalculator(){
  const todayStr = new Date().toISOString().split('T')[0];
  const [dob, setDob]       = useState('1990-06-15');
  const [refDate, setRef]   = useState(todayStr);
  const [sex, setSex]       = useState('male');
  const [res, setRes]       = useState<AgeResult|null>(null);

  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sp = new URLSearchParams(window.location.search);
    const _dob = sp.get('dob'); if (_dob) setDob(_dob as any);
    const _sex = sp.get('sex'); if (_sex) setSex(_sex as any);
  }, []);
  const shareCalc = () => {
    const params = new URLSearchParams({ 'dob': String(dob), 'sex': String(sex) });
    const url = window.location.origin + window.location.pathname + '?' + params.toString();
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
    window.history.replaceState({}, '', '?' + params.toString());
  };

  useEffect(()=>{
    const d = new Date(dob); const r = new Date(refDate||todayStr);
    if(!isNaN(d.getTime())&&!isNaN(r.getTime())&&d<r) setRes(calcAge(d,r));
    else setRes(null);
  },[dob,refDate,todayStr]);

  const StatBox = ({label,value,sub,color='#111827'}:{label:string;value:string;sub?:string;color?:string})=>(
    <div style={{background:'#f8fafc',borderRadius:12,padding:'12px 14px',border:`1px solid ${C.border}`}}>
      <p style={{fontSize:10,fontWeight:700,color:'#6b7280',textTransform:'uppercase',letterSpacing:'.05em',margin:'0 0 3px'}}>{label}</p>
      <p style={{fontSize:18,fontWeight:700,color,margin:0,lineHeight:1.2}}>{value}</p>
      {sub&&<p style={{fontSize:10,color:'#9ca3af',margin:'2px 0 0'}}>{sub}</p>}
    </div>
  );

  const MilestoneRow = ({label,date,reached,daysLeft}:{label:string;date:string;reached:boolean;daysLeft?:number})=>(
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 12px',borderRadius:9,marginBottom:6,border:`1px solid ${reached?'#86efac':C.border}`,background:reached?'#f0fdf4':C.white}}>
      <div>
        <p style={{fontSize:13,fontWeight:600,color:reached?'#166534':'#374151',margin:0}}>{label}</p>
        <p style={{fontSize:11,color:'#9ca3af',margin:'1px 0 0'}}>{date}</p>
      </div>
      <span style={{fontSize:12,fontWeight:700,color:reached?'#16a34a':C.blue,background:reached?'#dcfce7':'#eff6ff',padding:'3px 10px',borderRadius:20,whiteSpace:'nowrap'}}>
        {reached?'Reached!':daysLeft?daysLeft.toLocaleString()+' days':'Future'}
      </span>
    </div>
  );

  return(
    <div style={{fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',background:C.light,minHeight:'100vh'}}>
      <style>{`@media(max-width:700px){.age-grid{grid-template-columns:1fr!important;}}`}</style>

      <div style={{background:`linear-gradient(135deg,${C.darkBlue},${C.blue})`,color:C.white,padding:'32px 16px 40px'}}>
        <div style={{maxWidth:960,margin:'0 auto'}}>
          <a href="/" style={{color:'#93c5fd',fontSize:13,textDecoration:'none'}}>&lt;- freecalcs.io</a>
          <h1 style={{fontSize:28,fontWeight:700,margin:'12px 0 8px',color:C.white}}>Age Calculator</h1>
          <p style={{color:'#93c5fd',fontSize:14,margin:'0 0 16px'}}>Your exact age in years, months, days, hours, minutes and seconds. Plus zodiac, generation, birthday countdown, planetary age, and milestone tracker.</p>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {['Exact Age','Birthday Countdown','Zodiac Sign','Planetary Age','1 Billion Seconds','Heartbeats'].map(t=>(
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
                <input style={inp} type="date" value={dob} onChange={e=>setDob(e.target.value)} max={todayStr}/>
              </div>
              <div style={{marginBottom:14}}>
                <label style={lbl}>Calculate age on</label>
                <input style={inp} type="date" value={refDate} onChange={e=>setRef(e.target.value)}/>
                <p style={{fontSize:11,color:'#9ca3af',margin:'4px 0 0'}}>Default is today. Change to find age on any date.</p>
              </div>
              <div>
                <label style={lbl}>Sex (for life expectancy)</label>
                <div style={{display:'flex',borderRadius:10,overflow:'hidden',border:`1px solid ${C.border}`}}>
                  {[['male','Male'],['female','Female']].map(([v,l])=>(
                    <button key={v} onClick={()=>setSex(v)} style={{flex:1,padding:'10px 0',fontSize:14,fontWeight:600,border:'none',cursor:'pointer',background:sex===v?C.blue:C.white,color:sex===v?C.white:'#374151'}}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {res&&(
              <>
                {/* Fun facts */}
                <div style={{...card,background:'linear-gradient(135deg,#eff6ff,#eef2ff)',border:'1px solid #bfdbfe'}}>
                  <p style={{fontSize:11,fontWeight:700,color:'#1e40af',textTransform:'uppercase',letterSpacing:'.05em',margin:'0 0 12px'}}>Fun Facts About You</p>
                  {[
                    ['Born on a', res.dayOfWeek],
                    ['Zodiac Sign', res.zodiac],
                    ['Chinese Zodiac', res.chineseZodiac],
                    ['Generation', res.generation],
                    ['Age on Mars', res.onMars],
                    ['Age on Jupiter', res.onJupiter],
                    ['Age on Saturn', res.onSaturn],
                  ].map(([l,v])=>(
                    <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid rgba(37,99,235,.1)'}}>
                      <span style={{fontSize:13,color:'#374151'}}>{l}</span>
                      <span style={{fontSize:13,fontWeight:700,color:C.blue}}>{v}</span>
                    </div>
                  ))}
                </div>

                {/* Life milestones */}
                <div style={{...card}}>
                  <p style={{fontSize:12,fontWeight:700,color:'#111827',textTransform:'uppercase',letterSpacing:'.05em',margin:'0 0 12px'}}>Life Milestones</p>
                  <MilestoneRow label="10,000 Days Old" date={res.tenThousandDaysDate} reached={res.tenThousandDaysReached} daysLeft={Math.max(0,10000-res.totalDays)}/>
                  <MilestoneRow label="1 Billion Seconds Old" date={res.billionSecondsDate} reached={res.billionSecondsReached} daysLeft={Math.max(0,Math.round((1000000000-res.totalSeconds)/86400))}/>
                  <MilestoneRow label="Retirement Age (65)" date={new Date(new Date(dob).getTime()+(65*365.25*86400000)).toLocaleDateString('en-US',{month:'long',year:'numeric'})} reached={res.daysToRetire===0} daysLeft={res.daysToRetire}/>
                  <MilestoneRow label="100 Years Old" date={new Date(new Date(dob).getTime()+(100*365.25*86400000)).toLocaleDateString('en-US',{month:'long',year:'numeric'})} reached={res.years>=100} daysLeft={Math.max(0,(100-res.years)*365-res.days)}/>
                </div>
              </>
            )}
          </div>

          {/* RIGHT */}
          <div>
            {res?(
              <>
                {/* Hero */}
                <div style={{background:`linear-gradient(135deg,${C.darkBlue},${C.blue})`,borderRadius:16,padding:20,color:C.white,marginBottom:16,boxShadow:'0 4px 20px rgba(37,99,235,.3)'}}>
                  <p style={{fontSize:11,fontWeight:600,letterSpacing:'.1em',color:'#93c5fd',margin:'0 0 6px',textTransform:'uppercase'}}>Your Exact Age</p>
                  <div style={{fontSize:38,fontWeight:800,lineHeight:1.1,margin:'0 0 14px'}}>
                    {res.years}<span style={{fontSize:18,fontWeight:400,marginLeft:3}}>yrs</span>{' '}
                    {res.months}<span style={{fontSize:18,fontWeight:400,marginLeft:3}}>mo</span>{' '}
                    {res.days}<span style={{fontSize:18,fontWeight:400,marginLeft:3}}>days</span>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                    {[
                      ['Total Days',res.totalDays.toLocaleString()],
                      ['Total Weeks',res.totalWeeks.toLocaleString()],
                      ['Total Hours',res.totalHours.toLocaleString()],
                      ['Total Seconds',res.totalSeconds.toLocaleString()],
                    ].map(([l,v])=>(
                      <div key={l} style={{background:'rgba(255,255,255,.12)',borderRadius:10,padding:'10px 12px'}}>
                        <p style={{fontSize:11,color:'#93c5fd',margin:'0 0 2px'}}>{l}</p>
                        <p style={{fontSize:14,fontWeight:700,margin:0}}>{v}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats grid */}
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
                  <StatBox label="Next Birthday" value={res.nextBirthdayDays+' days'} sub={res.nextBirthdayDate} color={C.blue}/>
                  <StatBox label="Total Months" value={res.totalMonths.toLocaleString()} sub="since birth"/>
                  <StatBox label="Heartbeats (est.)" value={(res.heartbeats/1000000).toFixed(1)+'M'} sub="avg 70 bpm" color='#ef4444'/>
                  <StatBox label="Total Minutes" value={res.totalMinutes.toLocaleString()} sub="since birth"/>
                  <StatBox label="Retirement" value={res.daysToRetire>0?res.daysToRetire.toLocaleString()+' days':'Congratulations!'} sub="at age 65" color={res.daysToRetire===0?'#16a34a':C.blue}/>
                  <StatBox label="Life Expectancy Left" value={(sex==='male'?Math.max(0,76-res.years):Math.max(0,81-res.years))+' yrs'} sub={sex==='male'?'Avg US male: 76':'Avg US female: 81'}/>
                </div>

                {/* Educational */}
                <div style={{...card,background:'#f8fafc'}}>
                  <p style={{fontSize:13,fontWeight:700,color:'#111827',margin:'0 0 10px'}}>Did You Know?</p>
                  <div style={{display:'flex',flexDirection:'column',gap:8,fontSize:13,color:'#374151',lineHeight:1.6}}>
                    <p style={{margin:0}}>The average human heart beats about <strong>2.5 billion times</strong> in a lifetime. You have had approximately <strong>{(res.heartbeats/1000000).toFixed(1)} million heartbeats</strong> so far.</p>
                    <p style={{margin:0}}>You will reach <strong>1 billion seconds</strong> old on <strong>{res.billionSecondsDate}</strong> - about age 31.7. Most people celebrate this without knowing it!</p>
                    <p style={{margin:0}}>On Mars (687 Earth days per year), you are only <strong>{res.onMars}</strong>. On Saturn (10,759 Earth days per year), you are just <strong>{res.onSaturn}</strong>.</p>
                  </div>
                </div>
              </>
            ):(
              <div style={{...card,textAlign:'center',padding:48}}>
                <p style={{fontSize:20,color:C.blue,fontWeight:700,margin:'0 0 8px'}}>Enter your date of birth</p>
                <p style={{fontSize:14,color:'#9ca3af',margin:0}}>We will calculate your exact age plus zodiac, planetary age, heartbeats, and milestone countdowns.</p>
              </div>
            )}
          </div>
        </div>

        {/* FAQ / SEO */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginTop:32}} className="age-faq">
          <style>{`.age-faq{} @media(max-width:600px){.age-faq{grid-template-columns:1fr!important;}}`}</style>
          <div style={{...card}}>
            <h2 style={{fontSize:16,fontWeight:700,color:'#111827',marginBottom:12}}>How is Age Calculated?</h2>
            <p style={{fontSize:13,color:'#374151',lineHeight:1.7,margin:'0 0 10px'}}>Age is calculated by finding the difference between your date of birth and today (or any target date). The calculation accounts for varying month lengths, leap years, and the exact number of days in each month.</p>
            <p style={{fontSize:13,color:'#374151',lineHeight:1.7,margin:0}}>For example, if you were born on June 15, 1990 and today is May 8, 2026, you are 35 years, 10 months, and 23 days old.</p>
          </div>
          <div style={{...card}}>
            <h2 style={{fontSize:16,fontWeight:700,color:'#111827',marginBottom:12}}>What is the 1 Billion Seconds Milestone?</h2>
            <p style={{fontSize:13,color:'#374151',lineHeight:1.7,margin:'0 0 10px'}}>One billion seconds is approximately 31 years, 259 days. It is a fun milestone that most people pass without realizing it. You can find your exact 1-billion-second birthday above.</p>
            <p style={{fontSize:13,color:'#374151',lineHeight:1.7,margin:0}}>Similarly, 10,000 days is about 27 years and 4-5 months. These are popular milestones to celebrate on social media.</p>
          </div>
        </div>

        <div style={{background:'linear-gradient(135deg,#eff6ff,#eef2ff)',borderRadius:16,padding:20,border:'1px solid #bfdbfe',marginTop:8}}>
          <p style={{fontSize:13,fontWeight:600,color:'#374151',marginBottom:12}}>All freecalcs.io Calculators</p>
          <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
            {ALL_CALCS.map(([href,name])=>(
              <a key={href} href={href} style={{background:C.white,fontSize:13,color:C.blue,fontWeight:500,padding:'8px 16px',borderRadius:10,border:'1px solid #bfdbfe',textDecoration:'none'}}>{name}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}