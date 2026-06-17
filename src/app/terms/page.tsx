import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | freecalcs.io',
  description: 'The terms governing use of freecalcs.io — informational use only, no warranties, no professional advice, and limitation of liability.',
  alternates: { canonical: 'https://www.freecalcs.io/terms' },
  openGraph: { title: 'Terms of Service | freecalcs.io', description: 'The terms governing use of freecalcs.io — informational use only, no warranties, no professional advice, and limitation of liability.', url: 'https://www.freecalcs.io/terms', siteName: 'freecalcs.io', type: 'website' },
};

const C = { blue:'#2563eb', darkBlue:'#1e3a5f', border:'#e5e7eb', white:'#ffffff', light:'#f8fafc' };
const card: React.CSSProperties = { background:C.white, borderRadius:16, padding:28, boxShadow:'0 1px 3px rgba(0,0,0,.08)', border:`1px solid ${C.border}`, marginBottom:20 };

export default function TermsPage(){
  return(
    <div style={{fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',background:C.light,minHeight:'100vh'}}>
      <div style={{background:`linear-gradient(135deg,${C.darkBlue},${C.blue})`,color:'#fff',padding:'40px 16px 48px'}}>
        <div style={{maxWidth:760,margin:'0 auto'}}>
          <a href="/" style={{color:'#93c5fd',fontSize:13,textDecoration:'none'}}>&lt;- freecalcs.io</a>
          <h1 style={{fontSize:32,fontWeight:800,margin:'12px 0 8px',color:'#fff'}}>Terms of Service</h1>
          <p style={{color:'#93c5fd',fontSize:14,margin:0}}>Last updated: June 2026</p>
        </div>
      </div>

      <div style={{maxWidth:760,margin:'0 auto',padding:'32px 16px'}}>
        <div style={{...card}}>
          <p style={{fontSize:14,color:'#374151',lineHeight:1.7,margin:0}}>Welcome to freecalcs.io (&ldquo;freecalcs.io,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By accessing or using this website (the &ldquo;Site&rdquo;), you agree to these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree, please do not use the Site.</p>
        </div>

        {[
          {
            title:'1. Informational purpose only',
            body:`The Site provides free calculators, tools, and educational content covering financial, health, and everyday topics. All content and calculator outputs are for general informational and educational purposes only. They are not, and must not be relied upon as, professional financial, tax, legal, medical, or other advice. Your results depend on the information you enter and on general assumptions that may not fit your specific situation.`
          },
          {
            title:'2. No professional relationship',
            body:`Using the Site does not create any advisor-client, fiduciary, or professional relationship between you and freecalcs.io. Before making any financial, tax, legal, or health decision, consult a qualified, licensed professional who can review your individual circumstances.`
          },
          {
            title:'3. Accuracy and "as is" availability',
            body:`We work to keep our calculators and content accurate and current, but we make no warranties or guarantees of any kind, express or implied, about the accuracy, completeness, reliability, or timeliness of anything on the Site. Tax rules, loan programs, rates, medical guidelines, and other figures change frequently and may be out of date. The Site is provided "as is" and "as available," without warranty of any kind, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement.`
          },
          {
            title:'4. Limitation of liability',
            body:`To the fullest extent permitted by law, freecalcs.io and its operators will not be liable for any direct, indirect, incidental, consequential, special, or punitive damages arising out of or related to your use of, or inability to use, the Site or its content — including any decision made or action taken in reliance on a calculator result or article. You use the Site and its tools entirely at your own risk.`
          },
          {
            title:'5. Affiliate relationships',
            body:`Some links on the Site are affiliate links, and we may earn a commission when you act on them, at no additional cost to you. This does not influence our calculator outputs or editorial content. See our Affiliate Disclosure for details.`,
            link:{href:'/affiliate-disclosure',label:'Affiliate Disclosure'}
          },
          {
            title:'6. Third-party links and services',
            body:`The Site contains links to third-party websites and services that we do not control. We are not responsible for the content, products, privacy practices, or accuracy of any third-party site. Accessing third-party links is at your own risk, and any transaction you enter into with a third party is solely between you and that party.`
          },
          {
            title:'7. Intellectual property',
            body:`The Site's original content, design, calculators, text, and branding are the property of freecalcs.io and are protected by applicable intellectual-property laws. You may use the Site for personal, non-commercial purposes. You may not copy, reproduce, scrape, republish, or redistribute substantial portions of the Site, or use our calculators or content to build a competing service, without our prior written permission.`
          },
          {
            title:'8. Acceptable use',
            body:`You agree not to use the Site to violate any law, infringe any right, introduce malicious code, attempt to gain unauthorized access to our systems, or place an unreasonable load on our infrastructure (including automated scraping or excessive automated requests).`
          },
          {
            title:'9. Changes to the Site and Terms',
            body:`We may modify, suspend, or discontinue any part of the Site at any time without notice. We may also update these Terms from time to time; the "Last updated" date above reflects the latest version. Your continued use of the Site after changes take effect constitutes acceptance of the revised Terms.`
          },
          {
            title:'10. Governing law',
            body:`These Terms are governed by the laws of the State of Connecticut, United States, without regard to its conflict-of-laws principles.`
          },
          {
            title:'11. Contact',
            body:`Questions about these Terms? Reach us at support@freecalcs.io or via our Contact page.`,
            link:{href:'/contact',label:'Contact page'}
          },
        ].map(({title,body,link})=>(
          <div key={title} style={{...card}}>
            <h2 style={{fontSize:18,fontWeight:700,color:'#111827',margin:'0 0 12px'}}>{title}</h2>
            {body.split('\n\n').map((para,i,arr)=>(
              <p key={i} style={{fontSize:14,color:'#374151',lineHeight:1.7,margin:i<arr.length-1?'0 0 12px':'0'}}>{para}</p>
            ))}
            {link && (
              <p style={{fontSize:14,lineHeight:1.7,margin:'10px 0 0'}}>
                <a href={link.href} style={{color:C.blue,fontWeight:600,textDecoration:'none'}}>{link.label} →</a>
              </p>
            )}
          </div>
        ))}

        <p style={{fontSize:12,color:'#94a3b8',lineHeight:1.6,fontStyle:'italic',margin:'8px 0 28px'}}>
          These Terms are a general template provided for a small informational website and are not legal advice. Because this Site covers financial and health topics, consider having an attorney review this document and your Privacy Policy for your specific jurisdiction and risk profile.
        </p>

        <div style={{textAlign:'center',padding:'20px 0',color:'#9ca3af',fontSize:12}}>
          <p style={{margin:0}}>freecalcs.io &copy; 2026 - Free tools, always.</p>
        </div>
      </div>
    </div>
  );
}
