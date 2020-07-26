import { assertEquals, assertArrayContains } from 'https://deno.land/std/testing/asserts.ts';
import isValidCSS from './css-on-reg-exp.js';

// Simple name and function, compact form, but not configurable
Deno.test(`is css`, () => {
  assertEquals(isValidCSS(``), true);
  assertEquals(isValidCSS(`\n   \n\n`), true);
  assertEquals(isValidCSS(`div{}`), true);
  assertEquals(isValidCSS(`div {}`), true);
  assertEquals(isValidCSS(`div {}`), true);
  assertEquals(
    isValidCSS(`
    div 
    { 
    }
    `),
    true
  );
});

Deno.test(`isn't css`, () => {
  assertEquals(isValidCSS(`{}`), false);
  assertEquals(
    isValidCSS(`
    div {}
    {}
  `),
    false
  );
});
