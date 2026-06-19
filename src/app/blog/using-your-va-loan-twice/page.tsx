import type { Metadata } from 'next';
import Link from 'next/link';
import Author, { AUTHORS } from '@/components/Author';
import ArticleJsonLd from '@/components/ArticleJsonLd';

const URL = 'https://www.freecalcs.io/blog/using-your-va-loan-twice';
const PUBLISHED = '2026-06-17';
const MODIFIED = '2026-06-17';

const TITLE = 'Using My VA Loan Twice — and What Changed After My Disability Rating';
const DESCRIPTION = 'Buying twice with the VA benefit: entitlement, $0 down, no monthly mortgage insurance, the funding fee waiver, and the Georgia disabled-veteran property tax exemption.';

export const metadata: Metadata = {
  title: `${TITLE} | freecalcs.io`,
  description: DESCRIPTION,
  keywords: ['VA loan second time', 'reuse VA loan', 'VA entitlement restoration', 'VA funding fee disabled veteran', 'Georgia disabled veteran property tax', 'VA loan no down payment'],
  authors: [{ name: 'Jamie' }],
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: 'freecalcs.io',
    type: 'article',
  },
  twitter: { card: 'summary_large_image' },
};

const faqs = [
  {
    q: 'Can you use a VA loan more than once?',
    a: 'Yes. There is no limit over your lifetime and no first-time-buyer requirement. Selling a VA-financed home and paying off the loan restores your full entitlement, letting you buy again with zero down.',
  },
  {
    q: 'Do disabled veterans pay the VA funding fee?',
    a: 'No. Veterans receiving compensation for a service-connected disability are generally exempt from the VA funding fee entirely. On a typical purchase that is thousands of dollars saved.',
  },
  {
    q: 'What is the Georgia property tax exemption for disabled veterans?',
    a: 'For 2026, Georgia exempts $126,526 of assessed value (updated annually) from all ad valorem property taxes on the primary residence of a qualifying disabled veteran. You apply once through your county tax office with your VA documentation.',
  },
  {
    q: 'Do you need a down payment for a second VA loan?',
    a: 'No. With restored full entitlement, a second VA purchase can be made with $0 down and no monthly mortgage insurance, exactly like the first.',
  },
  {
    q: 'Does selling my first home restore my VA entitlement?',
    a: 'Yes — selling the property and paying off the VA loan generally restores full entitlement, so you can reuse the benefit with no loan cap on the next purchase.',
  },
];

// FAQ structured data is generated from the visible faqs array so the JSON-LD
// always matches what users see on the page, per Google's requirements.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

const h2Style: React.CSSProperties = { fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 14px', lineHeight: 1.3 };
const h3Style: React.CSSProperties = { fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '24px 0 12px', lineHeight: 1.35 };
const pStyle: React.CSSProperties = { fontSize: 15, color: '#374151', lineHeight: 1.8, margin: '0 0 16px' };
const linkStyle: React.CSSProperties = { color: '#2563eb', fontWeight: 600, textDecoration: 'none' };

export default function Article() {
  return (
    <div style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif', background: 'linear-gradient(180deg,#f8fafc 0%,#eef2ff 50%,#f0fdf4 100%)', minHeight: '100vh' }}>
      <ArticleJsonLd
        headline={TITLE}
        description={DESCRIPTION}
        url={URL}
        author={AUTHORS.jamie}
        datePublished={PUBLISHED}
        dateModified={MODIFIED}
        section="Mortgage"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e3a5f 40%,#2563eb 100%)', color: '#fff', padding: '40px 16px 48px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <a href="/blog" style={{ color: '#93c5fd', fontSize: 13, textDecoration: 'none' }}>← Back to Blog</a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0 12px' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', background: '#2563eb22', padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '.06em' }}>Mortgage</span>
            <span style={{ fontSize: 12, color: '#93c5fd' }}>9 min read</span>
            <span style={{ fontSize: 12, color: '#93c5fd' }}>Updated Jun 2026</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 16px', lineHeight: 1.3, color: '#fff' }}>{TITLE}</h1>
          <p style={{ color: '#93c5fd', fontSize: 15, margin: 0, lineHeight: 1.6 }}>{DESCRIPTION}</p>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '40px 16px 40px' }}>
        {/* Author byline + bio */}
        <Author author={AUTHORS.jamie} />

        {/* Intro */}
        <p style={{ fontSize: 17, color: '#334155', lineHeight: 1.75, margin: '0 0 20px' }}>
          Most VA loan guides sound like they were written by someone who has never pulled a Certificate of Eligibility in
          their life.
        </p>
        <p style={pStyle}>
          I am not writing this as a loan officer. I am writing it as a veteran who actually used the benefit twice, in two
          different states, under two very different circumstances. The first time, I was a younger enlisted guy trying to
          buy a home without a big pile of cash saved up. The second time, I was a service-connected disabled veteran, and
          the process looked different in ways I did not fully understand until I was already in it.
        </p>
        <p style={pStyle}>That is the part I want other veterans to know.</p>
        <p style={pStyle}>
          The VA loan did not just help me buy one house. It helped me buy twice. And the second time, my disability rating
          changed the cost of the loan in a real way.
        </p>
        <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7, fontStyle: 'italic', margin: '0 0 36px' }}>
          This article is based on my personal experience. VA rules, lender guidelines, tax rules, and county procedures
          can change, so always confirm your own situation with your lender, VA, and your local tax office.
        </p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2Style}>You can absolutely use the VA loan more than once</h2>
          <p style={pStyle}>This is one of the biggest misunderstandings about the VA loan.</p>
          <p style={pStyle}>
            A lot of people think the VA loan is a one-time benefit, almost like a coupon you use once and never get back.
            That is not how it works.
          </p>
          <p style={pStyle}>
            There is no first-time-buyer requirement, and there is no lifetime limit on the number of times you can use your
            VA home loan benefit. The key is something called entitlement.
          </p>
          <p style={pStyle}>
            Entitlement is the amount the VA guarantees on your behalf. When you use a VA loan, part of your entitlement
            gets tied to that loan. If you later sell the house and pay off the VA loan, you can request restoration of that
            entitlement and use the benefit again.
          </p>
          <p style={pStyle}>That is what happened with me.</p>
          <p style={pStyle}>
            When I bought my first home in Tampa Bay around 2014, I used my VA loan benefit. When I sold that home in 2017
            and the VA loan was paid off, I was able to use the benefit again later for my home in Georgia.
          </p>
          <p style={pStyle}>That part matters.</p>
          <p style={pStyle}>
            If you sell the first home and the VA loan is paid in full, the path is usually straightforward: you can request
            entitlement restoration and buy again using your VA benefit. If you keep the first home and try to buy another
            property with a VA loan, it can still be possible, but now you are working with remaining entitlement, and the
            numbers get more complicated.
          </p>
          <p style={pStyle}>
            The simple version is this: the VA loan is reusable. The benefit does not disappear after one house.
          </p>
          <p style={pStyle}>
            If you are thinking about a second VA purchase, check your Certificate of Eligibility early and ask the lender to
            look at your remaining or restored entitlement before you get too deep into house shopping.
          </p>
          <p style={pStyle}>
            If you want to see whether you might qualify for another purchase, our{' '}
            <Link href="/qualify" style={linkStyle}>mortgage qualifier</Link> can help you estimate your debt-to-income
            ratio and monthly payment before you talk to a lender.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2Style}>I bought with $0 down — both times</h2>
          <p style={pStyle}>
            Both times I used the VA loan, I put the minimum down. For a VA loan, the minimum down payment can be zero.
          </p>
          <p style={pStyle}>That was the difference between buying and waiting.</p>
          <p style={pStyle}>
            On my first home, I did not have a huge down payment saved. I had income, I had military service, and I had
            earned the benefit, but I was not sitting on 20% down. The VA loan allowed me to buy without waiting years to
            save a conventional down payment. The same thing was true the second time.
          </p>
          <p style={pStyle}>
            I financed 100% of the purchase price and did not have to pay monthly mortgage insurance.
          </p>
          <p style={pStyle}>
            That second part is easy to overlook, but it is one of the biggest advantages of a VA loan. With FHA or a
            low-down-payment conventional loan, many borrowers pay mortgage insurance every month. That can easily add $100,
            $200, or $300 to a monthly payment, depending on the loan size and program. With a VA loan, there is no monthly
            mortgage insurance, even when you put nothing down.
          </p>
          <p style={pStyle}>
            That is real money. It is not just a small closing-table difference. It affects your monthly budget for as long
            as you would have been paying mortgage insurance under another loan program.
          </p>
          <p style={pStyle}>
            If you want to see the difference for yourself, compare a VA loan with no monthly mortgage insurance against an
            FHA or conventional loan in our <Link href="/mortgage" style={linkStyle}>mortgage calculator</Link>. The monthly
            payment gap can be bigger than people expect.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2Style}>What changed after my disability rating</h2>
          <p style={pStyle}>This is where my two purchases were very different.</p>
          <p style={pStyle}>
            The first time I used the VA loan, I was not receiving VA disability compensation. The second time, I was. That
            changed the cost of the loan.
          </p>

          <h3 style={h3Style}>The VA funding fee was waived</h3>
          <p style={pStyle}>
            The VA loan does not charge monthly mortgage insurance, but many borrowers do pay a one-time VA funding fee. That
            fee helps support the VA loan program.
          </p>
          <p style={pStyle}>
            For a first-use VA purchase with less than 5% down, the funding fee is commonly 2.15% of the loan amount. For
            later uses with less than 5% down, the fee can be higher. Many borrowers roll that fee into the loan instead of
            paying it out of pocket at closing. That is what happened on my first home. The funding fee applied, and I
            rolled it into the loan.
          </p>
          <p style={pStyle}>
            But veterans who receive VA compensation for a service-connected disability are generally exempt from the VA
            funding fee.
          </p>
          <p style={pStyle}>
            By the time I bought my home in Georgia, I was receiving service-connected disability compensation. That meant
            the funding fee was waived. That was not a small thing. On a typical mortgage, a funding fee can mean thousands
            of dollars added to the loan. When it is waived, that is money you do not have to bring to closing and do not
            have to finance over 30 years.
          </p>
          <p style={pStyle}>
            Same VA benefit. Same basic loan program. Very different cost because of my disability status.
          </p>
          <p style={pStyle}>
            If you are a disabled veteran, make sure your lender knows that early. Do not assume it will automatically be
            handled correctly. Ask the lender to confirm whether your Certificate of Eligibility shows funding fee exemption
            status. If your disability claim is pending, ask questions before closing — in some cases veterans may be able
            to seek a refund later if they were charged a fee they were exempt from, but it is much better to get it right
            before closing.
          </p>

          <h3 style={h3Style}>Georgia gave me a property tax break I almost missed</h3>
          <p style={pStyle}>
            The VA funding fee waiver helped at closing. The Georgia disabled-veteran property tax exemption helped after I
            bought the home. This is the benefit I almost missed.
          </p>
          <p style={pStyle}>
            Georgia offers a disabled-veteran homestead exemption for qualifying veterans. In general, this includes
            veterans who are rated 100% disabled by VA, veterans paid at the 100% rate because of individual
            unemployability, and certain veterans with specific severe service-connected disabilities. The exemption applies
            to the home you own and use as your primary residence.
          </p>
          <p style={pStyle}>
            For tax year 2026, Georgia&apos;s disabled-veteran homestead exemption amount is $126,526 off the assessed value
            of the home, and it is updated annually by the VA. The value above that exemption can still be taxable.
          </p>
          <p style={pStyle}>
            That last part matters. This does not always mean every disabled veteran pays zero property tax. It depends on
            the assessed value of the home, local millage rates, and how the county applies the exemption. But because
            Georgia generally assesses homes at 40% of fair market value, this exemption can wipe out a large part of the
            taxable value for many homeowners. In some cases, it may remove most or all of the ad valorem property tax on
            the home.
          </p>
          <p style={pStyle}>
            But it is not automatic. You have to apply through your county tax office or county assessor. You will usually
            need your VA disability documentation and proof that the home is your primary residence. County procedures and
            deadlines can vary, so ask early.
          </p>
          <p style={pStyle}>
            I qualified, and I almost left the benefit on the table because nobody sat me down and explained it. If you are a
            disabled veteran buying in Georgia, do not wait until the tax bill shows up. Ask your county tax office about the
            disabled-veteran homestead exemption as soon as you buy the home.
          </p>

          <h3 style={h3Style}>There may also be a Georgia vehicle tax exemption</h3>
          <p style={pStyle}>
            Georgia also has a separate motor vehicle ad valorem tax exemption for certain qualifying disabled veterans.
            This is separate from the home exemption. It generally applies to one vehicle owned by the qualifying veteran,
            and the details can depend on your disability status, documentation, plate type, and county tag office
            procedures.
          </p>
          <p style={pStyle}>
            The important point is simple: if you qualify for Georgia&apos;s disabled-veteran property tax exemption, it is
            worth asking your county tag office whether you also qualify for vehicle ad valorem tax relief. Do not assume
            anyone will tell you automatically.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2Style}>What I would tell another veteran before using the VA loan</h2>
          <p style={pStyle}>There are a few things I wish every veteran knew before buying with a VA loan.</p>
          <p style={pStyle}>
            <strong>Get your Certificate of Eligibility early.</strong> Your COE proves to the lender that you are eligible
            for the benefit. Most VA lenders can pull it electronically, and in many cases it comes back quickly. If the
            lender needs documentation, it is usually something like your DD-214. If you have used the VA loan before, the
            COE also helps the lender understand your entitlement situation.
          </p>
          <p style={pStyle}>
            <strong>Understand entitlement before your second purchase.</strong> If you sold your first VA-financed home and
            paid off the loan, you may be able to restore your entitlement and use the benefit again. If you still own the
            first home, the lender needs to calculate remaining entitlement, which can affect whether you can buy again with
            $0 down. Ask the lender early: &ldquo;Do I have full entitlement, restored entitlement, or remaining
            entitlement?&rdquo; That one question can save you a lot of confusion.
          </p>
          <p style={pStyle}>
            <strong>Remember that VA looks at residual income, not just DTI.</strong> Most people talk about debt-to-income
            ratio. That matters, but VA loans also look at residual income — the money left over after major monthly
            obligations. I like this part of VA underwriting because it looks at whether a veteran has real breathing room in
            the budget, not just whether a percentage fits on paper. A strong residual income can sometimes help a borrower
            whose DTI is higher than a conventional lender might prefer.
          </p>
          <p style={pStyle}>
            <strong>Shop more than one lender.</strong> Do not assume every lender treats VA loans the same way. They do
            not. Some are excellent with VA loans; some only do them occasionally; some understand disabled-veteran funding
            fee exemptions clearly and some need to be reminded. Even a small rate difference can cost or save you thousands
            over the life of a 30-year loan. You earned the benefit — make the lenders compete for it.
          </p>
          <p style={pStyle}>
            <strong>Confirm the property meets VA standards.</strong> The VA appraisal is not just about value; the home
            also has to meet VA&apos;s Minimum Property Requirements — safe, structurally sound, and sanitary. It is not a
            full home inspection, and you should still get your own, but the VA standards can catch serious problems.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2Style}>First time or second time, use the whole benefit</h2>
          <p style={pStyle}>
            The biggest lesson from my two VA purchases is that the benefit is bigger than just &ldquo;no down
            payment.&rdquo; Yes, $0 down is huge. No monthly mortgage insurance is huge. But there are other pieces that
            matter too: entitlement restoration if you sell and pay off the first VA loan, remaining entitlement if you keep
            a prior VA-financed home, the funding fee waiver for eligible disabled veterans, state and county tax exemptions
            that may apply after you buy, residual income underwriting, VA property standards, and surviving spouse rules in
            certain cases.
          </p>
          <p style={pStyle}>The problem is that nobody explains all of it in one place.</p>
          <p style={pStyle}>
            When I bought the first time, I mostly understood the $0 down part. That was enough to get me into the house.
            When I bought the second time, I understood a lot more. My disability status changed the funding fee.
            Georgia&apos;s disabled-veteran exemption changed my property tax picture. And I learned that a veteran can use
            the VA loan more than once if the entitlement situation is handled correctly.
          </p>
          <p style={pStyle}>
            Do not treat the VA loan like a one-time benefit. Do not assume the lender will explain every disabled-veteran
            benefit. Do not assume your county will tell you about every tax exemption. Ask. Verify. Apply. Follow up. You
            earned the benefit. Use all of it.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2Style}>Helpful next steps</h2>
          <p style={pStyle}>
            If you are planning a VA purchase: ask a VA lender to pull your Certificate of Eligibility, confirm whether you
            have full, restored, or remaining entitlement, ask whether you are exempt from the funding fee, compare more than
            one lender, and estimate your monthly payment with taxes and insurance included. If you are a disabled veteran,
            check your state and county property tax exemptions before or right after closing.
          </p>
          <p style={pStyle}>You can also use these free tools to run the numbers before you talk to a lender:</p>
          <ul style={{ margin: '0 0 16px', padding: '0 0 0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li style={{ fontSize: 15, color: '#374151', lineHeight: 1.7 }}>
              <Link href="/mortgage" style={linkStyle}>Mortgage calculator</Link> — estimate your payment and compare VA vs.
              FHA/conventional with no PMI
            </li>
            <li style={{ fontSize: 15, color: '#374151', lineHeight: 1.7 }}>
              <Link href="/qualify" style={linkStyle}>Mortgage qualifier</Link> — check your DTI and which loan programs you
              qualify for
            </li>
            <li style={{ fontSize: 15, color: '#374151', lineHeight: 1.7 }}>
              <Link href="/blog/fha-vs-conventional-vs-va-vs-usda" style={linkStyle}>FHA vs Conventional vs VA vs USDA</Link>{' '}
              — compare all four loan types side by side
            </li>
            <li style={{ fontSize: 15, color: '#374151', lineHeight: 1.7 }}>
              <Link href="/blog/va-loan-eligibility" style={linkStyle}>VA loan eligibility guide</Link> — service
              requirements, the COE, and surviving-spouse rules
            </li>
          </ul>
          <p style={pStyle}>
            The VA loan helped me buy two homes. The second time, my disability rating made the benefit even more valuable.
            If you are a veteran and you qualify, do not leave that value sitting unused.
          </p>
        </section>

        {/* Related links */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', margin: '0 0 36px' }}>
          <a href="/mortgage" style={{ background: '#2563eb', color: '#fff', fontSize: 14, fontWeight: 700, padding: '12px 22px', borderRadius: 12, textDecoration: 'none' }}>Estimate your payment →</a>
          <a href="/qualify" style={{ background: '#fff', color: '#2563eb', fontSize: 14, fontWeight: 700, padding: '12px 22px', borderRadius: 12, border: '1.5px solid #bfdbfe', textDecoration: 'none' }}>Check if you qualify →</a>
          <a href="/blog/va-loan-eligibility" style={{ background: '#f0fdf4', color: '#15803d', fontSize: 14, fontWeight: 700, padding: '12px 22px', borderRadius: 12, border: '1.5px solid #bbf7d0', textDecoration: 'none' }}>VA eligibility guide →</a>
        </div>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2Style}>Frequently asked questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {faqs.map(({ q, a }) => (
              <details key={q} style={{ padding: '16px 20px', background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <summary style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', cursor: 'pointer', listStyle: 'none' }}>{q}</summary>
                <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, margin: '10px 0 0' }}>{a}</p>
              </details>
            ))}
          </div>
        </section>

        <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, fontStyle: 'italic', borderTop: '1px solid #e2e8f0', paddingTop: 20, margin: '0 0 28px' }}>
          This article reflects the author&apos;s personal experience and is for general informational purposes only — it
          is not financial, tax, or lending advice. VA program rules, the funding fee, and state tax exemptions vary by
          service history, disability status, county, and year. Confirm current figures and your eligibility with the VA,
          a VA-approved lender, and your county tax assessor before making decisions.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a href="/blog" style={{ background: '#fff', color: '#2563eb', fontSize: 13, fontWeight: 600, padding: '10px 20px', borderRadius: 10, border: '1px solid #bfdbfe', textDecoration: 'none' }}>← All Articles</a>
          <a href="/qualify" style={{ background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 600, padding: '10px 20px', borderRadius: 10, textDecoration: 'none' }}>Mortgage Qualifier</a>
        </div>
      </div>
    </div>
  );
}
