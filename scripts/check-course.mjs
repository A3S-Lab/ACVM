import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const courseSource = await readFile('src/course.ts', 'utf8');
const screensBlock = courseSource.match(/export const screens = \[([\s\S]*?)\] as const;/)?.[1];

if (!screensBlock) throw new Error('Could not find the screens declaration in src/course.ts');

const screenIds = [...screensBlock.matchAll(/\['([^']+)'/g)].map((match) => match[1]);
const expectedLessonIds = screenIds.slice(1);
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

const actualLessonIds = contentSources.flatMap(({ source }) =>
  [...source.matchAll(/<LessonChapter\s+[\s\S]*?\bid="([^"]+)"/g)].map((match) => match[1]),
);
const closingTags = contentSources.reduce(
  (count, { source }) => count + (source.match(/<\/LessonChapter>/g)?.length ?? 0),
  0,
);
const codeBlocks = contentSources.reduce(
  (count, { source }) => count + (source.match(/^```[a-z]+/gm)?.length ?? 0),
  0,
);
const motionPlayers = contentSources.reduce(
  (count, { source }) => count + (source.match(/<MotionPlayer\b/g)?.length ?? 0),
  0,
);

const duplicates = actualLessonIds.filter((id, index) => actualLessonIds.indexOf(id) !== index);
const missing = expectedLessonIds.filter((id) => !actualLessonIds.includes(id));
const unexpected = actualLessonIds.filter((id) => !expectedLessonIds.includes(id));
const orderMatches = JSON.stringify(expectedLessonIds) === JSON.stringify(actualLessonIds);

if (duplicates.length || missing.length || unexpected.length || !orderMatches) {
  throw new Error(JSON.stringify({ duplicates, missing, unexpected, orderMatches }, null, 2));
}
if (closingTags !== actualLessonIds.length) {
  throw new Error(`LessonChapter tags are unbalanced: ${actualLessonIds.length} open, ${closingTags} closed`);
}
if (codeBlocks < 10 || motionPlayers < 3) {
  throw new Error(`Interactive coverage is too low: ${codeBlocks} code blocks, ${motionPlayers} motion players`);
}

console.log(
  `Course content OK: ${actualLessonIds.length} ordered lessons, ${codeBlocks} Code Hike blocks, ${motionPlayers} Remotion players.`,
);
