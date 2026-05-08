import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | freecalcs.io',
  description: 'Privacy policy for freecalcs.io. We do not collect, store, or sell personal data. All calculations happen in your browser.',
  alternates: { canonical: 'https://www.freecalcs.io/privacy' },
};

const C = { blue:'#2563eb', darkBlue:'#1e3a5f', border:'#e5e7eb', white:'#ffffff', light:'#f8fafc' };
const card: React.CSSProperties = { background:C.white, borderRadius:16, padding:28, boxShadow:'0 1px 3px rgba(0,0,0,.08)', border:`1px solid ${C.border}`, marginBottom:20 };

export default function PrivacyPage(){
  return(
    <div style={{fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',background:C.light,minHeight:'100vh'}}>
      <div style={{background:`linear-gradient(135deg,${C.darkBlue},${C.blue})`,color:'#fff',padding:'40px 16px 48px'}}>
        <div style={{maxWidth:760,margin:'0 auto'}}>
          <a href="/" style={{color:'#93c5fd',fontSize:13,textDecoration:'none'}}>&lt;- freecalcs.io</a>
          <h1 style={{fontSize:32,fontWeight:800,margin:'12px 0 8px',color:'#fff'}}>Privacy Policy</h1>
          <p style={{color:'#93c5fd',fontSize:14,margin:0}}>Last updated: May 2026</p>
        </div>
      </div>

      <div style={{maxWidth:760,margin:'0 auto',padding:'32px 16px'}}>
        {[
          {
            title:'Overview',
            body:`freecalcs.io is committed to protecting your privacy. This policy explains how we handle information when you use our calculators and tools. The short version: we collect almost nothing, and we never sell your data.`
          },
          {
            title:'Information We Do Not Collect',
            body:`We do not collect, store, or transmit any of the numbers or personal information you enter into our calculators. All calculations are performed locally in your browser. Your salary, age, BMI, tax information, and all other inputs never leave your device and are never sent to our servers.

We do not require you to create an account, log in, or provide any personal information to use any feature on freecalcs.io.`
          },
          {
            title:'Analytics',
            body:`We may use privacy-focused, anonymized analytics to understand which calculators are most popular and how users navigate the site. This data is aggregated and contains no personally identifiable information. We do not use cookies for tracking or advertising purposes.`
          },
          {
            title:'Advertising',
            body:`freecalcs.io may display advertisements in the future through services such as Google AdSense. If we do, those services may use cookies or similar technologies to serve relevant ads. You can opt out of personalized advertising through your browser settings or the Google Ads Settings page.

We will update this policy before enabling any advertising.`
          },
          {
            title:'Third-Party Links',
            body:`Our calculators and blog posts may contain links to third-party websites such as lenders, financial institutions, or educational resources. We are not responsible for the privacy practices of those sites. We encourage you to review their privacy policies before providing any personal information.`
          },
          {
            title:'Children',
            body:`freecalcs.io is not directed at children under 13. We do not knowingly collect any information from children. If you believe a child has provided personal information through our site, please contact us so we can delete it.`
          },
          {
            title:'Changes to This Policy',
            body:`We may update this privacy policy from time to time. We will post the updated policy on this page with a revised date. Continued use of freecalcs.io after changes constitutes your acceptance of the updated policy.`
          },
          {
            title:'Contact',
            body:`If you have questions about this privacy policy or our data practices, you can reach us through the contact information on our About page. We take privacy seriously and will respond to all inquiries.`
          },
        ].map(({title,body})=>(
          <div key={title} style={{...card}}>
            <h2 style={{fontSize:18,fontWeight:700,color:'#111827',margin:'0 0 12px'}}>{title}</h2>
            {body.split('\n\n').map((para,i)=>(
              <p key={i} style={{fontSize:14,color:'#374151',lineHeight:1.7,margin:i<body.split('\n\n').length-1?'0 0 12px':'0'}}>{para}</p>
            ))}
          </div>
        ))}

        <div style={{textAlign:'center',padding:'20px 0',color:'#9ca3af',fontSize:12}}>
          <p style={{margin:0}}>freecalcs.io &copy; 2026 - Free tools, always.</p>
        </div>
      </div>
    </div>
  );
}
