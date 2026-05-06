import Link from "next/link";
const calcs = [
  {slug:"mortgage",label:"Mortgage",icon:"🏠",desc:"Monthly payments & amortization"},
  {slug:"salary",label:"Salary & Take-Home",icon:"💵",desc:"Net pay after taxes"},
  {slug:"bmi",label:"BMI",icon:"⚖️",desc:"Body mass index for adults"},
  {slug:"tdee",label:"TDEE & Calories",icon:"🔥",desc:"Daily energy & macros"},
  {slug:"tax",label:"Income Tax",icon:"🧾",desc:"Federal tax estimate"},
  {slug:"compound-interest",label:"Compound Interest",icon:"📈",desc:"Savings growth over time"},
  {slug:"loan",label:"Loan & EMI",icon:"🏦",desc:"Monthly repayments"},
  {slug:"rent-vs-buy",label:"Rent vs Buy",icon:"🏡",desc:"Is buying worth it?"},
  {slug:"tip",label:"Tip Calculator",icon:"🍽️",desc:"Split bills instantly"},
  {slug:"age",label:"Age Calculator",icon:"🎂",desc:"Exact age to the day"},
  {slug:"percentage",label:"Percentage",icon:"﹪",desc:"Percent of, change & more"},
  {slug:"scientific",label:"Scientific Calculator",icon:"🔬",desc:"Full scientific functions"},
];
export default function Home() {
  return (
    <main style={{minHeight:"100vh",background:"#f8f9fb",fontFamily:"system-ui,sans-serif"}}>
      <nav style={{background:"#fff",borderBottom:"1px solid #eee",padding:"0 24px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",height:56,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span><b style={{fontSize:22,color:"#111"}}>freecalcs</b><b style={{fontSize:22,color:"#2563eb"}}>.io</b></span>
          <div style={{display:"flex",gap:24}}>
            <Link href="/blog" style={{color:"#6b7280",textDecoration:"none",fontSize:14}}>Blog</Link>
            <Link href="/about" style={{color:"#6b7280",textDecoration:"none",fontSize:14}}>About</Link>
          </div>
        </div>
      </nav>
      <section style={{maxWidth:1100,margin:"0 auto",padding:"60px 24px 40px"}}>
        <h1 style={{fontSize:52,fontWeight:800,lineHeight:1.1,color:"#111",marginBottom:14}}>The calculators<br/><span style={{color:"#2563eb"}}>people actually use</span></h1>
        <p style={{fontSize:18,color:"#6b7280",maxWidth:460,lineHeight:1.6}}>Fast, accurate tools for money, health, and everyday math. Free, always.</p>
      </section>
      <section style={{maxWidth:1100,margin:"0 auto",padding:"0 24px 80px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:12}}>
          {calcs.map((c)=>(
            <Link key={c.slug} href={"/"+c.slug} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:14,padding:20,textDecoration:"none",display:"flex",flexDirection:"column",gap:6,transition:"all 0.15s"}}>
              <span style={{fontSize:26}}>{c.icon}</span>
              <span style={{fontSize:15,fontWeight:600,color:"#111"}}>{c.label}</span>
              <span style={{fontSize:13,color:"#9ca3af"}}>{c.desc}</span>
            </Link>
          ))}
        </div>
      </section>
      <footer style={{borderTop:"1px solid #e5e7eb",padding:"24px",textAlign:"center",fontSize:13,color:"#9ca3af"}}>
        © {new Date().getFullYear()} freecalcs.io — Free tools, always.
      </footer>
    </main>
  );
}
