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
const mainlineIds = [
  'useful-work',
  'product-snapshot',
  'poi-proof',
  'execution-boundary',
  'geo-verification',
  'fog-inference',
  'ans',
  'agent-rental',
  'simulation',
  'poi-consensus',
  'system-architecture',
];
const appendixIds = [
  'a3s-box',
  'a3s-power',
  'deployment-modes',
];
const nativeChainIds = ['native-chain'];
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

if (screenIds.length !== 16) {
  throw new Error(`Expected a 16-slide deck with one cover, eleven mainline slides, three appendix slides, and one native-chain slide; found ${screenIds.length}`);
}
if (contentFiles.length !== 4) {
  throw new Error(`Expected four product-deck MDX groups; found ${contentFiles.length}`);
}
if (duplicates.length || missing.length || unexpected.length || !orderMatches) {
  throw new Error(JSON.stringify({ duplicates, missing, unexpected, orderMatches }, null, 2));
}
if (speakerGuideIds.length !== screenIds.length || !screenIds.every((id) => speakerGuideIds.includes(id))) {
  throw new Error(`Speaker guide coverage does not match screens:\n${JSON.stringify({ screenIds, speakerGuideIds }, null, 2)}`);
}
const speakerExampleCount = speakerGuideSource.match(/^    example: '/gm)?.length ?? 0;
const twoBeatCount = speakerGuideSource.match(/^    beats: \['[^']*', '[^']*'\],$/gm)?.length ?? 0;
if (speakerExampleCount !== screenIds.length || twoBeatCount !== screenIds.length) {
  throw new Error(`Every slide needs one concrete example and exactly two speaking points: ${JSON.stringify({ speakerExampleCount, twoBeatCount })}`);
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
if (JSON.stringify(expectedSlideIds.slice(0, mainlineIds.length)) !== JSON.stringify(mainlineIds)) {
  throw new Error(`The eleven-slide decision narrative is out of order: ${JSON.stringify(expectedSlideIds.slice(0, mainlineIds.length))}`);
}
if (JSON.stringify(expectedSlideIds.slice(mainlineIds.length, mainlineIds.length + appendixIds.length)) !== JSON.stringify(appendixIds)) {
  throw new Error(`The technical appendix is out of order: ${JSON.stringify(expectedSlideIds.slice(mainlineIds.length))}`);
}
if (JSON.stringify(expectedSlideIds.slice(mainlineIds.length + appendixIds.length)) !== JSON.stringify(nativeChainIds)) {
  throw new Error(`The native-chain close is out of order: ${JSON.stringify(expectedSlideIds.slice(mainlineIds.length + appendixIds.length))}`);
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
const audienceFacingNarratorPhrases = ['这一页', '这页', '下一页', '上一页', '主线到此', '先来看', '再来看'];
const audienceFacingNarratorMatches = [
  ...contentSources,
  { file: 'src/speakerGuide.ts', source: speakerGuideSource },
].flatMap(({ file, source }) => audienceFacingNarratorPhrases
  .filter((phrase) => source.includes(phrase))
  .map((phrase) => `${file}: ${phrase}`));
if (audienceFacingNarratorMatches.length) {
  throw new Error(`Audience-facing narrator copy found:\n${audienceFacingNarratorMatches.join('\n')}`);
}
const selfQuestionPhrases = ['为什么', '怎么', '如何', '是否', '谁来', '究竟'];
const selfQuestionMatches = [
  ...contentSources,
  { file: 'src/speakerGuide.ts', source: speakerGuideSource },
  { file: 'src/speakerGuideDetails.ts', source: speakerGuideDetailsSource },
].flatMap(({ file, source }) => selfQuestionPhrases
  .filter((phrase) => source.includes(phrase))
  .map((phrase) => `${file}: ${phrase}`));
if (selfQuestionMatches.length || contentSources.some(({ source }) => /title="[^"]*[？?]/.test(source))) {
  throw new Error(`Self-questioning copy found:\n${selfQuestionMatches.join('\n')}`);
}
if (speakerGuideSource.includes('transition:')) {
  throw new Error('Speaker-guide transition scripts must remain removed.');
}

console.log(`Product deck OK: ${mainlineIds.length}-slide decision narrative + ${appendixIds.length}-slide technical appendix + ${nativeChainIds.length}-slide native-chain close, full speaker-guide and security-note coverage.`);
