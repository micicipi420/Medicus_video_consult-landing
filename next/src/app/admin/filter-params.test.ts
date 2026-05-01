import { test } from 'node:test';
import assert from 'node:assert/strict';

import { parseFilterParams, isAnyFilterActive } from './filter-parsing.ts';

test('empty input returns all-null defaults', () => {
  const r = parseFilterParams({});
  assert.equal(r.from, null);
  assert.equal(r.to, null);
  assert.equal(r.spec, null);
  assert.equal(r.status, null);
  assert.equal(r.page, 1);
});

test('valid from date', () => {
  const r = parseFilterParams({ from: '2026-04-01' });
  assert.ok(r.from instanceof Date);
  assert.equal(r.from?.getUTCFullYear(), 2026);
  assert.equal(r.from?.getUTCMonth(), 3);
  assert.equal(r.from?.getUTCDate(), 1);
  assert.equal(r.from?.getUTCHours(), 0);
});

test('to date is end-of-day inclusive', () => {
  const r = parseFilterParams({ to: '2026-04-30' });
  assert.ok(r.to instanceof Date);
  assert.equal(r.to?.getUTCHours(), 23);
  assert.equal(r.to?.getUTCMinutes(), 59);
  assert.equal(r.to?.getUTCSeconds(), 59);
  assert.equal(r.to?.getUTCMilliseconds(), 999);
});

test('garbage date returns null', () => {
  assert.equal(parseFilterParams({ from: 'garbage' }).from, null);
  assert.equal(parseFilterParams({ from: '2026-13-99' }).from, null);
  assert.equal(parseFilterParams({ from: '04-01-2026' }).from, null);
});

test('spec whitelist accepts known Russian values', () => {
  assert.equal(parseFilterParams({ spec: 'Чек-ап' }).spec, 'Чек-ап');
  assert.equal(
    parseFilterParams({ spec: 'Лечение за рубежом' }).spec,
    'Лечение за рубежом'
  );
});

test('spec whitelist rejects unknown / English keys', () => {
  assert.equal(parseFilterParams({ spec: 'unknown-string' }).spec, null);
  assert.equal(parseFilterParams({ spec: 'checkup' }).spec, null);
});

test('status whitelist', () => {
  assert.equal(parseFilterParams({ status: 'new' }).status, 'new');
  assert.equal(parseFilterParams({ status: 'contacted' }).status, 'contacted');
  assert.equal(parseFilterParams({ status: 'completed' }).status, 'completed');
  assert.equal(parseFilterParams({ status: 'invalid' }).status, null);
  assert.equal(parseFilterParams({ status: '' }).status, null);
});

test('page parser', () => {
  assert.equal(parseFilterParams({ page: '5' }).page, 5);
  assert.equal(parseFilterParams({ page: '-3' }).page, 1);
  assert.equal(parseFilterParams({ page: 'NaN' }).page, 1);
  assert.equal(parseFilterParams({ page: '' }).page, 1);
  assert.equal(parseFilterParams({ page: '0' }).page, 1);
});

// buildWhere is exercised in manual smoke (Task 4) — its return value is a
// Drizzle SQL chunk that requires the schema module which uses path aliases
// node:test doesn't resolve. parseFilterParams is the high-value pure unit.

test('isAnyFilterActive', () => {
  assert.equal(
    isAnyFilterActive({ from: null, to: null, spec: null, status: null, page: 1 }),
    false
  );
  assert.equal(
    isAnyFilterActive({ from: new Date(), to: null, spec: null, status: null, page: 1 }),
    true
  );
  assert.equal(
    isAnyFilterActive({ from: null, to: null, spec: 'Чек-ап', status: null, page: 1 }),
    true
  );
});

test('array-form param picks first element', () => {
  const r = parseFilterParams({ spec: ['Чек-ап', 'другое'] });
  assert.equal(r.spec, 'Чек-ап');
});
