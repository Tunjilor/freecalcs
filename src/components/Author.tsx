import type { CSSProperties } from 'react';

// Reusable author registry + byline/bio block for blog posts.
// To backfill a byline on another post: import { AUTHORS } from '@/components/Author'
// and render <Author author={AUTHORS.jamie} /> under that post's H1.
export type AuthorInfo = {
  name: string;
  title: string; // short credential, e.g. "U.S. Army veteran"
  bio: string;
  url?: string; // optional profile URL, surfaced in Person schema
};

export const AUTHORS: Record<string, AuthorInfo> = {
  jamie: {
    name: 'Jamie',
    title: 'U.S. Army veteran',
    bio: "4½ years of service including two tours in Iraq and one in Afghanistan, and a service-connected disabled vet. I've bought two homes with the VA loan: my first in Tampa Bay, Florida, and the one I live in now near Atlanta, Georgia.",
  },
};

const wrap: CSSProperties = { display: 'flex', gap: 14, alignItems: 'flex-start', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px 18px', margin: '0 0 32px' };
const avatar: CSSProperties = { width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#1e3a5f,#2563eb)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, flexShrink: 0 };
const nameRow: CSSProperties = { display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', margin: '0 0 4px' };

export default function Author({ author }: { author: AuthorInfo }) {
  return (
    <div style={wrap}>
      <div style={avatar} aria-hidden="true">{author.name.charAt(0)}</div>
      <div>
        <div style={nameRow}>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>By {author.name}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', background: '#2563eb14', padding: '2px 9px', borderRadius: 20 }}>{author.title}</span>
        </div>
        <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.65, margin: 0 }}>{author.bio}</p>
      </div>
    </div>
  );
}
