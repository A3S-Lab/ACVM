import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const deckSource = await readFile('src/deck.ts', 'utf8');
const speakerGuideSource = await readFile('src/speakerGuide.ts', 'utf8');
const speakerGuideDetailsSource = await readFile('src/speakerGuideDetails.ts', 'utf8');
const speakerGuideDetailsBlock = speakerGuideDetailsSource.split('export const speakerGuideDetails = {')[1];

if (!speakerGuideDetailsBlock) throw new Error('Could not find speakerGuideDetails declaration');
const screensBlock = deckSource.match(/export const screens = \[([\s\S]*?)\] as const;/)?.[1];

if (!screensBlock) throw new Error('Could not find the screens declaration in src/deck.ts');

const screenIds = [...screensBlock.matchAll(/\['([^']+)'/g)].map((match) => match[1]);
const expectedSlideIds = screenIds.slice(1);
const openingIds = ['product-snapshot', 'geo-verification', 'simulation'];
const retiredTutorialIds = [
  'btc-ledger',
  'btc-pow',
  'btc-consensus',
  'consensus-anatomy',
  'consensus-pos',
  'consensus-bft',
  'consensus-governance',
  'eth-state',
  'eth-evm',
  'eth-boundary',
];
const speakerGuideIds = [...speakerGuideSource.matchAll(/^  (?:'([^']+)'|([a-z][a-z-]*)): \{$/gm)]
  .map((match) => match[1] ?? match[2]);
const speakerGuideDetailIds = [...speakerGuideDetailsBlock.matchAll(/^  (?:'([^']+)'|([a-z][a-z-]*)): \{$/gm)]
  .map((match) => match[1] ?? match[2]);
const contentDirectory = 'src/content';
const contentFiles = (await readdir(contentDirectory))
  .filter((file) => file.endsWith('.mdx'))
  .sort();
const contentSources = await Promise.all(
  contentFiles.map(async (file) => ({
    file,
    source: await readFile(join(contentDirectory, file), 'utf8'),
  })),
);

const actualSlideIds = contentSources.flatMap(({ source }) =>
  [...source.matchAll(/<LessonChapter\s+[\s\S]*?\bid="([^"]+)"/g)].map((match) => match[1]),
);
const closingTags = contentSources.reduce(
  (count, { source }) => count + (source.match(/<\/LessonChapter>/g)?.length ?? 0),
  0,
);
const bodyValues = contentSources.flatMap(({ source }) =>
  [...source.matchAll(/\bbody="([^"]+)"/g)].map((match) => match[1]),
);

const duplicates = actualSlideIds.filter((id, index) => actualSlideIds.indexOf(id) !== index);
const missing = expectedSlideIds.filter((id) => !actualSlideIds.includes(id));
const unexpected = actualSlideIds.filter((id) => !expectedSlideIds.includes(id));
const orderMatches = JSON.stringify(expectedSlideIds) === JSON.stringify(actualSlideIds);

if (screenIds.length !== 18) {
  throw new Error(`Expected an 18-slide product deck including the cover; found ${screenIds.length}`);
}
if (contentFiles.length !== 6) {
  throw new Error(`Expected six product-deck MDX groups; found ${contentFiles.length}`);
}
if (duplicates.length || missing.length || unexpected.length || !orderMatches) {
  throw new Error(JSON.stringify({ duplicates, missing, unexpected, orderMatches }, null, 2));
}
if (speakerGuideIds.length !== screenIds.length || !screenIds.every((id) => speakerGuideIds.includes(id))) {
  throw new Error(`Speaker guide coverage does not match screens:\n${JSON.stringify({ screenIds, speakerGuideIds }, null, 2)}`);
}
if (speakerGuideDetailIds.length !== screenIds.length || !screenIds.every((id) => speakerGuideDetailIds.includes(id))) {
  throw new Error(`Speaker guide detail coverage does not match screens:\n${JSON.stringify({ screenIds, speakerGuideDetailIds }, null, 2)}`);
}
for (const field of ['implementation', 'challenges', 'security', 'sources']) {
  const count = speakerGuideDetailsBlock.match(new RegExp(`^    ${field}: \\[`, 'gm'))?.length ?? 0;
  if (count !== screenIds.length) {
    throw new Error(`Expected ${field} notes for all ${screenIds.length} slides; found ${count}`);
  }
}
if (JSON.stringify(expectedSlideIds.slice(0, openingIds.length)) !== JSON.stringify(openingIds)) {
  throw new Error(`The payment condition and two core use cases must open the product story: ${JSON.stringify(expectedSlideIds.slice(0, 3))}`);
}
const storyQuestionCount = deckSource.match(/\bquestion: '/g)?.length ?? 0;
if (storyQuestionCount !== 7) {
  throw new Error(`Expected one question for the cover and six product sections; found ${storyQuestionCount}`);
}
if (closingTags !== actualSlideIds.length) {
  throw new Error(`LessonChapter tags are unbalanced: ${actualSlideIds.length} open, ${closingTags} closed`);
}
const denseBodies = bodyValues.filter((body) => [...body].length > 100);
if (denseBodies.length) {
  throw new Error(`Slide body copy exceeds the 100-character product-deck limit:\n${denseBodies.join('\n')}`);
}
const retiredMatches = retiredTutorialIds.filter((id) => deckSource.includes(`'${id}'`));
if (retiredMatches.length) {
  throw new Error(`Tutorial-only slides returned to the product narrative: ${retiredMatches.join(', ')}`);
}
const artificialPhrases = ['本章', '本课程', '让我们', '综上所述', '不难发现', '值得注意的是', '毋庸置疑'];
const artificialMatches = [
  ...contentSources,
  { file: 'src/speakerGuide.ts', source: speakerGuideSource },
  { file: 'src/speakerGuideDetails.ts', source: speakerGuideDetailsSource },
].flatMap(({ file, source }) => artificialPhrases
  .filter((phrase) => source.includes(phrase))
  .map((phrase) => `${file}: ${phrase}`));
if (artificialMatches.length) {
  throw new Error(`Narrator-style filler found:\n${artificialMatches.join('\n')}`);
}

console.log(`Product deck OK: ${actualSlideIds.length} content slides, ${contentFiles.length} sections, full speaker-guide and security-note coverage.`);
