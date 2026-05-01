import { test } from 'node:test';
import assert from 'node:assert/strict';

import { computePageRange } from './pagination-math.ts';

test('totalCount=0 returns zero range and 1 page', () => {
  const r = computePageRange(1, 50, 0);
  assert.equal(r.start, 0);
  assert.equal(r.end, 0);
  assert.equal(r.totalPages, 1);
  assert.equal(r.clampedPage, 1);
});

test('totalCount=1 single page', () => {
  const r = computePageRange(1, 50, 1);
  assert.equal(r.start, 1);
  assert.equal(r.end, 1);
  assert.equal(r.totalPages, 1);
});

test('totalCount=247 page 1 of 5', () => {
  const r = computePageRange(1, 50, 247);
  assert.equal(r.start, 1);
  assert.equal(r.end, 50);
  assert.equal(r.totalPages, 5);
});

test('totalCount=247 page 5 of 5 (last page 47 rows)', () => {
  const r = computePageRange(5, 50, 247);
  assert.equal(r.start, 201);
  assert.equal(r.end, 247);
  assert.equal(r.totalPages, 5);
});

test('out-of-range currentPage clamps high to totalPages', () => {
  const r = computePageRange(99, 50, 247);
  assert.equal(r.clampedPage, 5);
  assert.equal(r.start, 201);
  assert.equal(r.end, 247);
});

test('out-of-range currentPage clamps low to 1', () => {
  const r = computePageRange(-3, 50, 247);
  assert.equal(r.clampedPage, 1);
  assert.equal(r.start, 1);
  assert.equal(r.end, 50);
});

test('exact multiple boundary: totalCount=100 page 2', () => {
  const r = computePageRange(2, 50, 100);
  assert.equal(r.start, 51);
  assert.equal(r.end, 100);
  assert.equal(r.totalPages, 2);
});
