import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | freecalcs.io',
  description: 'Get in touch with freecalcs.io — questions, corrections, feedback, partnership and advertising inquiries.',
  alternates: { canonical: 'https://www.freecalcs.io/contact' },
  openGraph: { title: 'Contact | freecalcs.io', description: 'Get in touch with freecalcs.io — questions, corrections, feedback, partnership and advertising inquiries.', url: 'https://www.freecalcs.io/contact', siteName: 'freecalcs.io', type: 'website' },
};

const C = { blue:'#2563eb', darkBlue:'#1e3a5f', border:'#e5e7eb', white:'#ffffff', light:'#f8fafc' };
const card: React.CSSProperties = { background:C.white, borderRadius:16, padding:28, boxShadow:'0 1px 3px rgba(0,0,0,.08)', border:`1px solid ${C.border}`, marginBottom:20 };

export default function ContactPage(){
  return(
    <div style={{fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',background:C.light,minHeight:'100vh'}}>
      <div style={{background:`linear-gradient(135deg,${C.darkBlue},${C.blue})`,color:'#fff',padding:'40px 16px 48px'}}>
        <div style={{maxWidth:760,margin:'0 auto'}}>
          <a href="/" style={{color:'#93c5fd',fontSize:13,textDecoration:'none'}}>&lt;- freecalcs.io</a>
          <h1 style={{fontSize:32,fontWeight:800,margin:'12px 0 8px',color:'#fff'}}>Contact freecalcs.io</h1>
          <p style={{color:'#93c5fd',fontSize:14,margin:0}}>support@freecalcs.io</p>
        </div>
      </div>

      <div style={{maxWidth:760,margin:'0 auto',padding:'32px 16px'}}>
        <div style={{...card}}>
          <p style={{fontSize:14,color:'#374151',lineHeight:1.7,margin:'0 0 12px'}}>We&apos;d genuinely like to hear from you. Whether you&apos;ve spotted an error in a calculator, have a suggestion for a new tool, or want to talk about a partnership, use the email below and we&apos;ll get back to you.</p>
          <p style={{fontSize:15,color:'#111827',lineHeight:1.7,margin:0}}><strong>Email:</strong> <a href="mailto:support@freecalcs.io" style={{color:C.blue,fontWeight:600,textDecoration:'none'}}>support@freecalcs.io</a></p>
        </div>

        {[
          {
            title:'What to reach out about',
            body:`Corrections and accuracy. Our calculators and guides cover finance and health topics, and we take accuracy seriously. If a number looks off or a guide is out of date, tell us what you found and where — we'll review it and fix it.

Feature requests. Want a calculator we don't have yet, or an option added to an existing one? Send the details.

Partnerships and advertising. For sponsorship, advertising, or embeddable-calculator inquiries, email us with your company, your audience, and what you have in mind.

Press and general questions. Anything else — just write.`
          },
          {
            title:'Response time',
            body:`We're a small operation, so please allow a few business days for a reply. For accuracy corrections, a screenshot or the page URL helps us resolve things faster.`
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
          freecalcs.io provides free informational tools and content. We do not provide personalized financial, tax, legal, or medical advice, and we can&apos;t answer individual questions about your specific situation — for that, please consult a qualified professional.
        </p>

        <div style={{textAlign:'center',padding:'20px 0',color:'#9ca3af',fontSize:12}}>
          <p style={{margin:0}}>freecalcs.io &copy; 2026 - Free tools, always.</p>
        </div>
      </div>
    </div>
  );
}
