import React from 'react';
import { TimelineSnapshot } from '../data/factoryTimeline';
import { AGENT_COLORS, calcCost, formatCost, formatNum, THEME } from '../theme';

export const LiveConsoleDock: React.FC<{ snapshot: TimelineSnapshot }> = ({ snapshot }) => {
  // Compute active tabs from active agents across jobs
  const activeTabs: { id: string; label: string; color: string }[] = [];
  for (const job of snapshot.jobs) {
    const num = job.id.split('-')[0];
    for (const ag of job.active_agents) {
      activeTabs.push({
        id: `${job.id}_${ag}`,
        label: `${num} · ${ag}`,
        color: AGENT_COLORS[ag] || THEME.active,
      });
    }
  }

  let totalTokens = 0;
  let promptTokens = 0;
  let completionTokens = 0;
  for (const j of snapshot.jobs) {
    totalTokens += j.tokens.total;
    promptTokens += j.tokens.prompt;
    completionTokens += j.tokens.completion;
  }
  const totalCost = calcCost(promptTokens, completionTokens);

  // Keep latest 7 lines visible in the terminal dock
  const visibleLogs = snapshot.logs.slice(-7);

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 240,
        zIndex: 60,
        background: THEME.terminalBg,
        borderTop: `1px solid ${THEME.line}`,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.5)',
      }}
    >
      {/* Dock Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '7px 24px',
          background: THEME.panel,
          borderBottom: `1px solid ${THEME.terminalLine}`,
          minHeight: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              color: THEME.text,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: activeTabs.length > 0 ? THEME.pass : THEME.faint,
                boxShadow: activeTabs.length > 0 ? `0 0 8px ${THEME.pass}` : 'none',
              }}
            />
            Live Agent Output
          </span>

          <span
            style={{
              fontFamily: THEME.fontMono,
              fontSize: 11,
              padding: '2px 8px',
              borderRadius: 4,
              background:
                activeTabs.length > 0 ? 'rgba(139, 233, 253, 0.15)' : THEME.card,
              color: activeTabs.length > 0 ? THEME.active : THEME.muted,
            }}
          >
            {activeTabs.length > 0 ? `${activeTabs.length} Running` : 'Idle'}
          </span>

          <span
            style={{
              fontFamily: THEME.fontMono,
              fontSize: 11,
              color: THEME.tok,
            }}
          >
            🪙 {formatNum(totalTokens)} tok · {formatCost(totalCost)}
          </span>
        </div>

        {/* Agent Log Stream Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
          <div
            style={{
              fontFamily: THEME.fontMono,
              fontSize: 11.5,
              padding: '3px 10px',
              borderRadius: 5,
              background: THEME.cardHover,
              color: THEME.text,
              border: `1px solid ${THEME.line}`,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
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
            All Active Logs
          </div>

          {activeTabs.slice(0, 5).map((tab) => (
            <div
              key={tab.id}
              style={{
                fontFamily: THEME.fontMono,
                fontSize: 11,
                padding: '3px 9px',
                borderRadius: 5,
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${THEME.line}`,
                color: THEME.muted,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: tab.color,
                }}
              />
              {tab.label}
            </div>
          ))}
        </div>

        {/* Right Dock Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontFamily: THEME.fontMono,
            fontSize: 11,
            color: THEME.muted,
          }}
        >
          <span>☑ Auto-scroll</span>
          <span
            style={{
              border: `1px solid ${THEME.line}`,
              borderRadius: 4,
              padding: '2px 7px',
            }}
          >
            ▲
          </span>
          <span
            style={{
              border: `1px solid ${THEME.line}`,
              borderRadius: 4,
              padding: '2px 7px',
            }}
          >
            ⛶
          </span>
        </div>
      </div>

      {/* Terminal Body */}
      <div
        style={{
          flex: 1,
          padding: '12px 24px',
          fontFamily: THEME.fontMono,
          fontSize: 12.5,
          lineHeight: 1.65,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        {visibleLogs.map((log, i) => {
          const agColor = AGENT_COLORS[log.agent] || THEME.active;
          let msgColor = '#d6deeb';
          if (log.tone === 'pass') msgColor = THEME.pass;
          else if (log.tone === 'warn') msgColor = THEME.changes;
          else if (log.tone === 'err') msgColor = THEME.human;
          else if (log.tone === 'tok') msgColor = THEME.tok;

          return (
            <div key={`${log.frame}-${i}`} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ color: THEME.faint }}>[{log.jobNum}]</span>
              <span style={{ color: THEME.faint }}>[{log.time}]</span>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0 5px',
                  borderRadius: 3,
                  fontSize: 11.5,
                  background: `${agColor}24`,
                  color: agColor,
                  fontWeight: 600,
                }}
              >
                [{log.agent}]
              </span>
              <span style={{ color: msgColor }}>{log.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

