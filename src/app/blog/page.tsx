import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog | Financial Tips, Tax Guides & Calculator Tutorials | freecalcs.io',
  description: 'Expert guides on mortgages, taxes, BMI, investing, and everyday financial decisions. Free articles to help you understand and use our calculators.',
  alternates: { canonical: 'https://www.freecalcs.io/blog' },
  openGraph: { title: 'Blog | freecalcs.io', description: 'Financial tips, tax guides, health explainers, and calculator tutorials.', url: 'https://www.freecalcs.io/blog', siteName: 'freecalcs.io', type: 'website' },
};

const C = { blue:'#2563eb', darkBlue:'#1e3a5f', border:'#e5e7eb', white:'#ffffff', light:'#f8fafc' };
const card: React.CSSProperties = { background:C.white, borderRadius:16, boxShadow:'0 1px 3px rgba(0,0,0,.08)', border:`1px solid ${C.border}`, overflow:'hidden', display:'flex', flexDirection:'column' };

const POSTS = [
  {
    slug:'pay-off-low-rate-mortgage-early',
    title:'Should I Pay Off My 3% Mortgage Early?',
    excerpt:'A low-rate mortgage is often worth keeping, not rushing to kill. The real trade-off is a guaranteed ~3% and peace of mind vs a higher-but-uncertain return — with real numbers.',
    category:'Mortgage',
    categoryColor:'#2563eb',
    readTime:'8 min',
    date:'Jul 5, 2026',
    related:'/loan-payoff',
    relatedLabel:'Loan Payoff Calculator',
  },
  {
    slug:'roth-vs-traditional-95k-income',
    title:'I Make $95,000 a Year. Should I Choose Roth or Traditional?',
    excerpt:'At $95k you’re in the 22% bracket, so the choice comes down to one question: will your tax rate in retirement be higher or lower than today? Real 2026 numbers, plainly explained.',
    category:'Investing & Retirement',
    categoryColor:'#7c3aed',
    readTime:'8 min',
    date:'Jul 5, 2026',
    related:'/roth-vs-traditional',
    relatedLabel:'Roth vs Traditional',
  },
  {
    slug:'heloc-to-pay-off-credit-card-debt',
    title:'Should I Use a HELOC to Pay Off Credit Card Debt?',
    excerpt:'Trading 22% card debt for a 9% HELOC can save thousands — or leave you owing on both. The math, the risks, and how to tell which it will be for you.',
    category:'Loans & Debt',
    categoryColor:'#dc2626',
    readTime:'8 min',
    date:'Jul 5, 2026',
    related:'/credit-card-payoff',
    relatedLabel:'Credit Card Payoff',
  },
  {
    slug:'using-your-va-loan-twice',
    title:'Using My VA Loan Twice — and What Changed After My Disability Rating',
    excerpt:'A veteran’s first-hand account of buying twice with the VA loan - restoring entitlement after a sale, $0 down both times, and how a disability rating waived the funding fee and unlocked a Georgia property-tax exemption.',
    category:'Mortgage',
    categoryColor:'#2563eb',
    readTime:'9 min',
    date:'Jun 17, 2026',
    related:'/qualify',
    relatedLabel:'Mortgage Qualifier',
  },
  {
    slug:'fha-loan-requirements',
    title:'FHA Loan Requirements in 2026: Do You Qualify?',
    excerpt:'FHA loans are built for lower credit, smaller down payments, and bumpier histories. Here are the full 2026 requirements - credit, down payment, DTI, and mortgage insurance.',
    category:'Mortgage',
    categoryColor:'#2563eb',
    readTime:'7 min',
    date:'Jun 10, 2026',
    related:'/qualify',
    relatedLabel:'Mortgage Qualifier',
  },
  {
    slug:'va-loan-eligibility',
    title:'VA Loan Eligibility in 2026: Do You Qualify?',
    excerpt:'The VA loan offers zero down and no PMI - if you meet the service requirements. Here is how eligibility, the Certificate of Eligibility, and the funding fee actually work.',
    category:'Mortgage',
    categoryColor:'#2563eb',
    readTime:'7 min',
    date:'Jun 10, 2026',
    related:'/qualify',
    relatedLabel:'Mortgage Qualifier',
  },
  {
    slug:'mortgage-refinance-requirements',
    title:'Mortgage Refinance Requirements: Do You Qualify in 2026?',
    excerpt:'What you need to refinance in 2026 - credit, equity, and DTI - plus the FHA, VA, and USDA streamline shortcuts that can skip the appraisal entirely.',
    category:'Mortgage',
    categoryColor:'#2563eb',
    readTime:'8 min',
    date:'Jun 10, 2026',
    related:'/mortgage',
    relatedLabel:'Mortgage Calculator',
  },
  {
    slug:'fha-vs-conventional-which-is-cheaper',
    title:'FHA vs Conventional: Which Loan Is Actually Cheaper?',
    excerpt:'FHA or conventional - which costs less? It comes down to mortgage insurance and your credit score. Here is the side-by-side, plus when to switch from one to the other.',
    category:'Mortgage',
    categoryColor:'#2563eb',
    readTime:'7 min',
    date:'Jun 10, 2026',
    related:'/mortgage',
    relatedLabel:'Mortgage Calculator',
  },
  {
    slug:'usda-loan-eligibility',
    title:'USDA Loan Eligibility in 2026: Do You Qualify?',
    excerpt:'The USDA loan lets you buy with zero down in rural and many suburban areas. Here is how the income limits, eligible areas, credit, and borrower rules actually work.',
    category:'Mortgage',
    categoryColor:'#2563eb',
    readTime:'7 min',
    date:'Jun 10, 2026',
    related:'/qualify',
    relatedLabel:'Mortgage Qualifier',
  },
  {
    slug:'how-to-calculate-mortgage-payment',
    title:'How to Calculate Your Mortgage Payment (Step by Step)',
    excerpt:'Learn exactly how lenders calculate your monthly mortgage payment - principal, interest, PMI, taxes, and insurance - and how to use our calculator to find the best deal.',
    category:'Mortgage',
    categoryColor:'#2563eb',
    readTime:'6 min',
    date:'May 1, 2026',
    related:'/mortgage',
    relatedLabel:'Mortgage Calculator',
  },
  {
    slug:'what-is-tdee',
    title:'What is TDEE and How Many Calories Should You Eat?',
    excerpt:'TDEE (Total Daily Energy Expenditure) is the most important number for weight management. Here is what it means, how to calculate it, and how to use it for your goals.',
    category:'Health',
    categoryColor:'#10b981',
    readTime:'5 min',
    date:'Apr 28, 2026',
    related:'/tdee',
    relatedLabel:'TDEE Calculator',
  },
  {
    slug:'fha-vs-conventional-vs-va-vs-usda',
    title:'FHA vs Conventional vs VA vs USDA: Which Loan is Right for You?',
    excerpt:'A clear, no-jargon comparison of the four main mortgage loan types. Find out which one you qualify for and which saves you the most money over time.',
    category:'Mortgage',
    categoryColor:'#2563eb',
    readTime:'8 min',
    date:'Apr 22, 2026',
    related:'/qualify',
    relatedLabel:'Mortgage Qualifier',
  },
  {
    slug:'28-36-rule-mortgage',
    title:'The 28/36 Rule: How Much House Can You Actually Afford?',
    excerpt:'Banks use the 28/36 rule to decide how much mortgage you qualify for. Here is how to apply it to your income and debt - and when to ignore it.',
    category:'Mortgage',
    categoryColor:'#2563eb',
    readTime:'5 min',
    date:'Apr 18, 2026',
    related:'/qualify',
    relatedLabel:'Mortgage Qualifier',
  },
  {
    slug:'bmi-what-your-number-means',
    title:'BMI Calculator: What Your Number Really Means',
    excerpt:'BMI is misunderstood by most people. Here is what your BMI number actually tells you, what it misses, and how to use it alongside other health metrics.',
    category:'Health',
    categoryColor:'#10b981',
    readTime:'5 min',
    date:'Apr 15, 2026',
    related:'/bmi',
    relatedLabel:'BMI Calculator',
  },
  {
    slug:'pay-off-mortgage-early',
    title:'How to Pay Off Your Mortgage 10 Years Early',
    excerpt:'Making small extra payments on your mortgage can save you tens of thousands of dollars. Here is exactly how to calculate the impact and the best strategies to pay off early.',
    category:'Mortgage',
    categoryColor:'#2563eb',
    readTime:'7 min',
    date:'Apr 10, 2026',
    related:'/mortgage',
    relatedLabel:'Mortgage Calculator',
  },
  {
    slug:'compound-interest-explained',
    title:'Compound Interest Explained: Why Einstein Called It the 8th Wonder',
    excerpt:'Compound interest is the most powerful force in personal finance. Here is how it works, why starting early matters so much, and how to calculate your future wealth.',
    category:'Investing',
    categoryColor:'#7c3aed',
    readTime:'6 min',
    date:'Apr 5, 2026',
    related:'/compound-interest',
    relatedLabel:'Compound Interest Calculator',
  },
  {
    slug:'2026-tax-brackets-guide',
    title:'2026 Federal Tax Brackets: Complete Guide',
    excerpt:'The 2026 tax brackets under the extended TCJA explained clearly. Find your bracket, understand marginal vs effective rates, and learn 5 ways to lower your tax bill.',
    category:'Taxes',
    categoryColor:'#ef4444',
    readTime:'7 min',
    date:'Apr 1, 2026',
    related:'/tax',
    relatedLabel:'Income Tax Calculator',
  },
];

const CATEGORIES = ['All','Mortgage','Taxes','Investing','Health'];

export default function BlogPage(){
  return(
    <div style={{fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',background:C.light,minHeight:'100vh'}}>

      <div style={{background:`linear-gradient(135deg,${C.darkBlue},${C.blue})`,color:C.white,padding:'48px 16px 56px'}}>
        <div style={{maxWidth:960,margin:'0 auto'}}>
          <h1 style={{fontSize:36,fontWeight:800,margin:'0 0 12px',color:C.white}}>freecalcs.io Blog</h1>
          <p style={{color:'#93c5fd',fontSize:16,margin:'0 0 20px',maxWidth:560}}>Expert guides on mortgages, taxes, health, and investing. Written to help you understand our calculators and make better decisions.</p>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {CATEGORIES.map(cat=>(
              <span key={cat} style={{background:'rgba(255,255,255,.15)',fontSize:13,padding:'5px 14px',borderRadius:20,color:C.white,cursor:'pointer',fontWeight:500}}>{cat}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:960,margin:'0 auto',padding:'32px 16px'}}>

        {/* Featured post */}
        <div style={{...card,marginBottom:24,flexDirection:'row',flexWrap:'wrap'}}>
          <div style={{flex:1,minWidth:260,padding:'28px 32px'}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
              <span style={{fontSize:11,fontWeight:700,color:POSTS[0].categoryColor,background:POSTS[0].categoryColor+'18',padding:'3px 10px',borderRadius:20,textTransform:'uppercase',letterSpacing:'.06em'}}>{POSTS[0].category}</span>
              <span style={{fontSize:11,color:'#9ca3af'}}>{POSTS[0].readTime} read</span>
              <span style={{fontSize:11,color:'#9ca3af'}}>{POSTS[0].date}</span>
            </div>
            <h2 style={{fontSize:22,fontWeight:800,color:'#111827',margin:'0 0 12px',lineHeight:1.3}}>{POSTS[0].title}</h2>
            <p style={{fontSize:14,color:'#374151',lineHeight:1.7,margin:'0 0 20px'}}>{POSTS[0].excerpt}</p>
            <div style={{display:'flex',gap:12,alignItems:'center',flexWrap:'wrap'}}>
              <a href={`/blog/${POSTS[0].slug}`} style={{background:C.blue,color:C.white,fontSize:13,fontWeight:700,padding:'10px 20px',borderRadius:10,textDecoration:'none',display:'inline-block'}}>Read Article</a>
              <a href={POSTS[0].related} style={{color:C.blue,fontSize:13,fontWeight:600,textDecoration:'none'}}>Try the {POSTS[0].relatedLabel} -&gt;</a>
            </div>
          </div>
          <div style={{width:220,background:'linear-gradient(135deg,#1e3a5f,#2563eb)',display:'flex',alignItems:'center',justifyContent:'center',minHeight:160}}>
            <span style={{fontSize:60}}>$</span>
          </div>
        </div>

        {/* Post grid */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:20,marginBottom:32}} className="blog-grid">
          <style>{`@media(max-width:600px){.blog-grid{grid-template-columns:1fr!important;}}`}</style>
          {POSTS.slice(1).map(post=>(
            <div key={post.slug} style={{...card}}>
              <div style={{height:6,background:`linear-gradient(90deg,${post.categoryColor},${post.categoryColor}88)`}}></div>
              <div style={{padding:'20px 20px 16px',flex:1,display:'flex',flexDirection:'column'}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
                  <span style={{fontSize:10,fontWeight:700,color:post.categoryColor,background:post.categoryColor+'18',padding:'2px 8px',borderRadius:20,textTransform:'uppercase',letterSpacing:'.06em'}}>{post.category}</span>
                  <span style={{fontSize:11,color:'#9ca3af'}}>{post.readTime}</span>
                </div>
                <h3 style={{fontSize:15,fontWeight:700,color:'#111827',margin:'0 0 10px',lineHeight:1.4,flex:1}}>{post.title}</h3>
                <p style={{fontSize:13,color:'#374151',lineHeight:1.6,margin:'0 0 16px'}}>{post.excerpt.slice(0,120)}...</p>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <a href={`/blog/${post.slug}`} style={{color:C.blue,fontSize:13,fontWeight:700,textDecoration:'none'}}>Read -&gt;</a>
                  <span style={{fontSize:11,color:'#9ca3af'}}>{post.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div style={{background:`linear-gradient(135deg,${C.darkBlue},${C.blue})`,borderRadius:20,padding:'32px 24px',textAlign:'center',color:C.white,marginBottom:32}}>
          <h2 style={{fontSize:22,fontWeight:700,margin:'0 0 10px'}}>More guides coming soon</h2>
          <p style={{color:'#93c5fd',fontSize:14,margin:'0 0 20px',maxWidth:480,marginLeft:'auto',marginRight:'auto',lineHeight:1.6}}>We publish new financial guides and calculator tutorials regularly. Bookmark this page or check back for new content on mortgages, taxes, investing, and health.</p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            {[['Mortgage Calculator','/mortgage'],['Tax Calculator','/tax'],['TDEE Calculator','/tdee'],['BMI Calculator','/bmi']].map(([name,href])=>(
              <a key={href} href={href} style={{background:'rgba(255,255,255,.15)',color:C.white,fontSize:13,fontWeight:600,padding:'9px 18px',borderRadius:10,textDecoration:'none'}}>{name}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
