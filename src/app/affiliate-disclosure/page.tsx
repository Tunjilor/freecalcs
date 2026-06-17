import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure | freecalcs.io',
  description: 'How freecalcs.io makes money: affiliate relationships, what they mean for you, and our commitment to keeping recommendations honest.',
  alternates: { canonical: 'https://www.freecalcs.io/affiliate-disclosure' },
  openGraph: { title: 'Affiliate Disclosure | freecalcs.io', description: 'How freecalcs.io makes money: affiliate relationships, what they mean for you, and our commitment to keeping recommendations honest.', url: 'https://www.freecalcs.io/affiliate-disclosure', siteName: 'freecalcs.io', type: 'website' },
};

const C = { blue:'#2563eb', darkBlue:'#1e3a5f', border:'#e5e7eb', white:'#ffffff', light:'#f8fafc' };
const card: React.CSSProperties = { background:C.white, borderRadius:16, padding:28, boxShadow:'0 1px 3px rgba(0,0,0,.08)', border:`1px solid ${C.border}`, marginBottom:20 };

export default function AffiliateDisclosurePage(){
  return(
    <div style={{fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',background:C.light,minHeight:'100vh'}}>
      <div style={{background:`linear-gradient(135deg,${C.darkBlue},${C.blue})`,color:'#fff',padding:'40px 16px 48px'}}>
        <div style={{maxWidth:760,margin:'0 auto'}}>
          <a href="/" style={{color:'#93c5fd',fontSize:13,textDecoration:'none'}}>&lt;- freecalcs.io</a>
          <h1 style={{fontSize:32,fontWeight:800,margin:'12px 0 8px',color:'#fff'}}>Affiliate Disclosure</h1>
          <p style={{color:'#93c5fd',fontSize:14,margin:0}}>Last updated: June 2026</p>
        </div>
      </div>

      <div style={{maxWidth:760,margin:'0 auto',padding:'32px 16px'}}>
        <div style={{...card}}>
          <p style={{fontSize:14,color:'#374151',lineHeight:1.7,margin:0}}>freecalcs.io is free to use and always will be. To keep it that way, some of the links on this site are <strong>affiliate links</strong>. This page explains exactly what that means, in plain language, because you deserve to know how we make money.</p>
        </div>

        {[
          {
            title:'What an affiliate link is',
            body:`If you click certain links on our site — for example, a link to compare mortgage lenders, check your credit score, or open a financial account — and you then sign up or complete an action with that company, we may earn a commission. That commission comes from the company, not from you. You pay the same price (or get the same offer) whether you use our link or go to the company directly.`
          },
          {
            title:'What this means for you',
            body:`It costs you nothing. An affiliate link never raises your price or changes the terms you're offered.

It does not buy a recommendation. We include partner links only where the product is genuinely relevant to the page you're reading — a mortgage comparison link on a mortgage page, for instance. We are not paid to say nice things, and a commission never changes the math in our calculators or the facts in our guides.

You're always free to ignore them. Every affiliate link is optional. Our calculators and content work fully without you clicking a single partner link, and we never put a partner offer in the way of your results.`
          },
          {
            title:'Our commitment',
            body:`The numbers our calculators produce and the information in our articles are not influenced by any affiliate relationship. We label partner links honestly, we don't pretend a sponsored option is the only option, and we present alternatives where they exist. If we ever can't recommend something in good conscience, we won't link to it just for a commission.`
          },
          {
            title:'FTC disclosure',
            body:`In accordance with the U.S. Federal Trade Commission's guidelines (16 CFR Part 255) on endorsements and testimonials, freecalcs.io discloses that it has financial relationships with some of the companies and products mentioned on this site, and may be compensated when you click affiliate links or make purchases or sign-ups through them.`
          },
          {
            title:'Questions',
            body:`If you're ever unsure whether a link is an affiliate link, or you want to know more about a specific partnership, reach us at support@freecalcs.io.`
          },
        ].map(({title,body})=>(
          <div key={title} style={{...card}}>
            <h2 style={{fontSize:18,fontWeight:700,color:'#111827',margin:'0 0 12px'}}>{title}</h2>
            {body.split('\n\n').map((para,i,arr)=>(
              <p key={i} style={{fontSize:14,color:'#374151',lineHeight:1.7,margin:i<arr.length-1?'0 0 12px':'0'}}>{para}</p>
            ))}
          </div>
        ))}

        <p style={{fontSize:12,color:'#94a3b8',lineHeight:1.6,fontStyle:'italic',margin:'8px 0 28px'}}>
          freecalcs.io provides informational tools and content only and does not offer personalized financial, tax, legal, or medical advice. Always consult a qualified professional before making financial or health decisions.
        </p>

        <div style={{textAlign:'center',padding:'20px 0',color:'#9ca3af',fontSize:12}}>
          <p style={{margin:0}}>freecalcs.io &copy; 2026 - Free tools, always.</p>
        </div>
      </div>
    </div>
  );
}
