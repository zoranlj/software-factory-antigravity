import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { THEME } from '../theme';

function usePop(delayFrames: number, stiffness = 240, damping = 13) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - delayFrames,
    fps,
    config: { stiffness, damping, mass: 0.8 },
  });
  const y = interpolate(s, [0, 1], [45, 0]);
  const opacity = interpolate(frame - delayFrames, [0, 5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return { scale: s, y, opacity };
}

/**
 * BEAT 1 (0..195): Big Pop-Up Intro + /factory Command + Git Worktree Isolation
 */
export const Beat1IntroExplainer: React.FC = () => {
  const p1 = usePop(2);
  const p2 = usePop(14);
  const p3 = usePop(32);
  const p4 = usePop(54);
  const p5 = usePop(82);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 90,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 80px',
        textAlign: 'center',
      }}
    >
      {/* Top Pill */}
      <div
        style={{
          fontFamily: THEME.fontMono,
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: '0.18em',
          color: THEME.active,
          background: 'rgba(139, 233, 253, 0.14)',
          border: `2px solid ${THEME.active}`,
          padding: '10px 28px',
          borderRadius: 999,
          marginBottom: 22,
          transform: `translateY(${p1.y}px) scale(${p1.scale})`,
          opacity: p1.opacity,
        }}
      >
        HOW GOOGLE ANTIGRAVITY SOFTWARE FACTORY WORKS
      </div>

      {/* Giant Pop Headline */}
      <div
        style={{
          fontSize: 108,
          fontWeight: 900,
          letterSpacing: '-0.04em',
          lineHeight: 0.96,
          color: THEME.text,
          transform: `translateY(${p2.y}px) scale(${p2.scale})`,
          opacity: p2.opacity,
        }}
      >
        1 COMMAND.{' '}
        <span style={{ color: THEME.pass }}>7 AI AGENTS.</span>
      </div>

      <div
        style={{
          fontSize: 96,
          fontWeight: 900,
          letterSpacing: '-0.04em',
          lineHeight: 1.04,
          color: THEME.merged,
          marginBottom: 34,
          transform: `translateY(${p3.y}px) scale(${p3.scale})`,
          opacity: p3.opacity,
        }}
      >
        ISSUE → MERGED PR
      </div>

      {/* Big Command Box Pop-Up */}
      <div
        style={{
          background: THEME.terminalBg,
          border: `3px solid ${THEME.active}`,
          borderRadius: 18,
          padding: '24px 42px',
          fontFamily: THEME.fontMono,
          fontSize: 34,
          fontWeight: 700,
          color: THEME.text,
          boxShadow: '0 20px 60px rgba(0,0,0,0.65), 0 0 40px rgba(139, 233, 253, 0.25)',
          transform: `translateY(${p4.y}px) scale(${p4.scale})`,
          opacity: p4.opacity,
          marginBottom: 30,
        }}
      >
        <span style={{ color: THEME.pass }}>❯</span>{' '}
        <span style={{ color: THEME.active }}>/factory</span> Issue #27: OAuth 2.1 PKCE login
      </div>

      {/* Isolated Worktree Callout Cards */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          transform: `translateY(${p5.y}px) scale(${p5.scale})`,
          opacity: p5.opacity,
        }}
      >
        <div
          style={{
            background: THEME.panel,
            border: `2px solid ${THEME.merged}`,
            borderRadius: 14,
            padding: '18px 28px',
            fontFamily: THEME.fontMono,
            fontSize: 24,
            fontWeight: 800,
            color: THEME.merged,
          }}
        >
          main branch stays 100% clean
        </div>
        <span style={{ fontSize: 42, fontWeight: 900, color: THEME.active }}>→</span>
        <div
          style={{
            background: 'rgba(80, 250, 123, 0.14)',
            border: `2px solid ${THEME.pass}`,
            borderRadius: 14,
            padding: '18px 28px',
            fontFamily: THEME.fontMono,
            fontSize: 24,
            fontWeight: 800,
            color: THEME.pass,
          }}
        >
          Spawns isolated Git Worktree: factory/004-oauth-pkce-flow
        </div>
      </div>
    </div>
  );
};

/**
 * BEAT 2 EXPLAINER (195..305): Step 1 Spec-Writer & Step 2 Builder
 */
export const Beat2SpecBuildExplainer: React.FC = () => {
  const pHead = usePop(2);
  const pCard1 = usePop(14);
  const pArrow = usePop(28);
  const pCard2 = usePop(36);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 90,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 70px',
      }}
    >
      <div
        style={{
          fontSize: 88,
          fontWeight: 900,
          letterSpacing: '-0.03em',
          color: THEME.text,
          marginBottom: 42,
          transform: `translateY(${pHead.y}px) scale(${pHead.scale})`,
          opacity: pHead.opacity,
          textAlign: 'center',
        }}
      >
        FIRST: <span style={{ color: '#bd93f9' }}>SPEC</span> THEN{' '}
        <span style={{ color: THEME.active }}>BUILD</span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: 28,
          width: '100%',
          maxWidth: 1680,
        }}
      >
        {/* Step 1: Spec-Writer */}
        <div
          style={{
            background: THEME.panel,
            border: `3px solid #bd93f9`,
            borderRadius: 22,
            padding: '38px 40px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 40px rgba(189, 147, 249, 0.22)',
            transform: `translateY(${pCard1.y}px) scale(${pCard1.scale})`,
            opacity: pCard1.opacity,
          }}
        >
          <div
            style={{
              fontFamily: THEME.fontMono,
              fontSize: 22,
              fontWeight: 800,
              color: '#bd93f9',
              marginBottom: 12,
            }}
          >
            AGENT 1 · SPEC-WRITER
          </div>
          <div style={{ fontSize: 54, fontWeight: 900, color: THEME.text, lineHeight: 1.05, marginBottom: 18 }}>
            Drafts Testable Spec
          </div>
          <div style={{ fontFamily: THEME.fontMono, fontSize: 22, color: THEME.muted, lineHeight: 1.6 }}>
            • Reads GitHub Issue &amp; codebase
            <br />• Writes <span style={{ color: THEME.tok, fontWeight: 700 }}>spec.md</span> contract
            <br />• Defines 6 strict acceptance criteria
          </div>
        </div>

        {/* Giant Arrow */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: THEME.active,
            transform: `scale(${pArrow.scale})`,
            opacity: pArrow.opacity,
          }}
        >
          ➔
        </div>

        {/* Step 2: Builder */}
        <div
          style={{
            background: THEME.panel,
            border: `3px solid ${THEME.active}`,
            borderRadius: 22,
            padding: '38px 40px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 40px rgba(139, 233, 253, 0.22)',
            transform: `translateY(${pCard2.y}px) scale(${pCard2.scale})`,
            opacity: pCard2.opacity,
          }}
        >
          <div
            style={{
              fontFamily: THEME.fontMono,
              fontSize: 22,
              fontWeight: 800,
              color: THEME.active,
              marginBottom: 12,
            }}
          >
            AGENT 2 · BUILDER
          </div>
          <div style={{ fontSize: 54, fontWeight: 900, color: THEME.text, lineHeight: 1.05, marginBottom: 18 }}>
            Codes &amp; Visual-Tests
          </div>
          <div style={{ fontFamily: THEME.fontMono, fontSize: 22, color: THEME.muted, lineHeight: 1.6 }}>
            • Writes code in isolated worktree
            <br />• Runs test suite + <span style={{ color: THEME.pass, fontWeight: 700 }}>browser_subagent</span>
            <br />• Outputs <span style={{ color: THEME.pass, fontWeight: 700 }}>STATUS: READY</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * BEAT 3 EXPLAINER (390..570): 4x Parallel Review Agents
 */
export const Beat3ParallelReviewExplainer: React.FC = () => {
  const pHead = usePop(2);
  const pSub = usePop(12);
  const c1 = usePop(24);
  const c2 = usePop(34);
  const c3 = usePop(44);
  const c4 = usePop(54);
  const pAlert = usePop(95, 280, 11);

  const cards = [
    {
      pop: c1,
      agent: 'reviewer-security',
      label: 'SECURITY LENS',
      desc: 'OWASP · Secrets · PKCE S256 entropy',
      color: '#ff79c6',
      verdict: 'PASS ✓',
      verdictColor: THEME.pass,
    },
    {
      pop: c2,
      agent: 'reviewer-ux',
      label: 'UX LENS (PORT 5142)',
      desc: 'Loading states · Error recovery · A11y',
      color: '#f1fa8c',
      verdict: 'PASS ✓',
      verdictColor: THEME.pass,
    },
    {
      pop: c3,
      agent: 'reviewer-ui',
      label: 'UI LENS (PORT 5141)',
      desc: 'Desktop 1440px & Mobile 375px tokens',
      color: '#ffb86c',
      verdict: 'CHANGES ✗',
      verdictColor: THEME.changes,
    },
    {
      pop: c4,
      agent: 'reviewer-code',
      label: 'CODE LENS',
      desc: 'Idioms · Complexity · 52/52 unit tests',
      color: '#50fa7b',
      verdict: 'PASS ✓',
      verdictColor: THEME.pass,
    },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 90,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 70px',
      }}
    >
      <div
        style={{
          fontSize: 92,
          fontWeight: 900,
          letterSpacing: '-0.04em',
          color: THEME.text,
          lineHeight: 1,
          marginBottom: 10,
          transform: `translateY(${pHead.y}px) scale(${pHead.scale})`,
          opacity: pHead.opacity,
        }}
      >
        4 REVIEW AGENTS RUN <span style={{ color: THEME.active }}>IN PARALLEL</span>
      </div>

      <div
        style={{
          fontFamily: THEME.fontMono,
          fontSize: 25,
          fontWeight: 700,
          color: THEME.muted,
          marginBottom: 30,
          transform: `translateY(${pSub.y}px) scale(${pSub.scale})`,
          opacity: pSub.opacity,
        }}
      >
        Every build is audited simultaneously across 4 specialized lenses:
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 22,
          width: '100%',
          maxWidth: 1640,
        }}
      >
        {cards.map((c) => (
          <div
            key={c.agent}
            style={{
              background: THEME.panel,
              border: `3px solid ${c.color}`,
              borderRadius: 18,
              padding: '24px 30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transform: `translateY(${c.pop.y}px) scale(${c.pop.scale})`,
              opacity: c.pop.opacity,
              boxShadow: '0 18px 44px rgba(0,0,0,0.55)',
            }}
          >
            <div>
              <div style={{ fontFamily: THEME.fontMono, fontSize: 20, fontWeight: 800, color: c.color }}>
                {c.agent}
              </div>
              <div style={{ fontSize: 40, fontWeight: 900, color: THEME.text, margin: '4px 0' }}>
                {c.label}
              </div>
              <div style={{ fontFamily: THEME.fontMono, fontSize: 19, color: THEME.muted }}>
                {c.desc}
              </div>
            </div>

            <div
              style={{
                fontFamily: THEME.fontMono,
                fontSize: 32,
                fontWeight: 900,
                padding: '12px 22px',
                borderRadius: 12,
                background: `${c.verdictColor}22`,
                border: `3px solid ${c.verdictColor}`,
                color: c.verdictColor,
              }}
            >
              {c.verdict}
            </div>
          </div>
        ))}
      </div>

      {/* Giant Pop-Up Alert Banner */}
      <div
        style={{
          marginTop: 28,
          background: 'rgba(255, 184, 108, 0.2)',
          border: `3px solid ${THEME.changes}`,
          borderRadius: 16,
          padding: '16px 36px',
          fontFamily: THEME.fontMono,
          fontSize: 28,
          fontWeight: 900,
          color: THEME.changes,
          boxShadow: '0 16px 48px rgba(255, 184, 108, 0.35)',
          transform: `translateY(${pAlert.y}px) scale(${pAlert.scale})`,
          opacity: pAlert.opacity,
        }}
      >
        ⚠ UI LENS FOUND MISSING :focus-visible RING AT 375px → TRIGGERS AUTO-REWORK!
      </div>
    </div>
  );
};

/**
 * BEAT 4 EXPLAINER (690..855): Autonomous Rework Loop
 */
export const Beat4ReworkExplainer: React.FC = () => {
  const p1 = usePop(2);
  const p2 = usePop(16);
  const p3 = usePop(34);
  const p4 = usePop(56);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 90,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 80px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: THEME.fontMono,
          fontSize: 24,
          fontWeight: 900,
          color: THEME.changes,
          background: 'rgba(255, 184, 108, 0.16)',
          border: `2.5px solid ${THEME.changes}`,
          padding: '8px 26px',
          borderRadius: 999,
          marginBottom: 20,
          transform: `translateY(${p1.y}px) scale(${p1.scale})`,
          opacity: p1.opacity,
        }}
      >
        ↺ SELF-HEALING FEEDBACK LOOP (MAX 2 RESUMES)
      </div>

      <div
        style={{
          fontSize: 102,
          fontWeight: 900,
          letterSpacing: '-0.04em',
          lineHeight: 0.98,
          color: THEME.text,
          marginBottom: 34,
          transform: `translateY(${p2.y}px) scale(${p2.scale})`,
          opacity: p2.opacity,
        }}
      >
        ANY <span style={{ color: THEME.changes }}>CHANGES</span>?{' '}
        <span style={{ color: THEME.active }}>BUILDER AUTO-FIXES IT.</span>
      </div>

      {/* 3-Step Horizontal Rework Flow */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          transform: `translateY(${p3.y}px) scale(${p3.scale})`,
          opacity: p3.opacity,
          marginBottom: 34,
        }}
      >
        <div
          style={{
            background: THEME.panel,
            border: `3px solid ${THEME.changes}`,
            borderRadius: 18,
            padding: '26px 32px',
            width: 460,
          }}
        >
          <div style={{ fontFamily: THEME.fontMono, fontSize: 20, color: THEME.changes, fontWeight: 800 }}>
            1. READ REVIEW FINDINGS
          </div>
          <div style={{ fontSize: 36, fontWeight: 900, color: THEME.text, marginTop: 8 }}>
            round-1/review-ui.md
          </div>
        </div>

        <span style={{ fontSize: 58, fontWeight: 900, color: THEME.changes }}>➔</span>

        <div
          style={{
            background: THEME.panel,
            border: `3px solid ${THEME.active}`,
            borderRadius: 18,
            padding: '26px 32px',
            width: 480,
          }}
        >
          <div style={{ fontFamily: THEME.fontMono, fontSize: 20, color: THEME.active, fontWeight: 800 }}>
            2. PATCH &amp; VERIFY IN BROWSER
          </div>
          <div style={{ fontSize: 36, fontWeight: 900, color: THEME.text, marginTop: 8 }}>
            Adds 2px focus ring token
          </div>
        </div>

        <span style={{ fontSize: 58, fontWeight: 900, color: THEME.pass }}>➔</span>

        <div
          style={{
            background: THEME.panel,
            border: `3px solid ${THEME.pass}`,
            borderRadius: 18,
            padding: '26px 32px',
            width: 460,
          }}
        >
          <div style={{ fontFamily: THEME.fontMono, fontSize: 20, color: THEME.pass, fontWeight: 800 }}>
            3. RE-RUN ALL 4 REVIEWERS
          </div>
          <div style={{ fontSize: 36, fontWeight: 900, color: THEME.pass, marginTop: 8 }}>
            Round 2: 4/4 PASS! ✓
          </div>
        </div>
      </div>

      <div
        style={{
          fontSize: 46,
          fontWeight: 900,
          color: THEME.pass,
          background: 'rgba(80, 250, 123, 0.14)',
          border: `3px solid ${THEME.pass}`,
          padding: '16px 42px',
          borderRadius: 16,
          transform: `translateY(${p4.y}px) scale(${p4.scale})`,
          opacity: p4.opacity,
        }}
      >
        ZERO HUMAN INTERVENTION NEEDED
      </div>
    </div>
  );
};

/**
 * BEAT 5 EXPLAINER (960..1085): Approver Gate vs Needs-Human Escalation
 */
export const Beat5ApproveMergeExplainer: React.FC = () => {
  const pHead = usePop(2);
  const pApprove = usePop(18);
  const pEscalate = usePop(36);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 90,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 80px',
      }}
    >
      <div
        style={{
          fontSize: 94,
          fontWeight: 900,
          letterSpacing: '-0.04em',
          color: THEME.text,
          marginBottom: 38,
          transform: `translateY(${pHead.y}px) scale(${pHead.scale})`,
          opacity: pHead.opacity,
          textAlign: 'center',
        }}
      >
        FINAL GATE: <span style={{ color: THEME.pass }}>APPROVER AGENT</span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 32,
          width: '100%',
          maxWidth: 1640,
        }}
      >
        {/* Left: All Pass -> Merge */}
        <div
          style={{
            background: THEME.panel,
            border: `3px solid ${THEME.pass}`,
            borderRadius: 22,
            padding: '36px 40px',
            transform: `translateY(${pApprove.y}px) scale(${pApprove.scale})`,
            opacity: pApprove.opacity,
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{ fontFamily: THEME.fontMono, fontSize: 22, fontWeight: 900, color: THEME.pass }}>
            ✓ WHEN ALL 4 REVIEWERS PASS
          </div>
          <div style={{ fontSize: 56, fontWeight: 900, color: THEME.text, margin: '10px 0 16px' }}>
            Auto-Merges to main
          </div>
          <div style={{ fontFamily: THEME.fontMono, fontSize: 22, color: THEME.muted, lineHeight: 1.6 }}>
            • Verifies git diff against spec.md
            <br />• Runs <span style={{ color: THEME.pass }}>git merge --no-ff</span>
            <br />• Removes worktree &amp; closes GitHub issue
          </div>
        </div>

        {/* Right: 3 Rounds Exhausted -> Needs Human */}
        <div
          style={{
            background: THEME.panel,
            border: `3px solid ${THEME.human}`,
            borderRadius: 22,
            padding: '36px 40px',
            transform: `translateY(${pEscalate.y}px) scale(${pEscalate.scale})`,
            opacity: pEscalate.opacity,
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{ fontFamily: THEME.fontMono, fontSize: 22, fontWeight: 900, color: THEME.human }}>
            ⚑ SAFETY VALVE (IF 3 ROUNDS EXHAUSTED)
          </div>
          <div style={{ fontSize: 56, fontWeight: 900, color: THEME.text, margin: '10px 0 16px' }}>
            Escalates to Human
          </div>
          <div style={{ fontFamily: THEME.fontMono, fontSize: 22, color: THEME.muted, lineHeight: 1.6 }}>
            • Pauses card in <span style={{ color: THEME.human }}>Needs human</span> column
            <br />• Run <span style={{ color: THEME.active }}>/factory approve &lt;id&gt;</span>
            <br />• Or <span style={{ color: THEME.changes }}>/factory rework &lt;id&gt; &lt;note&gt;</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * BEAT 6 OUTRO (1170..1350): Giant Full-Screen Pipeline Summary
 */
export const Beat6KineticOutro: React.FC = () => {
  const p1 = usePop(2);
  const p2 = usePop(14);
  const p3 = usePop(28);
  const p4 = usePop(44);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 90,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 70px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: THEME.fontMono,
          fontSize: 22,
          fontWeight: 900,
          letterSpacing: '0.16em',
          color: THEME.pass,
          background: 'rgba(80, 250, 123, 0.14)',
          border: `2px solid ${THEME.pass}`,
          padding: '8px 26px',
          borderRadius: 999,
          marginBottom: 20,
          transform: `translateY(${p1.y}px) scale(${p1.scale})`,
          opacity: p1.opacity,
        }}
      >
        SOFTWARE FACTORY FOR GOOGLE ANTIGRAVITY
      </div>

      <div
        style={{
          fontSize: 106,
          fontWeight: 900,
          letterSpacing: '-0.04em',
          lineHeight: 0.96,
          color: THEME.text,
          marginBottom: 14,
          transform: `translateY(${p2.y}px) scale(${p2.scale})`,
          opacity: p2.opacity,
        }}
      >
        SHIP FEATURES <span style={{ color: THEME.active }}>AUTONOMOUSLY.</span>
      </div>

      {/* Giant Pipeline Strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          margin: '28px 0 36px',
          transform: `translateY(${p3.y}px) scale(${p3.scale})`,
          opacity: p3.opacity,
        }}
      >
        {[
          ['ISSUE', THEME.text],
          ['SPEC-WRITER', '#bd93f9'],
          ['BUILDER', THEME.active],
          ['4× REVIEW', THEME.changes],
          ['APPROVER', '#bd93f9'],
          ['MERGED', THEME.pass],
        ].map(([label, col], idx) => (
          <React.Fragment key={label}>
            <div
              style={{
                fontFamily: THEME.fontMono,
                fontSize: 26,
                fontWeight: 900,
                padding: '16px 24px',
                borderRadius: 14,
                background: THEME.panel,
                border: `3px solid ${col}`,
                color: col,
              }}
            >
              {label}
            </div>
            {idx < 5 && (
              <span style={{ fontSize: 36, fontWeight: 900, color: THEME.muted }}>→</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Big Command CTA */}
      <div
        style={{
          background: THEME.terminalBg,
          border: `3px solid ${THEME.merged}`,
          borderRadius: 18,
          padding: '20px 44px',
          fontFamily: THEME.fontMono,
          fontSize: 36,
          fontWeight: 800,
          color: THEME.text,
          transform: `translateY(${p4.y}px) scale(${p4.scale})`,
          opacity: p4.opacity,
          boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
        }}
      >
        <span style={{ color: THEME.pass }}>❯</span>{' '}
        <span style={{ color: THEME.active }}>/factory</span> &lt;feature-or-issue&gt;
      </div>
    </div>
  );
};

/**
 * GIANT POP-UP CALLOUT OVERLAY FOR DASHBOARD BURSTS
 */
export const GiantDashboardCallout: React.FC<{
  badge: string;
  headline: string;
  sub: string;
  color: string;
  position?: 'top-right' | 'bottom-left' | 'center-bottom';
}> = ({ badge, headline, sub, color, position = 'top-right' }) => {
  const pop = usePop(3, 260, 12);

  const posStyle: React.CSSProperties =
    position === 'top-right'
      ? { top: 105, right: 44 }
      : position === 'bottom-left'
      ? { bottom: 265, left: 44 }
      : { bottom: 265, left: 420 };

  return (
    <div
      style={{
        position: 'absolute',
        ...posStyle,
        zIndex: 88,
        background: 'rgba(16, 18, 26, 0.96)',
        border: `4px solid ${color}`,
        borderRadius: 20,
        padding: '22px 34px',
        maxWidth: 880,
        boxShadow: `0 24px 64px rgba(0,0,0,0.8), 0 0 40px ${color}44`,
        transform: `translateY(${pop.y}px) scale(${pop.scale})`,
        opacity: pop.opacity,
      }}
    >
      <div
        style={{
          fontFamily: THEME.fontMono,
          fontSize: 20,
          fontWeight: 900,
          color,
          letterSpacing: '0.08em',
          marginBottom: 6,
        }}
      >
        ★ {badge}
      </div>
      <div
        style={{
          fontSize: 48,
          fontWeight: 900,
          color: THEME.text,
          lineHeight: 1.06,
          letterSpacing: '-0.02em',
          marginBottom: 8,
        }}
      >
        {headline}
      </div>
      <div
        style={{
          fontFamily: THEME.fontMono,
          fontSize: 21,
          fontWeight: 600,
          color: THEME.muted,
        }}
      >
        {sub}
      </div>
    </div>
  );
};

