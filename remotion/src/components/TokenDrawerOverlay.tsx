import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { TimelineSnapshot } from '../data/factoryTimeline';
import { AGENT_COLORS, calcCost, formatCost, formatNum, THEME } from '../theme';

export const TokenDrawerOverlay: React.FC<{ snapshot: TimelineSnapshot }> = ({ snapshot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Render Slide-over Drawer during Act 5 (frames 1460..1618) OR Final Panorama Summary Badge during Act 6 (1640..1800)
  const heroJob = snapshot.jobs.find((j) => j.id === '004-oauth-pkce-flow');
  if (!heroJob) return null;

  if (snapshot.drawer.openProgress > 0.01) {
    const p = snapshot.drawer.openProgress;
    const translateX = interpolate(p, [0, 1], [920, 0]);
    const total = heroJob.tokens.total || 1;
    const jobCost = formatCost(calcCost(heroJob.tokens.prompt, heroJob.tokens.completion));
    const entries = Object.entries(heroJob.tokens.by_agent);

    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 85,
          background: `rgba(5, 6, 10, ${0.55 * p})`,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <div
          style={{
            width: 900,
            height: '100%',
            background: THEME.panel,
            borderLeft: `1px solid ${THEME.line}`,
            transform: `translateX(${translateX}px)`,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '-24px 0 64px rgba(0,0,0,0.65)',
          }}
        >
          {/* Drawer Header */}
          <div
            style={{
              padding: '92px 28px 16px',
              borderBottom: `1px solid ${THEME.line}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <span style={{ fontFamily: THEME.fontMono, fontSize: 13, color: THEME.muted }}>
                004-oauth-pkce-flow · merged · round 2
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontFamily: THEME.fontMono,
                  fontSize: 11.5,
                  color: THEME.tok,
                  background: 'rgba(241, 250, 140, 0.12)',
                  padding: '3px 9px',
                  borderRadius: 5,
                }}
              >
                🪙 {formatNum(total)} tokens{' '}
                <strong style={{ color: THEME.pass }}>{jobCost}</strong>
                <span style={{ color: THEME.muted, fontSize: 10.5 }}>
                  ({formatNum(heroJob.tokens.prompt)} in · {formatNum(heroJob.tokens.completion)} out)
                </span>
              </span>
            </div>
            <h3 style={{ margin: '4px 0 6px', fontSize: 19, fontWeight: 700, color: THEME.text }}>
              {heroJob.feature}
            </h3>
            <div style={{ fontFamily: THEME.fontMono, fontSize: 12, color: THEME.faint }}>
              {heroJob.branch} → merged into main
            </div>
          </div>

          {/* Drawer Body */}
          <div style={{ display: 'grid', gridTemplateColumns: '210px 1fr', flex: 1 }}>
            {/* Left File Tree */}
            <div
              style={{
                borderRight: `1px solid ${THEME.line}`,
                padding: '16px 12px',
                fontFamily: THEME.fontMono,
                fontSize: 12,
              }}
            >
              <div style={{ fontSize: 10, color: THEME.faint, textTransform: 'uppercase', marginBottom: 6 }}>
                Job Documents
              </div>
              {['spec.md', 'build.md', 'decision.md'].map((f) => (
                <div
                  key={f}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 8px',
                    borderRadius: 6,
                    background: f === 'decision.md' ? THEME.cardHover : 'transparent',
                    color: f === 'decision.md' ? THEME.text : THEME.muted,
                    marginBottom: 2,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: THEME.pass,
                    }}
                  />
                  {f}
                </div>
              ))}

              <div style={{ fontSize: 10, color: THEME.faint, textTransform: 'uppercase', margin: '14px 0 6px' }}>
                Round 1
              </div>
              {[
                ['security', THEME.pass],
                ['ux', THEME.pass],
                ['ui', THEME.changes],
                ['code', THEME.pass],
              ].map(([name, col]) => (
                <div
                  key={`r1-${name}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '5px 8px',
                    color: THEME.muted,
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: col }} />
                  {name}
                </div>
              ))}

              <div style={{ fontSize: 10, color: THEME.faint, textTransform: 'uppercase', margin: '14px 0 6px' }}>
                Round 2
              </div>
              {['security', 'ux', 'ui', 'code'].map((name) => (
                <div
                  key={`r2-${name}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '5px 8px',
                    color: THEME.text,
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: THEME.pass }} />
                  {name}
                </div>
              ))}
            </div>

            {/* Right Token Breakdown + Decision Markdown */}
            <div style={{ padding: '22px 28px' }}>
              {/* Token Widget */}
              <div
                style={{
                  background: THEME.card,
                  border: `1px solid ${THEME.line}`,
                  borderRadius: 10,
                  padding: '14px 16px',
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: THEME.muted,
                    }}
                  >
                    Token Usage & Cost Breakdown
                  </span>
                  <span style={{ fontFamily: THEME.fontMono, fontSize: 14, fontWeight: 700, color: THEME.tok }}>
                    Total: {formatNum(total)}{' '}
                    <span style={{ color: THEME.pass }}>({jobCost})</span>
                  </span>
                </div>

                {/* Stacked Bar */}
                <div
                  style={{
                    height: 8,
                    borderRadius: 4,
                    background: THEME.line,
                    display: 'flex',
                    overflow: 'hidden',
                    marginBottom: 12,
                  }}
                >
                  {entries.map(([ag, st]) => {
                    const pct = Math.max(4, Math.round((st.total / total) * 100));
                    return (
                      <div
                        key={ag}
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          background: AGENT_COLORS[ag] || '#bd93f9',
                        }}
                      />
                    );
                  })}
                </div>

                {/* Legend Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px 18px',
                    fontFamily: THEME.fontMono,
                    fontSize: 11,
                  }}
                >
                  {entries.map(([ag, st]) => {
                    const col = AGENT_COLORS[ag] || '#bd93f9';
                    const agCost = formatCost(calcCost(st.prompt, st.completion));
                    return (
                      <div
                        key={ag}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: 2,
                              background: col,
                            }}
                          />
                          <span style={{ color: THEME.text }}>{ag}</span>
                          <span
                            style={{
                              fontSize: 9.5,
                              padding: '1px 5px',
                              borderRadius: 4,
                              background: 'rgba(255,255,255,0.05)',
                              border: `1px solid ${THEME.line}`,
                              color: THEME.active,
                            }}
                          >
                            {st.model}
                          </span>
                        </span>
                        <span style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                          <strong style={{ color: THEME.text }}>{formatNum(st.total)}</strong>
                          <span style={{ color: THEME.pass, fontWeight: 600 }}>{agCost}</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Rendered decision.md */}
              <div>
                <div
                  style={{
                    display: 'inline-block',
                    fontFamily: THEME.fontMono,
                    fontSize: 12.5,
                    fontWeight: 700,
                    padding: '5px 12px',
                    borderRadius: 6,
                    color: THEME.pass,
                    background: 'rgba(80, 250, 123, 0.15)',
                    marginBottom: 14,
                  }}
                >
                  APPROVE
                </div>
                <h2 style={{ margin: '0 0 10px', fontSize: 18, color: THEME.text }}>
                  Decision: 004-oauth-pkce-flow
                </h2>
                <p style={{ color: THEME.muted, fontSize: 14, lineHeight: 1.6, margin: '0 0 12px' }}>
                  Round 1 UI focus-ring finding (<code style={{ color: THEME.active }}>:focus-visible</code> at
                  375px) was resolved autonomously by <code style={{ color: THEME.active }}>builder</code> in Round 2.
                  All 4 parallel review lenses (<strong style={{ color: THEME.text }}>Security, UX, UI, Code</strong>)
                  report <strong style={{ color: THEME.pass }}>VERDICT: PASS</strong>.
                </p>
                <div
                  style={{
                    background: THEME.terminalBg,
                    border: `1px solid ${THEME.line}`,
                    borderRadius: 8,
                    padding: '10px 14px',
                    fontFamily: THEME.fontMono,
                    fontSize: 12,
                    color: THEME.pass,
                  }}
                >
                  $ git merge --no-ff factory/004-oauth-pkce-flow -m &quot;Merge factory/004-oauth-pkce-flow&quot;
                  <br />$ gh issue close 27 --comment &quot;Resolved by autonomous factory run 004-oauth-pkce-flow.&quot;
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Act 6 Final Outro Banner (frames 1660..1800)
  if (frame >= 1660) {
    const outroEnter = spring({
      frame: frame - 1660,
      fps,
      config: { damping: 16, stiffness: 110 },
    });

    return (
      <div
        style={{
          position: 'absolute',
          right: 36,
          bottom: 262,
          zIndex: 80,
          background: 'rgba(20, 21, 27, 0.96)',
          border: `1.5px solid ${THEME.merged}`,
          borderRadius: 16,
          padding: '20px 26px',
          width: 720,
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.72), 0 0 32px rgba(189, 147, 249, 0.25)',
          transform: `translateY(${interpolate(outroEnter, [0, 1], [24, 0])}px)`,
          opacity: outroEnter,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span
            style={{
              fontFamily: THEME.fontMono,
              fontSize: 11.5,
              fontWeight: 700,
              color: THEME.merged,
              background: 'rgba(189, 147, 249, 0.16)',
              padding: '3px 9px',
              borderRadius: 5,
              border: `1px solid ${THEME.merged}`,
            }}
          >
            SOFTWARE FACTORY FOR GOOGLE ANTIGRAVITY
          </span>
          <span style={{ fontFamily: THEME.fontMono, fontSize: 12, color: THEME.pass, fontWeight: 700 }}>
            ✓ 3 Merged · 2 Active · 1 Needs Human
          </span>
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: THEME.text, marginBottom: 6 }}>
          From Issue to Merged PR — Autonomous Multi-Agent Engineering
        </div>
        <div style={{ fontFamily: THEME.fontMono, fontSize: 12, color: THEME.muted, lineHeight: 1.6 }}>
          spec-writer → builder → [reviewer-security · reviewer-ux · reviewer-ui · reviewer-code] → approver
        </div>
      </div>
    );
  }

  return null;
};

