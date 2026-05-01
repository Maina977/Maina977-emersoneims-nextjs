// MODULE — Video Tutorial Library page
// Curated solar PV training videos from public YouTube channels.
// Data lives in `data/video-library.json` (with provenance block).
// We embed via YouTube's standard iframe — we do NOT host the videos.

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
const Grid = styled.div` display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 1rem; `;
const VideoCard = styled.div`
  background: rgba(0,0,0,0.35); border: 1px solid rgba(0,217,255,0.2);
  border-radius: 10px; overflow: hidden; display: flex; flex-direction: column;
`;
const Frame = styled.div`
  position: relative; width: 100%; padding-top: 56.25%;
  iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
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

interface Video { title: string; channel: string; youtubeId: string; minutes: number; level: 'intro' | 'intermediate' | 'advanced'; }
interface Category { id: string; title: string; videos: Video[]; }

const VideoLibraryPage: React.FC = () => {
  const cats: Category[] = (library as any).categories || [];
  const provenance = (library as any)._provenance;
  const [active, setActive] = useState<string>(cats[0]?.id || '');
  const [search, setSearch] = useState('');

  const current = cats.find(c => c.id === active);
  const filtered = useMemo(() => {
    if (!current) return [];
    const q = search.trim().toLowerCase();
    if (!q) return current.videos;
    return current.videos.filter(v =>
      v.title.toLowerCase().includes(q) ||
      v.channel.toLowerCase().includes(q) ||
      v.level.toLowerCase().includes(q)
    );
  }, [current, search]);

  useEffect(() => {
    if (cats.length && !active) setActive(cats[0].id);
  }, [cats, active]);

  return (
    <Wrap>
      <h1 style={{ marginTop: 0 }}>🎬 Video Tutorial Library</h1>
      <p style={{ color: 'rgba(230,241,255,0.65)' }}>
        Curated solar PV training videos from public manufacturer + educator
        YouTube channels. SolarGeniusPro does not host these — every video is
        embedded directly from the original publisher.
      </p>

      <Card>
        <Tabs>
          {cats.map(c => (
            <Tab key={c.id} $active={c.id === active} onClick={() => setActive(c.id)}>
              {c.title} <span style={{ opacity: 0.6, marginLeft: 4 }}>({c.videos.length})</span>
            </Tab>
          ))}
        </Tabs>
        <input
          type="text"
          placeholder="Search title / channel / level…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', maxWidth: 380, background: '#0b1230', color: '#E6F1FF',
            border: '1px solid rgba(0,217,255,0.25)', borderRadius: 6,
            padding: '0.45rem 0.6rem', fontSize: '0.92rem'
          }}
        />
      </Card>

      <Grid>
        {filtered.map((v, i) => (
          <VideoCard key={`${v.youtubeId}-${i}`}>
            <Frame>
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}`}
                title={v.title}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </Frame>
            <div style={{ padding: '0.7rem 0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' }}>
                <strong style={{ fontSize: '0.95rem', lineHeight: 1.3 }}>{v.title}</strong>
                <Pill $tone={v.level}>{v.level}</Pill>
              </div>
              <div style={{ marginTop: 4, fontSize: '0.78rem', color: 'rgba(230,241,255,0.6)' }}>
                {v.channel} · {v.minutes} min ·{' '}
                <a href={`https://www.youtube.com/watch?v=${v.youtubeId}`} target="_blank" rel="noreferrer" style={{ color: '#00D9FF' }}>Open on YouTube</a>
              </div>
            </div>
          </VideoCard>
        ))}
      </Grid>

      {filtered.length === 0 && (
        <Card><p style={{ margin: 0, color: 'rgba(230,241,255,0.55)' }}>No videos match your search in this category.</p></Card>
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
