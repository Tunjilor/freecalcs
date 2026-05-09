import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'The 28/36 Rule: How Much House Can You Actually Afford | freecalcs.io',
  description: 'Banks use the 28/36 rule to decide your mortgage qualification. Learn how to apply it to your income and debt, and when it makes sense to bend the rules.',
  alternates: { canonical: 'https://www.freecalcs.io/blog/28-36-rule-mortgage' },
  openGraph: { title: 'The 28/36 Rule: How Much House Can You Actually Afford', description: 'Banks use the 28/36 rule to decide your mortgage qualification. Learn how to apply it to your income and debt, and when it makes sense to bend the rules.', url: 'https://www.freecalcs.io/blog/28-36-rule-mortgage', siteName: 'freecalcs.io', type: 'article' },
};
export default function Article() {
  return (
    <div style={{fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif',background:'linear-gradient(180deg,#f8fafc 0%,#eef2ff 50%,#f0fdf4 100%)',minHeight:'100vh'}}>
      <div style={{background:'linear-gradient(135deg,#0f172a 0%,#1e3a5f 40%,#2563eb 100%)',color:'#fff',padding:'40px 16px 48px'}}>
        <div style={{maxWidth:720,margin:'0 auto'}}>
          <a href="/blog" style={{color:'#93c5fd',fontSize:13,textDecoration:'none'}}>← Back to Blog</a>
          <div style={{display:'flex',alignItems:'center',gap:10,margin:'16px 0 12px'}}>
            <span style={{fontSize:11,fontWeight:700,color:'#2563eb',background:'#2563eb22',padding:'3px 10px',borderRadius:20,textTransform:'uppercase',letterSpacing:'.06em'}}>Mortgage</span>
            <span style={{fontSize:12,color:'#93c5fd'}}>5 min read</span>
            <span style={{fontSize:12,color:'#93c5fd'}}>Apr 18, 2026</span>
          </div>
          <h1 style={{fontSize:32,fontWeight:800,margin:'0 0 16px',lineHeight:1.3,color:'#fff'}}>The 28/36 Rule: How Much House Can You Actually Afford</h1>
          <p style={{color:'#93c5fd',fontSize:15,margin:0,lineHeight:1.6}}>Banks use the 28/36 rule to decide your mortgage qualification. Learn how to apply it to your income and debt, and when it makes sense to bend the rules.</p>
        </div>
      </div>
      <div style={{maxWidth:720,margin:'0 auto',padding:'40px 16px'}}>
        <div style={{background:'rgba(255,255,255,0.9)',backdropFilter:'blur(12px)',borderRadius:20,padding:'32px 28px',boxShadow:'0 4px 24px rgba(0,0,0,.06)',border:'1px solid rgba(226,232,240,0.8)',marginBottom:32}}>
          <div style={{marginBottom:32}}>
            <h2 style={{fontSize:20,fontWeight:700,color:'#111827',margin:'0 0 14px'}}>What Is the 28/36 Rule</h2>
            <p style={{fontSize:15,color:'#374151',lineHeight:1.8,margin:'0 0 16px'}}>The 28/36 rule is a lending guideline that says your housing costs should not exceed 28% of your gross monthly income, and your total debt payments should not exceed 36%.</p>
            <p style={{fontSize:15,color:'#374151',lineHeight:1.8,margin:'0 0 16px'}}>The 28% is called the front-end ratio or housing ratio. It includes your mortgage payment, property taxes, homeowners insurance, HOA fees, and PMI if applicable.</p>
            <p style={{fontSize:15,color:'#374151',lineHeight:1.8,margin:'0 0 16px'}}>The 36% is called the back-end ratio or debt-to-income (DTI) ratio. It includes everything in the front-end ratio plus car payments, student loans, credit card minimums, personal loans, and any other monthly debt obligations.</p>
          </div>
          <div style={{marginBottom:32}}>
            <h2 style={{fontSize:20,fontWeight:700,color:'#111827',margin:'0 0 14px'}}>How to Calculate Your Numbers</h2>
            <p style={{fontSize:15,color:'#374151',lineHeight:1.8,margin:'0 0 16px'}}>Step 1: Find your gross monthly income. If you earn $75,000 per year, your gross monthly income is $6,250.</p>
            <p style={{fontSize:15,color:'#374151',lineHeight:1.8,margin:'0 0 16px'}}>Step 2: Calculate your 28% limit. $6,250 x 0.28 = $1,750. This is the maximum you should spend on total housing costs per month.</p>
            <p style={{fontSize:15,color:'#374151',lineHeight:1.8,margin:'0 0 16px'}}>Step 3: Calculate your 36% limit. $6,250 x 0.36 = $2,250. This is the maximum for all monthly debt payments combined.</p>
            <p style={{fontSize:15,color:'#374151',lineHeight:1.8,margin:'0 0 16px'}}>Step 4: Subtract existing debts from the 36% limit. If you pay $400 for a car and $200 for student loans, that leaves $2,250 - $600 = $1,650 available for housing. In this case, the back-end ratio ($1,650) is more restrictive than the front-end ($1,750).</p>
          </div>
          <div style={{marginBottom:32}}>
            <h2 style={{fontSize:20,fontWeight:700,color:'#111827',margin:'0 0 14px'}}>What the 28/36 Rule Means for Home Prices</h2>
            <p style={{fontSize:15,color:'#374151',lineHeight:1.8,margin:'0 0 16px'}}>Using the example above with a $1,650 maximum housing payment at current rates: At 6.5% interest with 20% down on a 30-year mortgage, a $1,650 total payment (including taxes and insurance) supports roughly a $230,000 to $250,000 home price.</p>
            <p style={{fontSize:15,color:'#374151',lineHeight:1.8,margin:'0 0 16px'}}>On a $95,000 salary with no other debts, the front-end ratio allows up to $2,217 per month for housing, which supports a home price around $320,000 to $340,000.</p>
            <p style={{fontSize:15,color:'#374151',lineHeight:1.8,margin:'0 0 16px'}}>These are guidelines, not hard limits. Your actual qualification depends on your credit score, down payment, loan type, and the specific lender.</p>
          </div>
          <div style={{marginBottom:32}}>
            <h2 style={{fontSize:20,fontWeight:700,color:'#111827',margin:'0 0 14px'}}>When Lenders Bend the Rules</h2>
            <p style={{fontSize:15,color:'#374151',lineHeight:1.8,margin:'0 0 16px'}}>Many lenders approve borrowers beyond the 28/36 rule. FHA loans allow DTI ratios up to 43%, and sometimes even 50% with compensating factors like strong cash reserves or a history of successfully managing similar payment levels.</p>
            <p style={{fontSize:15,color:'#374151',lineHeight:1.8,margin:'0 0 16px'}}>Conventional loans backed by Fannie Mae can go up to 50% DTI with strong credit and reserves. VA loans have no strict DTI cap, though most lenders prefer 41% or below.</p>
            <p style={{fontSize:15,color:'#374151',lineHeight:1.8,margin:'0 0 16px'}}>Compensating factors that help you qualify beyond 28/36: credit score above 740, significant cash reserves (6+ months of payments), stable employment history of 2+ years, large down payment (20%+), and minimal non-housing debt.</p>
          </div>
          <div style={{marginBottom:32}}>
            <h2 style={{fontSize:20,fontWeight:700,color:'#111827',margin:'0 0 14px'}}>Should You Max Out Your Budget</h2>
            <p style={{fontSize:15,color:'#374151',lineHeight:1.8,margin:'0 0 16px'}}>Just because a lender approves you for a certain amount does not mean you should borrow that much. The 28/36 rule does not account for retirement savings, emergency funds, childcare, groceries, entertainment, or other life expenses.</p>
            <p style={{fontSize:15,color:'#374151',lineHeight:1.8,margin:'0 0 16px'}}>A more conservative approach: aim for 25% of take-home pay (not gross) for total housing costs. This leaves room for savings, investing, and unexpected expenses. On a $75,000 salary with roughly $5,100 monthly take-home pay, that means a housing budget of about $1,275.</p>
            <p style={{fontSize:15,color:'#374151',lineHeight:1.8,margin:'0 0 16px'}}>Remember: your mortgage is a 30-year commitment. Being slightly conservative gives you financial flexibility for decades.</p>
          </div>

        </div>
        <div style={{background:'linear-gradient(135deg,#eff6ff,#f0fdf4)',borderRadius:20,padding:'28px 24px',border:'1px solid #bfdbfe',marginBottom:32,textAlign:'center'}}>
          <p style={{fontSize:18,fontWeight:700,color:'#111827',margin:'0 0 8px'}}>Try It Yourself</p>
          <p style={{fontSize:14,color:'#64748b',margin:'0 0 16px'}}>Use our free Mortgage Qualifier to run your own numbers.</p>
          <a href="/qualify" style={{display:'inline-block',background:'#2563eb',color:'#fff',fontSize:15,fontWeight:700,padding:'12px 28px',borderRadius:12,textDecoration:'none'}}>Open Mortgage Qualifier →</a>
        </div>
        <div style={{marginBottom:32}}>
          <p style={{fontSize:18,fontWeight:700,color:'#111827',margin:'0 0 16px'}}>Frequently Asked Questions</p>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            <div style={{padding:'16px 20px',background:'#f8fafc',borderRadius:12,border:'1px solid #e2e8f0'}}>
              <p style={{fontSize:14,fontWeight:700,color:'#111827',margin:'0 0 8px'}}>What DTI ratio do most lenders require?</p>
              <p style={{fontSize:14,color:'#374151',lineHeight:1.7,margin:0}}>Most conventional lenders prefer 43% or lower total DTI. FHA allows up to 50% in some cases. VA has no strict limit. The lower your DTI, the better your rate and terms.</p>
            </div>
            <div style={{padding:'16px 20px',background:'#f8fafc',borderRadius:12,border:'1px solid #e2e8f0'}}>
              <p style={{fontSize:14,fontWeight:700,color:'#111827',margin:'0 0 8px'}}>Does the 28/36 rule use gross or net income?</p>
              <p style={{fontSize:14,color:'#374151',lineHeight:1.7,margin:0}}>The 28/36 rule uses gross income (before taxes). However, many financial advisors recommend using net income for a more realistic budget since gross income overstates what you actually have available.</p>
            </div>
            <div style={{padding:'16px 20px',background:'#f8fafc',borderRadius:12,border:'1px solid #e2e8f0'}}>
              <p style={{fontSize:14,fontWeight:700,color:'#111827',margin:'0 0 8px'}}>What if my DTI is too high?</p>
              <p style={{fontSize:14,color:'#374151',lineHeight:1.7,margin:0}}>Pay down existing debt (especially credit cards), increase your down payment to reduce the loan amount, extend the loan term, or consider a less expensive property. Even paying off a $300 monthly car payment can significantly increase your home buying power.</p>
            </div>

          </div>
        </div>
        <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
          <a href="/blog" style={{background:'#fff',color:'#2563eb',fontSize:13,fontWeight:600,padding:'10px 20px',borderRadius:10,border:'1px solid #bfdbfe',textDecoration:'none'}}>← All Articles</a>
          <a href="/qualify" style={{background:'#2563eb',color:'#fff',fontSize:13,fontWeight:600,padding:'10px 20px',borderRadius:10,textDecoration:'none'}}>Mortgage Qualifier</a>
        </div>
      </div>
    </div>
  );
}
