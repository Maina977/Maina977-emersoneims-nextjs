// MODULE — Video Tutorial Library page
// Curated directory of public solar PV training destinations on YouTube.
// Data lives in `data/video-library.json` (with provenance block).
//
// Design history:
// 1) Originally embedded individual videos via youtube-nocookie iframes — those
//    were blocked by our CSP frame-src and showed grey boxes in production.
// 2) Switched to link-first cards using individual youtubeId values + i.ytimg
//    thumbnails — but the curated IDs were stale/private/deleted, so YouTube
//    served its generic "video unavailable" placeholder thumbnail (HTTP 200,
//    so onError never fired) and click-throughs hit YouTube's unavailable page.
// 3) (Current) The library is now a topic directory of CHANNEL pages and
//    YouTube SEARCH-result URLs. Channels and search URLs do not 404, return
//    live results, and self-refresh as publishers add content. There are no
//    per-video IDs to go stale and no thumbnails to fetch, so the
//    "unavailable" frames are gone for good.

import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
// @ts-ignore — JSON import works under Vite default config
import library from '../../data/video-library.json';

const Wrap = styled.div` padding: 1.25rem; max-width: 1300px; margin: 0 auto; color: #E6F1FF; `;
const Card = styled.section`
  background: rgba(11, 18, 48, 0.55);
  border: 1px solid rgba(0, 217, 255, 0.18);
  border-radius: 12px;
  padding: 1.1rem 1.2rem;
  margin-bottom: 1rem;
`;
const Tabs = styled.div` display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1rem; `;
const Tab = styled.button<{ $active: boolean }>`
  padding: 0.45rem 0.9rem; border-radius: 999px; cursor: pointer;
  border: 1px solid ${p => p.$active ? '#00D9FF' : 'rgba(0,217,255,0.3)'};
  background: ${p => p.$active ? '#00D9FF' : 'transparent'};
  color: ${p => p.$active ? '#050818' : '#00D9FF'};
  font-weight: 600; font-size: 0.86rem;
`;
const Grid = styled.div` display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1rem; `;
const TopicCard = styled.a`
  display: flex; flex-direction: column; gap: 0.5rem;
  padding: 1rem 1.1rem; min-height: 168px;
  background: rgba(0,0,0,0.35); border: 1px solid rgba(0,217,255,0.2);
  border-radius: 10px; color: #E6F1FF; text-decoration: none;
  transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease;
  &:hover {
    transform: translateY(-2px);
    border-color: rgba(0,217,255,0.55);
    background: rgba(0,32,64,0.45);
  }
`;
const KindBadge = styled.span<{ $kind: 'channel' | 'search' }>`
  display: inline-flex; align-items: center; gap: 6px;
  padding: 2px 8px; border-radius: 999px;
  font-size: 0.7rem; font-weight: 600; letter-spacing: 0.02em;
  border: 1px solid currentColor;
  color: ${p => (p.$kind === 'channel' ? '#7dd3fc' : '#fcd34d')};
  background: ${p => (p.$kind === 'channel' ? 'rgba(125,211,252,0.12)' : 'rgba(252,211,77,0.12)')};
`;
const Pill = styled.span<{ $tone?: 'intro' | 'intermediate' | 'advanced' }>`
  display: inline-block; padding: 2px 8px; border-radius: 999px;
  font-size: 0.7rem; border: 1px solid currentColor;
  background: ${p =>
    p.$tone === 'advanced' ? 'rgba(239,68,68,0.15)' :
    p.$tone === 'intermediate' ? 'rgba(251,191,36,0.15)' :
    'rgba(34,197,94,0.15)'};
  color: ${p =>
    p.$tone === 'advanced' ? '#fca5a5' :
    p.$tone === 'intermediate' ? '#fcd34d' :
    '#86efac'};
`;
const OpenLine = styled.span`
  margin-top: auto; padding-top: 0.4rem;
  font-size: 0.82rem; font-weight: 600; color: #00D9FF;
`;

interface LinkItem {
  title: string;
  source: string;
  url: string;
  kind: 'channel' | 'search';
  level: 'intro' | 'intermediate' | 'advanced';
}
interface Category {
  id: string;
  title: string;
  description?: string;
  links: LinkItem[];
}

const VideoLibraryPage: React.FC = () => {
  const cats: Category[] = (library as any).categories || [];
  const provenance = (library as any)._provenance;
  const [active, setActive] = useState<string>(cats[0]?.id || '');
  const [search, setSearch] = useState('');

  const current = cats.find(c => c.id === active);
  const filtered = useMemo(() => {
    if (!current) return [];
    const q = search.trim().toLowerCase();
    if (!q) return current.links;
    return current.links.filter(l =>
      l.title.toLowerCase().includes(q) ||
      l.source.toLowerCase().includes(q) ||
      l.level.toLowerCase().includes(q) ||
      l.kind.toLowerCase().includes(q)
    );
  }, [current, search]);

  useEffect(() => {
    if (cats.length && !active) setActive(cats[0].id);
  }, [cats, active]);

  return (
    <Wrap>
      <h1 style={{ marginTop: 0 }}>🎬 Video Tutorial Library</h1>
      <p style={{ color: 'rgba(230,241,255,0.65)' }}>
        A curated topic directory of public solar PV training on YouTube. Each
        card opens a publisher's channel or a live YouTube topic search in a
        new tab — SolarGeniusPro never hosts or rebroadcasts video content.
      </p>

      <Card>
        <Tabs>
          {cats.map(c => (
            <Tab key={c.id} $active={c.id === active} onClick={() => setActive(c.id)}>
              {c.title} <span style={{ opacity: 0.6, marginLeft: 4 }}>({c.links.length})</span>
            </Tab>
          ))}
        </Tabs>
        <input
          type="text"
          placeholder="Search title / source / level / kind…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', maxWidth: 380, background: '#0b1230', color: '#E6F1FF',
            border: '1px solid rgba(0,217,255,0.25)', borderRadius: 6,
            padding: '0.45rem 0.6rem', fontSize: '0.92rem'
          }}
        />
      </Card>

      {current?.description && (
        <Card>
          <p style={{ margin: 0, fontSize: '0.92rem', color: 'rgba(230,241,255,0.78)' }}>
            {current.description}
          </p>
        </Card>
      )}

      <Grid>
        {filtered.map((l, i) => (
          <TopicCard
            key={`${l.url}-${i}`}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${l.title} on YouTube`}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
              <KindBadge $kind={l.kind}>
                {l.kind === 'channel' ? '▶ Channel' : '🔎 Topic'}
              </KindBadge>
              <Pill $tone={l.level}>{l.level}</Pill>
            </div>
            <strong style={{ fontSize: '1rem', lineHeight: 1.3 }}>{l.title}</strong>
            <span style={{ fontSize: '0.78rem', color: 'rgba(230,241,255,0.6)' }}>{l.source}</span>
            <OpenLine>Open on YouTube ↗</OpenLine>
          </TopicCard>
        ))}
      </Grid>

      {filtered.length === 0 && (
        <Card><p style={{ margin: 0, color: 'rgba(230,241,255,0.55)' }}>No topics match your search in this category.</p></Card>
      )}

      {provenance && (
        <Card>
          <h3 style={{ marginTop: 0 }}>Provenance</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(253,230,138,0.85)' }}>
            <strong>Source:</strong> {provenance.source}<br />
            <strong>License:</strong> {provenance.license}<br />
            <strong>Policy:</strong> {provenance.policy}<br />
            <strong>Last reviewed:</strong> {provenance.lastReviewed}
          </p>
        </Card>
      )}
    </Wrap>
  );
};

export default VideoLibraryPage;
