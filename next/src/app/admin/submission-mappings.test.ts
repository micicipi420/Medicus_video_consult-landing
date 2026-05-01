import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  STATUS_LABELS,
  labelForSpecialization,
  truncate,
} from './submission-mappings.ts';

test('labelForSpecialization maps English keys to Russian', () => {
  assert.equal(labelForSpecialization('consultation'), 'Онлайн-консультация');
  assert.equal(labelForSpecialization('treatment'), 'Лечение за рубежом');
  assert.equal(labelForSpecialization('checkup'), 'Чек-ап');
  assert.equal(labelForSpecialization('not-sure'), 'Пока не определился');
});

test('labelForSpecialization is idempotent for stored Russian strings', () => {
  assert.equal(
    labelForSpecialization('Онлайн-консультация'),
    'Онлайн-консультация'
  );
  assert.equal(
    labelForSpecialization('Лечение за рубежом'),
    'Лечение за рубежом'
  );
  assert.equal(labelForSpecialization('Чек-ап'), 'Чек-ап');
  assert.equal(
    labelForSpecialization('Пока не определился'),
    'Пока не определился'
  );
});

test('labelForSpecialization passes through unknown values verbatim', () => {
  assert.equal(labelForSpecialization('garbage-unknown'), 'garbage-unknown');
});

test('labelForSpecialization returns em-dash for empty/null/undefined', () => {
  assert.equal(labelForSpecialization(''), '—');
  assert.equal(labelForSpecialization(null), '—');
  assert.equal(labelForSpecialization(undefined), '—');
});

test('STATUS_LABELS', () => {
  assert.equal(STATUS_LABELS['new'], 'Новая');
  assert.equal(STATUS_LABELS['contacted'], 'Связались');
  assert.equal(STATUS_LABELS['completed'], 'Завершено');
});

test('truncate short string returns unchanged', () => {
  assert.equal(truncate('short', 80), 'short');
});

test('truncate long string returns max-length with ellipsis', () => {
  const long = 'a'.repeat(200);
  const out = truncate(long, 80);
  assert.equal(out.length, 80);
  assert.equal(out.endsWith('…'), true);
  assert.equal(out.slice(0, 79), 'a'.repeat(79));
});

test('truncate exactly-max returns unchanged', () => {
  const exact = 'a'.repeat(80);
  assert.equal(truncate(exact, 80), exact);
});

test('truncate null/undefined returns empty string', () => {
  assert.equal(truncate(null, 80), '');
  assert.equal(truncate(undefined, 80), '');
});
