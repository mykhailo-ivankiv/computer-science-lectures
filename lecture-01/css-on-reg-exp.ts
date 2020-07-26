const regexp = (regexp) => ([expStr, isError]) => {
  if (isError) return [expStr, isError];

  if (regexp.test(expStr)) {
    return [expStr.replace(regexp, ''), false];
  } else {
    return [expStr, true];
  }
};

const str = (str) => ([expStr, isError]) => {
  if (isError) return [expStr, isError];

  if (expStr.startsWith(str)) {
    return [expStr.replace(str, ''), false];
  } else {
    return [expStr, true];
  }
};

const run = (...fns) => (str) => {
  let acc = [str, false];
  for (const fn of fns) {
    acc = fn(acc);
    const [_, isError] = acc;
    if (isError) return acc;
  }

  return acc;
};

const compose = (...fns) => (a) => fns.reduce((acc, fn) => fn(acc), a);

const selector = regexp(/^\w+/);
const spaceOrNewLine = regexp(/^[\n\s]*/);
const openBracket = str('{');
const closeBracket = str('}');
const rule = compose(
  regexp(/^\w+/),
  regexp(/^\s*/),
  str(':'),
  regexp(/^\s*/),
  regexp(/^\w+/),
  regexp(/^\s*/),
  str(';'),
  spaceOrNewLine
);

const or = (...fns) => (a) => {
  if (a[1]) return a;

  let result;
  for (const fn of fns) {
    result = fn(a);
    if (result[1] === false) return result;
  }

  return result;
};

const repeat = (fn) => (a) => {
  if (a[1]) return a;

  let result = fn(a);
  let prevResult = fn(a);

  while (!result[1]) {
    result = fn(result);
    if (result[1]) return prevResult;
    prevResult = result;
  }

  return prevResult;
};

const cssExpression: cssExpression = compose(
  selector,
  spaceOrNewLine,
  openBracket,
  spaceOrNewLine,
  or(repeat(rule), spaceOrNewLine),
  spaceOrNewLine,
  closeBracket,
  spaceOrNewLine
);

type isValidCSS = (cssString: string) => boolean;
const isValidCSS: isValidCSS = (cssString) => {
  const result = run(or(repeat(cssExpression), spaceOrNewLine))(cssString);

  return result[0].length === 0 && !result[1];
};

isValidCSS(`div { color:red;\n border:none; }`) /*?*/;

const test = () => {
  // is css
  isValidCSS(``); /*?*/
  isValidCSS(`\n   \n`); /*?*/
  isValidCSS(`div{}`); /*?*/
  isValidCSS(`div {}`); /*?*/
  isValidCSS(`div\n{\n}\n`); /*?*/
  isValidCSS(`div { }\ndiv { }\nspan{}`); /*?*/
  isValidCSS(`div { color:red; }`); /*?*/
  isValidCSS(`div { color:red;\n border:none; }`); /*?*/
  isValidCSS(`div { color:red;\n border:none; } span {background: red;}`); /*?*/

  //isn't css
  isValidCSS(`{}`); /*?*/
};

test();
