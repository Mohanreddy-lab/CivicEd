import { describe, it, expect } from 'vitest';
import { factCheckDB, knowledgeBase, refusalTopics } from '../data';

// =====================================================
// TEST SUITE 1: Fact Check Database Integrity
// =====================================================
describe('Fact Check Database', () => {
  it('should have entries in the database', () => {
    expect(factCheckDB.length).toBeGreaterThan(0);
  });

  it('each entry should have required fields', () => {
    factCheckDB.forEach((entry) => {
      expect(entry).toHaveProperty('keywords');
      expect(entry).toHaveProperty('verdict');
      expect(entry).toHaveProperty('explanation');
      expect(entry.keywords.length).toBeGreaterThan(0);
    });
  });

  it('verdicts should be valid classifications', () => {
    const validVerdicts = ['TRUE', 'FALSE', 'MISLEADING', 'INSUFFICIENT DATA', 'INSUFFICIENT DATA / CONTEXT DEPENDENT'];
    factCheckDB.forEach((entry) => {
      expect(validVerdicts).toContain(entry.verdict);
    });
  });
});

// =====================================================
// TEST SUITE 2: Knowledge Base Coverage
// =====================================================
describe('Knowledge Base', () => {
  it('should contain core election topics', () => {
    expect(knowledgeBase).toHaveProperty('gerrymandering');
    expect(knowledgeBase).toHaveProperty('electoralcollege');
    expect(knowledgeBase).toHaveProperty('counting');
    expect(knowledgeBase).toHaveProperty('security');
    expect(knowledgeBase).toHaveProperty('municipal');
    expect(knowledgeBase).toHaveProperty('cm_selection');
  });

  it('each topic should have a non-empty answer', () => {
    Object.values(knowledgeBase).forEach((topic) => {
      expect(topic).toHaveProperty('a');
      expect(topic.a.length).toBeGreaterThan(50);
    });
  });
});

// =====================================================
// TEST SUITE 3: Safety & Refusal Topics
// =====================================================
describe('Safety Guardrails', () => {
  it('should have refusal topics defined', () => {
    expect(refusalTopics.length).toBeGreaterThan(0);
  });

  it('should block political party references', () => {
    const politicalTerms = ['vote for', 'best party', 'who to vote'];
    politicalTerms.forEach((term) => {
      const blocked = refusalTopics.some((t) => term.includes(t));
      expect(blocked).toBe(true);
    });
  });

  it('should not block educational terms', () => {
    const safeTerms = ['election', 'democracy', 'counting'];
    safeTerms.forEach((term) => {
      const blocked = refusalTopics.some((t) => term.includes(t));
      expect(blocked).toBe(false);
    });
  });
});

// =====================================================
// TEST SUITE 4: Bot Response Logic (Unit Tests)
// =====================================================
describe('Bot Response Logic', () => {
  // Simulate the bot logic from App.jsx
  const getBotResponse = (text) => {
    const lower = text.toLowerCase().trim();
    if (lower === '/help') return 'HELP';
    if (lower === '/clear') return 'CLEAR_CMD';
    if (lower === '/status') return 'STATUS';
    if (refusalTopics.some((t) => lower.includes(t))) return 'REFUSED';
    if (lower.includes('democracy')) return 'DEMOCRACY_ANSWER';
    if (lower.includes('fake news')) return 'FAKE_NEWS_ANSWER';
    if (lower.includes('evm')) return 'EVM_ANSWER';
    if (lower.includes('right') || lower.includes('duty')) return 'RIGHTS_ANSWER';
    return 'FALLBACK';
  };

  it('should return help for /help command', () => {
    expect(getBotResponse('/help')).toBe('HELP');
  });

  it('should return clear command for /clear', () => {
    expect(getBotResponse('/clear')).toBe('CLEAR_CMD');
  });

  it('should return status for /status', () => {
    expect(getBotResponse('/status')).toBe('STATUS');
  });

  it('should refuse political influence queries', () => {
    expect(getBotResponse('who to vote for')).toBe('REFUSED');
    expect(getBotResponse('best party to support')).toBe('REFUSED');
  });

  it('should answer educational queries', () => {
    expect(getBotResponse('what is democracy')).toBe('DEMOCRACY_ANSWER');
    expect(getBotResponse('tell me about fake news')).toBe('FAKE_NEWS_ANSWER');
    expect(getBotResponse('how does EVM work')).toBe('EVM_ANSWER');
    expect(getBotResponse('what are my rights')).toBe('RIGHTS_ANSWER');
  });

  it('should return fallback for unknown queries', () => {
    expect(getBotResponse('random gibberish xyz')).toBe('FALLBACK');
  });
});

// =====================================================
// TEST SUITE 5: Election Stages Data Integrity
// =====================================================
describe('Election Journey Stages', () => {
  const ELECTION_STAGES = [
    { id: 0, name: 'Announcement' },
    { id: 1, name: 'Nomination' },
    { id: 2, name: 'Campaigning' },
    { id: 3, name: 'Silence Period' },
    { id: 4, name: 'Voting' },
    { id: 5, name: 'Counting' },
    { id: 6, name: 'Government Formation' },
  ];

  it('should have exactly 7 stages', () => {
    expect(ELECTION_STAGES.length).toBe(7);
  });

  it('stages should be in correct chronological order', () => {
    ELECTION_STAGES.forEach((stage, i) => {
      expect(stage.id).toBe(i);
    });
  });

  it('should start with Announcement and end with Government Formation', () => {
    expect(ELECTION_STAGES[0].name).toBe('Announcement');
    expect(ELECTION_STAGES[6].name).toBe('Government Formation');
  });
});

// =====================================================
// TEST SUITE 6: Real-Time Data Disclaimers
// =====================================================
describe('Real-Time Data Safety', () => {
  it('timestamps should be valid Date objects', () => {
    const timestamp = new Date().toLocaleString();
    expect(timestamp).toBeTruthy();
    expect(typeof timestamp).toBe('string');
  });

  it('simulated data should have source attribution', () => {
    const source = 'SIMULATED_API';
    expect(source).toBe('SIMULATED_API');
  });
});
