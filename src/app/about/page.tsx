import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About freecalcs.io | Free Calculators, Always',
  description: 'Learn about freecalcs.io - a free, ad-free calculator hub built to compete with the best. Our mission, disclaimer, and commitment to accuracy.',
  alternates: { canonical: 'https://www.freecalcs.io/about' },
};

const C = { blue:'#2563eb', darkBlue:'#1e3a5f', border:'#e5e7eb', white:'#ffffff', light:'#f8fafc' };
const card: React.CSSProperties = { background:C.white, borderRadius:16, padding:28, boxShadow:'0 1px 3px rgba(0,0,0,.08)', border:`1px solid ${C.border}`, marginBottom:20 };

const ALL_CALCS = [
  ['/mortgage','Mortgage Calculator'],['/qualify','Mortgage Qualifier'],['/rent-vs-buy','Rent vs Buy'],
  ['/loan','Loan & EMI'],['/salary','Salary Calculator'],['/tax','Income Tax'],
  ['/compound-interest','Compound Interest'],['/percentage','Percentage Calc'],
  ['/bmi','BMI Calculator'],['/tdee','TDEE & Calories'],['/age','Age Calculator'],['/tip','Tip Calculator'],
];

export default function AboutPage(){
  return(
    <div style={{fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',background:C.light,minHeight:'100vh'}}>

      <div style={{background:`linear-gradient(135deg,${C.darkBlue},${C.blue})`,color:C.white,padding:'48px 16px 56px'}}>
        <div style={{maxWidth:760,margin:'0 auto',textAlign:'center'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,marginBottom:20}}>
            <span style={{background:'rgba(255,255,255,.2)',color:C.white,fontWeight:800,fontSize:16,padding:'3px 10px',borderRadius:7}}>free</span>
            <span style={{color:C.white,fontWeight:700,fontSize:16}}>calcs.io</span>
          </div>
          <h1 style={{fontSize:36,fontWeight:800,margin:'0 0 16px',color:C.white,lineHeight:1.2}}>Built to Give Everyone Access to World-Class Calculators</h1>
          <p style={{color:'#93c5fd',fontSize:16,margin:0,lineHeight:1.6}}>Free, accurate, beautiful tools for financial, health, and everyday decisions. No sign-up. No ads blocking results. Always free.</p>
        </div>
      </div>

      <div style={{maxWidth:760,margin:'0 auto',padding:'40px 16px'}}>

        {/* Mission */}
        <div style={{...card}}>
          <h2 style={{fontSize:20,fontWeight:700,color:'#111827',margin:'0 0 12px'}}>Our Mission</h2>
          <p style={{fontSize:15,color:'#374151',lineHeight:1.7,margin:'0 0 12px'}}>freecalcs.io was built because the best calculator sites on the internet are cluttered with ads, paywalls, and forced sign-ups. We believe that a mortgage calculator, tax estimator, or BMI tool should be immediately useful to everyone who needs it.</p>
          <p style={{fontSize:15,color:'#374151',lineHeight:1.7,margin:0}}>Every calculator on this site is free to use, requires no account, and never places an ad between you and your answer. We compete directly with Bankrate, OmniCalculator, and NerdWallet on quality while staying completely free.</p>
        </div>

        {/* What we built */}
        <div style={{...card}}>
          <h2 style={{fontSize:20,fontWeight:700,color:'#111827',margin:'0 0 16px'}}>Our Calculators</h2>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            {ALL_CALCS.map(([href,name])=>(
              <a key={href} href={href} style={{display:'flex',alignItems:'center',gap:8,padding:'10px 12px',borderRadius:10,border:`1px solid ${C.border}`,textDecoration:'none',background:'#f8fafc',transition:'all .15s'}}>
                <span style={{width:8,height:8,borderRadius:'50%',background:C.blue,flexShrink:0}}></span>
                <span style={{fontSize:13,fontWeight:600,color:'#1e40af'}}>{name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Accuracy commitment */}
        <div style={{...card}}>
          <h2 style={{fontSize:20,fontWeight:700,color:'#111827',margin:'0 0 12px'}}>Our Commitment to Accuracy</h2>
          <p style={{fontSize:15,color:'#374151',lineHeight:1.7,margin:'0 0 12px'}}>We research each calculator against the top sites in its category and build to match or exceed their feature set. Tax rates, bracket thresholds, contribution limits, and other financial figures are updated annually to reflect the current tax year.</p>
          <p style={{fontSize:15,color:'#374151',lineHeight:1.7,margin:0}}>If you find an error or have a suggestion, we take accuracy seriously. Please use the feedback mechanism to let us know.</p>
        </div>

        {/* -- LEGAL DISCLAIMER ------------------------------------------- */}
        <div style={{...card,background:'#fef9ec',borderColor:'#fcd34d'}}>
          <h2 style={{fontSize:20,fontWeight:700,color:'#92400e',margin:'0 0 16px'}}>Important Disclaimer</h2>

          <div style={{fontSize:14,color:'#78350f',lineHeight:1.75}}>
            <p style={{margin:'0 0 14px',fontWeight:600}}>freecalcs.io is NOT a licensed financial advisor, tax advisor, CPA, attorney, or medical professional.</p>

            <p style={{margin:'0 0 14px'}}>All calculators and tools on this website are provided for <strong>informational and educational purposes only</strong>. The results produced by our calculators are <strong>estimates</strong> based on the inputs you provide and general formulas. They do not constitute financial, tax, legal, or medical advice of any kind.</p>

            <p style={{margin:'0 0 14px'}}><strong>Financial calculators</strong> (mortgage, salary, income tax, compound interest, loan): Results are estimates only. Actual loan terms, tax liability, and investment returns will vary based on your specific circumstances, lender terms, IRS determinations, state tax rules, and market conditions. Tax rates and brackets are updated annually but may not reflect the most recent IRS guidance. Always consult a licensed CPA, tax professional, or financial advisor before making financial decisions.</p>

            <p style={{margin:'0 0 14px'}}><strong>Health calculators</strong> (BMI, TDEE/calories): Results are estimates based on general population formulas. They do not account for individual medical conditions, medications, or physiological differences. BMI is a screening tool, not a diagnostic measure. Calorie calculations are approximations. Always consult a licensed physician, registered dietitian, or healthcare provider before making changes to your diet, exercise, or health regimen.</p>

            <p style={{margin:'0 0 14px'}}><strong>No warranty:</strong> freecalcs.io makes no representations or warranties about the accuracy, completeness, or suitability of any information on this site for any purpose. We are not responsible for errors, omissions, or outcomes resulting from use of these tools.</p>

            <p style={{margin:0}}><strong>Not a substitute for professional advice:</strong> Under no circumstances should results from freecalcs.io calculators be used as a substitute for advice from a qualified professional who is familiar with your individual situation. Always seek qualified professional guidance before making financial, tax, legal, investment, or health decisions.</p>
          </div>
        </div>

        {/* Privacy */}
        <div style={{...card}}>
          <h2 style={{fontSize:20,fontWeight:700,color:'#111827',margin:'0 0 12px'}}>Privacy</h2>
          <p style={{fontSize:15,color:'#374151',lineHeight:1.7,margin:'0 0 12px'}}>freecalcs.io does not collect, store, or sell any personal data you enter into our calculators. All calculations happen entirely in your browser. We do not require you to create an account or provide any personal information.</p>
          <p style={{fontSize:15,color:'#374151',lineHeight:1.7,margin:0}}>We may use anonymized, aggregated analytics to understand which calculators are most used, but no individual user data is tracked or stored.</p>
        </div>

        {/* Contact */}
        <div style={{...card,textAlign:'center'}}>
          <h2 style={{fontSize:20,fontWeight:700,color:'#111827',margin:'0 0 10px'}}>Built and Maintained With Care</h2>
          <p style={{fontSize:15,color:'#374151',lineHeight:1.7,margin:'0 0 16px'}}>freecalcs.io is actively maintained and updated. We are committed to keeping all calculators current, accurate, and free.</p>
          <p style={{fontSize:13,color:'#9ca3af',margin:0}}>freecalcs.io &copy; 2026 &mdash; Free tools, always.</p>
        </div>
      </div>
    </div>
  );
}
