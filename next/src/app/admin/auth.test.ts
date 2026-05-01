import { test } from 'node:test';
import assert from 'node:assert/strict';

import { checkAdminToken } from './auth.ts';

const ORIG = process.env.ADMIN_TOKEN;

function withEnv(value: string | undefined, fn: () => void) {
  const prev = process.env.ADMIN_TOKEN;
  if (value === undefined) delete process.env.ADMIN_TOKEN;
  else process.env.ADMIN_TOKEN = value;
  try {
    fn();
  } finally {
    if (prev === undefined) delete process.env.ADMIN_TOKEN;
    else process.env.ADMIN_TOKEN = prev;
  }
}

test('returns false when ADMIN_TOKEN env is unset', () => {
  withEnv(undefined, () => {
    assert.equal(checkAdminToken('anything'), false);
  });
});

test('returns false when ADMIN_TOKEN env is empty string', () => {
  withEnv('', () => {
    assert.equal(checkAdminToken('anything'), false);
  });
});

test('returns false when supplied is null', () => {
  withEnv('correct-token', () => {
    assert.equal(checkAdminToken(null), false);
  });
});

test('returns false when supplied is undefined', () => {
  withEnv('correct-token', () => {
    assert.equal(checkAdminToken(undefined), false);
  });
});

test('returns false when supplied is empty', () => {
  withEnv('correct-token', () => {
    assert.equal(checkAdminToken(''), false);
  });
});

test('returns true on exact match', () => {
  withEnv('correct-token-32chars-wow-its-long', () => {
    assert.equal(
      checkAdminToken('correct-token-32chars-wow-its-long'),
      true
    );
  });
});

test('returns false on length mismatch (shorter)', () => {
  withEnv('correct-token', () => {
    assert.equal(checkAdminToken('correct'), false);
  });
});

test('returns false on length mismatch (longer)', () => {
  withEnv('correct-token', () => {
    assert.equal(checkAdminToken('correct-token-extra'), false);
  });
});

test('returns false on same-length partial mismatch', () => {
  withEnv('correct-token', () => {
    assert.equal(checkAdminToken('correct-tokeN'), false);
  });
});

test('case sensitive', () => {
  withEnv('CorrectToken', () => {
    assert.equal(checkAdminToken('correcttoken'), false);
    assert.equal(checkAdminToken('CorrectToken'), true);
  });
});

// restore on exit
process.on('exit', () => {
  if (ORIG === undefined) delete process.env.ADMIN_TOKEN;
  else process.env.ADMIN_TOKEN = ORIG;
});
