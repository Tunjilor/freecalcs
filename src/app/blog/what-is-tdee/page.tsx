import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'What is TDEE and How Many Calories Should You Eat | freecalcs.io',
  description: 'TDEE explained simply. Learn how to calculate your Total Daily Energy Expenditure, choose the right calorie target, and understand BMR and macros.',
  alternates: { canonical: 'https://www.freecalcs.io/blog/what-is-tdee' },
  openGraph: { title: 'What is TDEE and How Many Calories Should You Eat', description: 'TDEE explained simply. Learn how to calculate your Total Daily Energy Expenditure, choose the right calorie target, and understand BMR and macros.', url: 'https://www.freecalcs.io/blog/what-is-tdee', siteName: 'freecalcs.io', type: 'article' },
};
export default function Article() {
  return (
    <div style={{fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif',background:'linear-gradient(180deg,#f8fafc 0%,#eef2ff 50%,#f0fdf4 100%)',minHeight:'100vh'}}>
      <div style={{background:'linear-gradient(135deg,#0f172a 0%,#1e3a5f 40%,#2563eb 100%)',color:'#fff',padding:'40px 16px 48px'}}>
        <div style={{maxWidth:720,margin:'0 auto'}}>
          <a href="/blog" style={{color:'#93c5fd',fontSize:13,textDecoration:'none'}}>← Back to Blog</a>
          <div style={{display:'flex',alignItems:'center',gap:10,margin:'16px 0 12px'}}>
            <span style={{fontSize:11,fontWeight:700,color:'#10b981',background:'#10b98122',padding:'3px 10px',borderRadius:20,textTransform:'uppercase',letterSpacing:'.06em'}}>Health</span>
            <span style={{fontSize:12,color:'#93c5fd'}}>5 min read</span>
            <span style={{fontSize:12,color:'#93c5fd'}}>Apr 28, 2026</span>
          </div>
          <h1 style={{fontSize:32,fontWeight:800,margin:'0 0 16px',lineHeight:1.3,color:'#fff'}}>What is TDEE and How Many Calories Should You Eat</h1>
          <p style={{color:'#93c5fd',fontSize:15,margin:0,lineHeight:1.6}}>TDEE explained simply. Learn how to calculate your Total Daily Energy Expenditure, choose the right calorie target, and understand BMR and macros.</p>
        </div>
      </div>
      <div style={{maxWidth:720,margin:'0 auto',padding:'40px 16px'}}>
        <div style={{background:'rgba(255,255,255,0.9)',backdropFilter:'blur(12px)',borderRadius:20,padding:'32px 28px',boxShadow:'0 4px 24px rgba(0,0,0,.06)',border:'1px solid rgba(226,232,240,0.8)',marginBottom:32}}>
          <div style={{marginBottom:32}}>
            <h2 style={{fontSize:20,fontWeight:700,color:'#111827',margin:'0 0 14px'}}>What Is TDEE?</h2>
            <p style={{fontSize:15,color:'#374151',lineHeight:1.8,margin:'0 0 16px'}}>TDEE stands for Total Daily Energy Expenditure. It is the total number of calories your body burns in a single day, accounting for everything from breathing and digestion to walking and exercise.</p>
            <p style={{fontSize:15,color:'#374151',lineHeight:1.8,margin:'0 0 16px'}}>TDEE is the foundation of any nutrition plan. Eat fewer calories than your TDEE and you lose weight. Eat more and you gain weight. Eat roughly the same and your weight stays stable.</p>
            <p style={{fontSize:15,color:'#374151',lineHeight:1.8,margin:'0 0 16px'}}>Your TDEE has three components: Basal Metabolic Rate (BMR) accounts for 60-75% and covers calories burned at complete rest. The Thermic Effect of Food uses about 10% of intake for digestion. Physical activity accounts for the remaining 15-30%.</p>
          </div>
          <div style={{marginBottom:32}}>
            <h2 style={{fontSize:20,fontWeight:700,color:'#111827',margin:'0 0 14px'}}>How to Calculate Your TDEE</h2>
            <p style={{fontSize:15,color:'#374151',lineHeight:1.8,margin:'0 0 16px'}}>TDEE is calculated by finding your BMR first, then multiplying by an activity factor. The recommended Mifflin-St Jeor equation works like this.</p>
            <p style={{fontSize:15,color:'#374151',lineHeight:1.8,margin:'0 0 16px'}}>For men: BMR = (10 x weight in kg) + (6.25 x height in cm) - (5 x age) + 5. For women: BMR = (10 x weight in kg) + (6.25 x height in cm) - (5 x age) - 161.</p>
            <p style={{fontSize:15,color:'#374151',lineHeight:1.8,margin:'0 0 16px'}}>Then multiply by activity level: Sedentary BMR x 1.2. Lightly active BMR x 1.375. Moderately active BMR x 1.55. Very active BMR x 1.725. Extra active BMR x 1.9. Our TDEE calculator does this instantly and shows results from three validated formulas.</p>
          </div>
          <div style={{marginBottom:32}}>
            <h2 style={{fontSize:20,fontWeight:700,color:'#111827',margin:'0 0 14px'}}>Calories for Weight Loss</h2>
            <p style={{fontSize:15,color:'#374151',lineHeight:1.8,margin:'0 0 16px'}}>A safe deficit is 500 calories below TDEE per day, producing approximately 1 pound of fat loss per week since 1 pound of fat contains roughly 3,500 calories.</p>
            <p style={{fontSize:15,color:'#374151',lineHeight:1.8,margin:'0 0 16px'}}>For faster results, a 750-calorie deficit produces about 1.5 pounds per week. Going beyond 1,000-calorie deficit is generally not recommended as it leads to muscle loss and metabolic adaptation.</p>
            <p style={{fontSize:15,color:'#374151',lineHeight:1.8,margin:'0 0 16px'}}>Important minimums: women should not eat below 1,200 calories daily and men should not go below 1,500 without medical supervision.</p>
          </div>
          <div style={{marginBottom:32}}>
            <h2 style={{fontSize:20,fontWeight:700,color:'#111827',margin:'0 0 14px'}}>Calories for Muscle Gain</h2>
            <p style={{fontSize:15,color:'#374151',lineHeight:1.8,margin:'0 0 16px'}}>Building muscle requires a calorie surplus of 250-500 calories above TDEE daily. This should be paired with resistance training at least 3 times per week and 0.7-1 gram of protein per pound of body weight.</p>
            <p style={{fontSize:15,color:'#374151',lineHeight:1.8,margin:'0 0 16px'}}>A common mistake is eating too much surplus. A 200-pound person eating 1,000 calories above TDEE gains muscle but also significant fat. The lean bulk approach of 250-350 extra calories produces nearly the same muscle growth with much less fat.</p>
          </div>
          <div style={{marginBottom:32}}>
            <h2 style={{fontSize:20,fontWeight:700,color:'#111827',margin:'0 0 14px'}}>Understanding Macros</h2>
            <p style={{fontSize:15,color:'#374151',lineHeight:1.8,margin:'0 0 16px'}}>Once you know your calorie target, split calories into macronutrients. A solid starting point: Protein 30% of calories for muscle and satiety. Carbohydrates 40% for energy and workouts. Fat 30% for hormones and nutrient absorption.</p>
            <p style={{fontSize:15,color:'#374151',lineHeight:1.8,margin:'0 0 16px'}}>For a 2,000-calorie diet: 150g protein, 200g carbs, 67g fat. Adjust based on goals. Higher protein 35-40% helps fat loss. Higher carbs suit endurance athletes. The most important factors are total calories and adequate protein.</p>
          </div>

        </div>
        <div style={{background:'linear-gradient(135deg,#eff6ff,#f0fdf4)',borderRadius:20,padding:'28px 24px',border:'1px solid #bfdbfe',marginBottom:32,textAlign:'center'}}>
          <p style={{fontSize:18,fontWeight:700,color:'#111827',margin:'0 0 8px'}}>Try It Yourself</p>
          <p style={{fontSize:14,color:'#64748b',margin:'0 0 16px'}}>Use our free TDEE Calculator to run your own numbers.</p>
          <a href="/tdee" style={{display:'inline-block',background:'#2563eb',color:'#fff',fontSize:15,fontWeight:700,padding:'12px 28px',borderRadius:12,textDecoration:'none'}}>Open TDEE Calculator →</a>
        </div>
        <div style={{marginBottom:32}}>
          <p style={{fontSize:18,fontWeight:700,color:'#111827',margin:'0 0 16px'}}>Frequently Asked Questions</p>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            <div style={{padding:'16px 20px',background:'#f8fafc',borderRadius:12,border:'1px solid #e2e8f0'}}>
              <p style={{fontSize:14,fontWeight:700,color:'#111827',margin:'0 0 8px'}}>How accurate is TDEE calculation?</p>
              <p style={{fontSize:14,color:'#374151',lineHeight:1.7,margin:0}}>TDEE formulas are estimates accurate to within about 10%. Use your result as a starting point then adjust based on real results over 2-3 weeks.</p>
            </div>
            <div style={{padding:'16px 20px',background:'#f8fafc',borderRadius:12,border:'1px solid #e2e8f0'}}>
              <p style={{fontSize:14,fontWeight:700,color:'#111827',margin:'0 0 8px'}}>Should I eat back exercise calories?</p>
              <p style={{fontSize:14,color:'#374151',lineHeight:1.7,margin:0}}>Generally no. Your TDEE already accounts for activity level. If you do extra intense exercise beyond your normal routine, eating back 50% of those calories is reasonable.</p>
            </div>
            <div style={{padding:'16px 20px',background:'#f8fafc',borderRadius:12,border:'1px solid #e2e8f0'}}>
              <p style={{fontSize:14,fontWeight:700,color:'#111827',margin:'0 0 8px'}}>Does metabolism slow with age?</p>
              <p style={{fontSize:14,color:'#374151',lineHeight:1.7,margin:0}}>Yes but less than most think. BMR decreases about 1-2% per decade after 20, mainly from muscle loss. Resistance training significantly slows this decline.</p>
            </div>

          </div>
        </div>
        <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
          <a href="/blog" style={{background:'#fff',color:'#2563eb',fontSize:13,fontWeight:600,padding:'10px 20px',borderRadius:10,border:'1px solid #bfdbfe',textDecoration:'none'}}>← All Articles</a>
          <a href="/tdee" style={{background:'#2563eb',color:'#fff',fontSize:13,fontWeight:600,padding:'10px 20px',borderRadius:10,textDecoration:'none'}}>TDEE Calculator</a>
        </div>
      </div>
    </div>
  );
}
