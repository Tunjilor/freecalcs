import type { Metadata } from "next";
import CalcCTA from "@/components/blog/CalcCTA";
import RelatedTools from "@/components/blog/RelatedTools";
import { tokens as t } from "@/lib/calculator/tokens";

const URL = "https://www.freecalcs.io/blog/fha-vs-conventional-which-is-cheaper";
const TITLE = "FHA vs Conventional: Which Loan Is Actually Cheaper for You?";
const DESCRIPTION =
  "FHA is cheaper upfront and forgiving of fair credit. Conventional costs more at first but its mortgage insurance cancels — FHA's usually never does. Which wins depends on your score, your down payment, and how long you'll stay.";

export const metadata: Metadata = {
  title: `${TITLE} | freecalcs.io`,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: "freecalcs.io", type: "article" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const faqs = [
  {
    q: "Is an FHA or conventional loan cheaper?",
    a: "There's no single answer, and anyone who gives you one is guessing. Three things decide it together: your credit score, your down payment, and how long you'll keep the loan. FHA's mortgage insurance is a flat rate, so it's often cheaper month-to-month when your credit is fair. Conventional's PMI is priced by risk — expensive at fair credit, cheap at strong credit — but it cancels once you reach 20% equity, while FHA's usually never does. So FHA can win the first decade and conventional can win the second. Where you land depends on your numbers, not on a rule of thumb.",
  },
  {
    q: "Why is FHA mortgage insurance the same for everyone?",
    a: "FHA charges a flat annual premium — around 0.55% for a typical 30-year loan with the minimum down payment — regardless of credit score. Conventional PMI is priced by risk, so it costs more for lower scores and less for higher ones. That's the structural reason FHA tends to be friendlier to fair credit and conventional tends to reward strong credit. It isn't that one program is generous and the other isn't; they just price risk differently.",
  },
  {
    q: "Does FHA mortgage insurance ever go away?",
    a: "On FHA loans with less than 10% down, the annual MIP lasts the life of the loan and never cancels as you build equity. That's the single most expensive detail in this comparison, and it's the one most buyers don't find out until years later. With 10% or more down, MIP drops off after 11 years. Otherwise the usual escape is to refinance into a conventional loan once you have 20% equity — which works, but costs closing costs and depends on rates being tolerable when you do it.",
  },
  {
    q: "How much is the upfront cost difference?",
    a: "FHA charges an upfront mortgage insurance premium of 1.75% of the loan at closing — about $5,066 on a $289,500 loan — and it's usually rolled into the balance rather than paid in cash. Conventional loans have no equivalent upfront insurance charge. But FHA's minimum down payment is 3.5% versus conventional's 3–5%, so FHA typically asks for less cash at the table even though it adds more to what you owe. Less cash now, a bigger loan after.",
  },
  {
    q: "Can I switch from an FHA loan to a conventional loan later?",
    a: "Yes, and many buyers plan on it. Once you reach roughly 20% equity, refinancing from FHA to conventional removes the FHA mortgage insurance for good. It's worth doing when the monthly savings outweigh the refinance closing costs. The honest caveat: it isn't guaranteed. You're betting that rates, your credit, and your income will all cooperate on a date years from now. Treat it as a reasonable plan, not a certainty you can count on.",
  },
  {
    q: "What credit score do I need for each loan?",
    a: "FHA allows scores as low as 580 with 3.5% down, or 500 with 10% down. Conventional loans typically start around 620. But the qualifying minimum isn't the interesting number — the pricing is. Conventional PMI gets steadily cheaper as your score climbs, so a conventional loan that looks expensive at 640 can be the cheaper option outright by the mid-700s. Don't assume conventional is out of reach just because your score isn't excellent; get quoted on both.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const read = t.layout.readWidth;
const heroChip: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, color: t.color.onBrand, background: t.color.onBrandPanel,
  padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: ".06em",
};
const heroMeta: React.CSSProperties = { fontSize: 12, color: t.color.onBrandFaint };
const card: React.CSSProperties = {
  background: t.color.surface, borderRadius: t.radius.xl, padding: "32px 28px",
  boxShadow: t.shadow.card, border: `1px solid ${t.color.line}`, marginBottom: 32,
};
const h2: React.CSSProperties = { fontSize: 20, fontWeight: 700, color: t.color.ink, margin: "0 0 14px" };
const p: React.CSSProperties = { fontSize: 15, color: t.color.body, lineHeight: 1.8, margin: "0 0 16px" };
const strong: React.CSSProperties = { color: t.color.ink, fontWeight: 700 };
const inlineLink: React.CSSProperties = { color: t.color.brand, fontWeight: 600, textDecoration: "none" };
const faqBox: React.CSSProperties = {
  padding: "16px 20px", background: t.color.surfaceAlt, borderRadius: t.radius.md, border: `1px solid ${t.color.line}`,
};
const noteBox: React.CSSProperties = {
  background: t.color.surfaceAlt, border: `1px solid ${t.color.line}`, borderRadius: t.radius.lg,
  padding: "18px 20px", margin: "0 0 20px",
};
const rowLabel: React.CSSProperties = { fontSize: 14, color: t.color.body, lineHeight: 1.7, margin: 0 };

export default function Article() {
  return (
    <div style={{ fontFamily: t.font.family, background: t.gradient.page, minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <div style={{ background: t.gradient.hero, color: t.color.onBrand, padding: "40px 16px 48px" }}>
        <div style={{ maxWidth: read, margin: "0 auto" }}>
          <a href="/blog" style={{ color: t.color.onBrandFaint, fontSize: 13, textDecoration: "none" }}>← Back to Blog</a>
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0 12px", flexWrap: "wrap" }}>
            <span style={heroChip}>Mortgage</span>
            <span style={heroMeta}>10 min read</span>
            <span style={heroMeta}>Jul 16, 2026</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 16px", lineHeight: 1.3, color: t.color.onBrand }}>{TITLE}</h1>
          <p style={{ color: t.color.onBrandFaint, fontSize: 15, margin: 0, lineHeight: 1.6 }}>
            One is cheaper today. The other stops charging you eventually. Which of those matters more is a question only
            your own numbers can answer.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: read, margin: "0 auto", padding: "40px 16px" }}>
        <div style={card}>
          {/* Your situation */}
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 17, color: t.color.body, lineHeight: 1.75, margin: "0 0 16px" }}>
              You&apos;ve been told you qualify for both. Everyone around you has an opinion: FHA is the one for people who
              can&apos;t get approved otherwise, conventional is the &quot;real&quot; loan, obviously take conventional if
              you can. Meanwhile the FHA payment your lender quoted is genuinely lower, which makes the advice feel like it
              isn&apos;t about your money.
            </p>
            <p style={p}>
              That framing — FHA for bad credit, conventional for everyone else — is the lazy take. It treats a cost
              question as a status question. The useful version is narrower:{" "}
              <span style={strong}>which one takes less money from you, over the years you&apos;ll actually own this
              home?</span> That has a real answer, and it isn&apos;t the same answer for everyone.
            </p>
            <p style={p}>
              This article is about FHA versus conventional only. If you might also qualify for a VA or USDA loan, those
              can beat both — our{" "}
              <a href="/blog/fha-vs-conventional-vs-va-vs-usda" style={inlineLink}>
                comparison of all four loan programs
              </a>{" "}
              covers that ground, and a VA loan in particular is often the cheapest option on the table for those eligible.
            </p>
          </div>

          {/* The two real differences */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>Only two things really drive the difference</h2>
            <p style={p}>
              Strip away the noise and the two loans are more alike than not. Similar house, similar taxes, broadly similar
              base rates. Two differences do nearly all the work.
            </p>
            <p style={p}>
              <span style={strong}>1. How each one prices your credit score.</span> Conventional loans price risk
              aggressively: your score moves both your interest rate and, more sharply, your PMI. Fair credit makes
              conventional expensive; strong credit makes it cheap. FHA is far flatter — it was built for borrowers the
              conventional market treats harshly, and it mostly doesn&apos;t punish a mediocre score. This is the real
              reason &quot;FHA is for bad credit&quot; persists: there&apos;s a kernel of truth in it. It just isn&apos;t
              the whole story.
            </p>
            <p style={p}>
              <span style={strong}>2. How each one handles mortgage insurance — and this is the crux.</span> Put down less
              than 20% and both loans charge you insurance that protects the lender, not you. But they behave completely
              differently over time, and that difference is worth more than everything else in this comparison combined.
            </p>
          </div>

          {/* MI mechanics */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>The mortgage insurance mechanics, plainly</h2>
            <p style={p}>
              <span style={strong}>FHA charges twice.</span> There&apos;s an upfront premium of{" "}
              <span style={strong}>1.75% of the loan</span>, due at closing and usually rolled into the balance — so you
              don&apos;t feel it, you just owe it. Then there&apos;s an annual premium, around{" "}
              <span style={strong}>0.55%</span> for a typical 30-year loan at the minimum down payment, split across your
              monthly payments.
            </p>
            <p style={p}>
              Here is the detail that decides this whole article:{" "}
              <span style={strong}>with less than 10% down, FHA&apos;s annual premium lasts the life of the loan.</span> It
              does not fall off at 20% equity. It does not fall off at 50% equity. You can own 90% of your house outright
              and still be paying insurance on the lender&apos;s risk. With 10% or more down, it drops off after 11 years.
              Below that, the only exits are selling or refinancing out of FHA entirely.
            </p>
            <p style={p}>
              <span style={strong}>Conventional PMI charges once, and then stops.</span> No upfront premium. The monthly
              cost scales hard with your credit score — it can be brutal at fair credit and modest at strong credit — but
              it is <span style={strong}>cancellable</span>. You can request removal at roughly 20% equity, and by law it
              terminates automatically at 22% equity based on your original purchase price.
            </p>
            <p style={p}>
              So the shape of the trade is: FHA charges you less per month when your credit is fair, but charges you
              forever. Conventional may charge you more per month at first, but has an end date.{" "}
              <a href="/down-payment" style={inlineLink}>Reaching 20% equity</a> is what turns that end date from theory
              into money in your pocket, which is why how fast you get there matters as much as where you start.
            </p>
          </div>

          {/* The math */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>The same buyer, both loans, real numbers</h2>
            <p style={p}>
              Take a <span style={strong}>$300,000 home</span> and a buyer with <span style={strong}>fair credit —
              call it around 660</span> — comparing FHA at its 3.5% minimum against conventional at 5% down. Figures below
              are illustrative: rates and PMI vary by lender, by day, and by the fine detail of your file. The shape of the
              result is what to take away, not the exact dollars.
            </p>
            <div style={noteBox}>
              <p style={{ ...rowLabel, marginBottom: 10 }}>
                <span style={strong}>FHA, 3.5% down.</span> $10,500 down. Base loan $289,500, plus the 1.75% upfront
                premium ($5,066) rolled in — so you actually owe <span style={strong}>$294,566</span>. At an illustrative
                6.25%, principal and interest run about <span style={strong}>$1,814</span>, and the 0.55% annual MIP adds
                about <span style={strong}>$135</span>. Total: <span style={strong}>~$1,949 a month.</span>
              </p>
              <p style={rowLabel}>
                <span style={strong}>Conventional, 5% down.</span> $15,000 down. Loan{" "}
                <span style={strong}>$285,000</span>, no upfront premium. At an illustrative 6.5% — fair credit prices
                higher — principal and interest run about <span style={strong}>$1,801</span>, and PMI at roughly 1.10% for
                that score adds about <span style={strong}>$261</span>. Total:{" "}
                <span style={strong}>~$2,063 a month.</span>
              </p>
            </div>
            <p style={p}>
              So FHA starts <span style={strong}>$114 a month cheaper</span> and asks for $4,500 less cash at closing. If
              the decision ended at the closing table, FHA would win it clean — and for a buyer with fair credit and
              limited savings, that is not a small thing. It&apos;s the difference between buying this year and buying
              later.
            </p>
            <p style={p}>
              But watch what happens when the PMI cancels. Once the conventional borrower hits 20% equity, that $261
              disappears and their payment drops to about <span style={strong}>$1,801</span> — for good. The FHA
              borrower&apos;s premium keeps going for thirty years. It does shrink slowly, because it&apos;s charged
              against a falling balance: about $135 at the start, roughly $114 by year ten, around $74 by year twenty. But
              it never stops. Around the ten-year mark the FHA payment is still about{" "}
              <span style={strong}>$1,927</span> against conventional&apos;s $1,801 — so conventional flips from{" "}
              <span style={strong}>$114 a month more expensive</span> to roughly{" "}
              <span style={strong}>$125 a month cheaper</span>, and stays cheaper for the rest of the loan.
            </p>
            <CalcCTA
              href="/mortgage"
              label="Run both loans with your own numbers"
              blurb="Put in your price, your down payment, and the rate and mortgage insurance each lender actually quoted you. The gap between the two payments — and what happens to it when PMI cancels — is the whole decision, and it's specific to your file."
              cta="Open the mortgage calculator"
            />
          </div>

          {/* The crossover */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>Where the crossover actually lands</h2>
            <p style={p}>
              This is where most comparisons get hand-wavy, so here&apos;s the honest arithmetic — and it&apos;s less
              flattering to conventional than the usual telling. Automatic PMI cancellation is measured against your{" "}
              <span style={strong}>original purchase price</span>, so paying a 95% loan-to-value mortgage down to 20%
              equity <span style={strong}>on scheduled payments alone</span> — no help from rising home prices — takes
              roughly <span style={strong}>ten and a half years</span>. Over that decade the conventional borrower has
              paid about <span style={strong}>$13,000 more</span> than the FHA borrower. Clawing that back at ~$125 a
              month takes <span style={strong}>another ten years</span>. On that path, conventional doesn&apos;t actually
              pull ahead until somewhere around <span style={strong}>year twenty</span>.
            </p>
            <p style={p}>
              That is a long time — longer than most people keep a mortgage, and far longer than the &quot;conventional
              wins over time&quot; slogan implies. At <span style={strong}>fair credit</span>, FHA isn&apos;t just the
              accessible option; on a flat market it can be the cheaper option for nearly the entire time you own the
              home. That&apos;s the part the standard advice skips.
            </p>
            <p style={p}>
              Rising home prices change it substantially, though. Equity comes from the home&apos;s value as much as your
              balance, and servicers will generally consider cancelling PMI against a{" "}
              <span style={strong}>current appraised value</span> once the loan has some age on it. With modest
              appreciation, that same borrower reaches the threshold nearer <span style={strong}>year five</span> — which
              pulls the crossover all the way in to about <span style={strong}>year nine</span>. Same two loans, same
              buyer; the market decided it.
            </p>
            <p style={p}>
              The catch is that this faster path isn&apos;t automatic or guaranteed: it takes an appraisal you pay for, a
              servicer who agrees, and a market that cooperated. The ten-year timeline is what you&apos;re entitled to by
              law. The five-year one is what you might get.{" "}
              <a href="/down-payment" style={inlineLink}>How much you put down</a> is the lever you actually control —
              every extra percent shortens that road.
            </p>
            <p style={p}>
              Which is the real lesson:{" "}
              <span style={strong}>how long you&apos;ll stay isn&apos;t a footnote to this decision — it is the
              decision.</span>{" "}
              Under about eight years at fair credit, FHA is very hard to beat on any assumption. Past twenty,
              conventional wins even if your home never gains a dollar. The entire span in between hinges on something
              nobody can promise you — what the market does — which is exactly why an honest answer here has to stay
              conditional.
            </p>
          </div>

          {/* Change one variable */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>Now change one number and watch it flip</h2>
            <p style={p}>
              Everything above assumed fair credit. Move that one input and the answer inverts. Take the{" "}
              <span style={strong}>same $300,000 home, same 5% down</span>, but a{" "}
              <span style={strong}>740 score</span>: conventional&apos;s rate improves and its PMI falls to something like
              0.55%, so the payment lands near <span style={strong}>$1,909</span> — versus FHA&apos;s{" "}
              <span style={strong}>$1,949</span>, which barely moves, because FHA doesn&apos;t care much about your score.
            </p>
            <p style={p}>
              Now conventional is <span style={strong}>cheaper from the very first payment</span>, and its insurance still
              cancels later. There&apos;s no crossover to wait for and no trade-off to weigh — conventional simply wins.
              The same two loans, the same house, the opposite conclusion, because one input moved.
            </p>
            <p style={p}>
              Your down payment is the other lever, and it works on both sides. At{" "}
              <span style={strong}>10% down on FHA</span>, the permanent premium becomes an 11-year one — which repairs
              FHA&apos;s worst flaw. At <span style={strong}>20% down on conventional</span>, there&apos;s no PMI at all
              and the comparison stops being close. Between those, every extra percent you put down shortens the road to
              cancellation and moves the crossover toward conventional.
            </p>
            <CalcCTA
              href="/qualify"
              label="See which programs you actually fit"
              blurb="Before comparing costs, it's worth knowing which loans are genuinely open to you. The qualifier checks your score, income, and debts against conventional, FHA, VA, USDA, and jumbo requirements — including the programs that might beat both of these."
              cta="Check what you qualify for"
            />
          </div>

          {/* The honest tension */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>The honest part</h2>
            <p style={p}>
              Both reputations are earned. <span style={strong}>FHA really is the more accessible loan</span> — lower score
              thresholds, smaller down payment, more forgiving of a thin or bruised file, and often cheaper month-to-month
              when your credit is fair. That accessibility is the entire reason the program exists, and dismissing it as
              the consolation prize misreads what it does.
            </p>
            <p style={p}>
              And <span style={strong}>conventional really does win the long game</span> — not because it&apos;s
              prestigious, but for one mechanical reason: its insurance has an end date and FHA&apos;s usually
              doesn&apos;t. Given enough years, an expense that stops beats an expense that doesn&apos;t.
            </p>
            <p style={p}>
              The tension is that those two truths point at different buyers, and nobody can tell you which one you are
              without your numbers. <span style={strong}>Three inputs decide it, and they interact:</span> your credit
              score sets the starting gap, your down payment sets how fast the gap closes, and your time horizon sets
              whether the closing ever happens while you still own the house. Strong credit points to conventional almost
              regardless. Fair credit plus a short stay points to FHA almost regardless. Fair credit plus a long stay is a
              real toss-up that only your actual quotes can settle.
            </p>
            <p style={p}>
              Which is why you should be suspicious of any clean cutoff — including the ones you&apos;ll see written
              confidently elsewhere. <span style={strong}>There is no score above which conventional wins and below which
              FHA does.</span> A 660 buyer staying twenty years and a 700 buyer staying four should choose differently, and
              a single number can&apos;t express that. Credit score is one lever of three, not the verdict.
            </p>
          </div>

          {/* Common mistakes */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={h2}>Common mistakes</h2>
            <p style={p}>
              <span style={strong}>Taking FHA for the low down payment without knowing the MIP is permanent.</span> This is
              the expensive one. The 3.5% gets you in the door, and years later you discover the insurance has no exit —
              you assumed it worked like PMI, and nobody corrected you. If you go FHA with less than 10% down, do it
              knowing that premium is a permanent fixture unless you refinance out.
            </p>
            <p style={p}>
              <span style={strong}>Assuming conventional is out of reach at fair credit.</span> Conventional starts around
              620, not 700. It may well cost more than FHA at 640 — but &quot;more expensive&quot; and
              &quot;unavailable&quot; are different things, and you can&apos;t compare an option you never priced. Get the
              quote even if you expect not to like it.
            </p>
            <p style={p}>
              <span style={strong}>Comparing the two payments and stopping there.</span> The monthly quote makes FHA look
              like the winner at fair credit, and for a short stay it is. But that number says nothing about the swing
              waiting on the other side of cancellation, when the same two loans trade places. A comparison that ignores
              what happens at year ten isn&apos;t a comparison — it&apos;s a snapshot.
            </p>
            <p style={p}>
              <span style={strong}>Not shopping both, at more than one lender.</span> Lenders price these programs
              differently and weight credit differently, so the FHA-versus-conventional gap is partly a fact about your
              file and partly a fact about who you asked. Two real quotes for both programs from two lenders will teach you
              more than any article, including this one.
            </p>
            <p style={p}>
              <span style={strong}>Banking on &quot;FHA now, refinance later.&quot;</span> It&apos;s a sound plan and it
              often works — <a href="/blog/fha-loan-requirements" style={inlineLink}>FHA&apos;s requirements</a> make it an
              easy place to start. But it assumes future rates, future credit, and future income all cooperate. If the FHA
              loan only makes sense <span style={strong}>because</span> you&apos;ll refinance out of it, you&apos;re
              choosing a loan you can&apos;t afford to keep.
            </p>
          </div>

          {/* Conditional recommendation */}
          <div style={{ marginBottom: 8 }}>
            <h2 style={h2}>So — which should you choose?</h2>
            <p style={p}>
              <span style={strong}>Lean FHA</span> if your credit is fair or low and that&apos;s not changing before you
              buy; if the smaller down payment is what makes the purchase possible now rather than in three years; or if
              you have real reason to think you&apos;ll move within roughly eight years. In those cases FHA is very
              likely the cheaper loan for the time you&apos;ll hold it — not a compromise, the correct answer. If you go
              this way and can find another 6.5% of the price, <span style={strong}>10% down turns the permanent premium
              into an 11-year one</span>, which is the single best value in the FHA program.
            </p>
            <p style={p}>
              <span style={strong}>Lean conventional</span> if any of these fits:
            </p>
            <p style={p}>
              <span style={strong}>1. Your credit is decent — mid-700s or better.</span> Then it isn&apos;t a trade-off at
              all. Conventional is likely cheaper on day one and cheaper again once PMI cancels. Take it.
            </p>
            <p style={p}>
              <span style={strong}>2. You can reach 20% down, or you&apos;re close.</span> No PMI at all removes the only
              real argument for FHA, and the comparison stops being interesting.
            </p>
            <p style={p}>
              <span style={strong}>3. You&apos;ll plausibly stay past the crossover.</span> If this is the house you
              intend to be in for ten or fifteen years, cancellable insurance is worth paying more for early — even at
              fair credit, even though it stings at first.
            </p>
            <p style={p}>
              And if you&apos;re somewhere in the middle — fair credit, small down payment, genuinely unsure how long
              you&apos;ll stay — that&apos;s not a failure to decide. It means the two loans are close for you, and the
              tiebreaker isn&apos;t a rule from an article: it&apos;s two real quotes, an honest answer about how long
              you&apos;ll be there, and which risk you&apos;d rather carry. Paying more now for an expense that ends, or
              paying less now for one that doesn&apos;t. Both are defensible. Only one of them is yours to pick.
            </p>
          </div>

          {/* Disclaimer reinforcement */}
          <p
            style={{
              fontSize: 12, color: t.color.faint, lineHeight: 1.6, fontStyle: "italic",
              borderTop: `1px solid ${t.color.line}`, paddingTop: 20, margin: "8px 0 0",
            }}
          >
            This article is information to help you think through the trade-off — it isn&apos;t financial or lending
            advice. freecalcs isn&apos;t your advisor or your lender, and the right loan depends on details only you and a
            licensed loan officer can see. Every rate, premium, and PMI figure here is illustrative: mortgage insurance
            pricing, FHA premium rates, and cancellation rules are set by lenders, insurers, and HUD, and they change.
            Confirm current numbers and program terms with a licensed lender before you commit to either loan.
          </p>
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: t.color.ink, margin: "0 0 16px" }}>Frequently asked questions</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {faqs.map((f) => (
              <div key={f.q} style={faqBox}>
                <p style={{ fontSize: 14, fontWeight: 700, color: t.color.ink, margin: "0 0 8px" }}>{f.q}</p>
                <p style={{ fontSize: 14, color: t.color.body, lineHeight: 1.7, margin: 0 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Continue planning */}
        <RelatedTools
          heading="Continue planning"
          tools={[
            { href: "/qualify", label: "Mortgage Qualifier" },
            { href: "/mortgage", label: "Mortgage Calculator" },
            { href: "/down-payment", label: "Down Payment Calculator" },
            { href: "/refinance", label: "Refinance Calculator" },
          ]}
        />

        <RelatedTools
          heading="Keep reading"
          tools={[
            { href: "/blog/fha-vs-conventional-vs-va-vs-usda", label: "FHA vs conventional vs VA vs USDA: all four compared" },
            { href: "/blog/fha-loan-requirements", label: "FHA loan requirements 2026" },
            { href: "/blog/can-i-buy-a-house-with-640-credit-score", label: "Can I buy a house with a 640 credit score?" },
          ]}
        />

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
          <a
            href="/blog"
            style={{
              background: t.color.surface, color: t.color.brand, fontSize: 13, fontWeight: 600,
              padding: "10px 20px", borderRadius: t.radius.md, border: `1px solid ${t.color.line}`, textDecoration: "none",
            }}
          >
            ← All Articles
          </a>
        </div>
      </div>
    </div>
  );
}
