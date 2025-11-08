import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

interface SeedUser {
  username: string;
  email: string;
  bio?: string;
  rankPoints: number;
  currentRank: string;
  streakCount: number;
}

interface SeedTestCase {
  isSample: boolean;
  input: string;
  output: string;
  timeLimitMs?: number;
  memoryLimitKb?: number;
  score?: number;
}

interface SeedChallenge {
  slug: string;
  title: string;
  prompt: string;
  difficulty: string;
  category: string;
  topics: string[];
  languages: string[];
  tags: string[];
  constraints?: string;
  sampleInput?: string;
  sampleOutput?: string;
  starterCode: Record<string, string>;
  solutionOutline?: string;
  editorialUrl?: string | null;
  timeLimitMs?: number;
  memoryLimitKb?: number;
  testCases: SeedTestCase[];
}

interface SeedResource {
  title: string;
  content: string;
  type: string;
  category: string;
  difficulty?: string | null;
}

function loadJson<T>(fileName: string): T {
  return JSON.parse(readFileSync(join(__dirname, `seed/data/${fileName}`), 'utf-8')) as T;
}

function calculateChallengeQuality(challenge: SeedChallenge): number {
  let score = 30; // base
  score += Math.min(challenge.prompt.length / 20, 25);
  score += Math.min(challenge.testCases.length * 5, 15);
  score += Math.min(challenge.starterCode ? Object.keys(challenge.starterCode).length * 5 : 0, 15);
  if (challenge.solutionOutline && challenge.solutionOutline.length > 120) {
    score += 10;
  }
  if (challenge.difficulty === 'HARD') score += 5;
  if (challenge.difficulty === 'EASY') score -= 5;
  return Math.max(20, Math.min(100, Math.round(score)));
}

const sampleCodeSnippets: Record<string, string[]> = {
  python: [
    'def solve():\n    pass',
    'class Solution:\n    def run(self):\n        return True',
  ],
  javascript: [
    'export function handler() {\n  return 42;\n}',
    'const solve = () => true;'
  ],
  typescript: ['export const handler = (): number => 0;'],
  java: [
    'class Solution {\n    public int solve() {\n        return 0;\n    }\n}',
  ],
  cpp: ['int solve() { return 0; }'],
  go: ['func solve() int { return 0 }'],
  sql: ['SELECT 1;'],
};

async function main() {
  console.log('🌱 Starting database seeding for programming platform...');

  const usersData = loadJson<SeedUser[]>('users.json');
  const challengesData = loadJson<SeedChallenge[]>('challenges.json');
  const resourcesData = loadJson<SeedResource[]>('resources.json');

  console.log('🗑️  Clearing existing data...');
  await prisma.bookmark.deleteMany();
  await prisma.challengeRating.deleteMany();
  await prisma.discussion.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.testCase.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.playlistChallenge.deleteMany();
  await prisma.playlist.deleteMany();
  await prisma.organizationMembership.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.user.deleteMany();

  console.log('👥 Creating users...');
  const createdUsers = [];
  for (const userData of usersData) {
    const hashedPassword = await bcrypt.hash('password123', 12);
    const user = await prisma.user.create({
      data: {
        username: userData.username,
        email: userData.email,
        passwordHash: hashedPassword,
        bio: userData.bio,
        rankPoints: userData.rankPoints,
        currentRank: userData.currentRank,
        streakCount: userData.streakCount,
        lastActiveAt: new Date(),
        preferredLanguages: JSON.stringify(['python', 'javascript']),
      },
    });
    createdUsers.push(user);
    console.log(`✅ Created user: ${user.username}`);
  }

  console.log('🏢 Creating sample organization & playlist...');
  const org = await prisma.organization.create({
    data: {
      name: 'Code Bootcamp Cohort',
      slug: 'code-bootcamp',
      planTier: 'PRO',
      settings: JSON.stringify({ timezone: 'UTC', reminderCadence: 'weekly' }),
    },
  });

  await prisma.organizationMembership.create({
    data: {
      organizationId: org.id,
      userId: createdUsers[0].id,
      role: 'ADMIN',
    },
  });

  const playlist = await prisma.playlist.create({
    data: {
      ownerId: createdUsers[0].id,
      title: 'Week 1 – Hash Maps & Strings',
      description: 'Foundational problems for new cohort members.',
      visibility: 'PUBLIC',
      tags: JSON.stringify(['bootcamp', 'week1']),
    },
  });

  await prisma.assignment.create({
    data: {
      organizationId: org.id,
      playlistId: playlist.id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      visibility: 'COHORT',
    },
  });

  console.log('🧩 Creating programming challenges...');
  const createdChallenges = [];
  for (const challengeData of challengesData) {
    const creator = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    const qualityScore = calculateChallengeQuality(challengeData);
    const challenge = await prisma.challenge.create({
      data: {
        slug: challengeData.slug,
        title: challengeData.title,
        prompt: challengeData.prompt,
        difficulty: challengeData.difficulty,
        category: challengeData.category,
        topics: JSON.stringify(challengeData.topics),
        languages: JSON.stringify(challengeData.languages),
        tags: JSON.stringify(challengeData.tags),
        constraints: challengeData.constraints,
        sampleInput: challengeData.sampleInput,
        sampleOutput: challengeData.sampleOutput,
        starterCode: JSON.stringify(challengeData.starterCode),
        solutionOutline: challengeData.solutionOutline,
        editorialUrl: challengeData.editorialUrl,
        timeLimitMs: challengeData.timeLimitMs ?? 2000,
        memoryLimitKb: challengeData.memoryLimitKb ?? 256000,
        creatorId: creator.id,
        qualityScore,
        viewCount: qualityScore * 5 + Math.floor(Math.random() * 200),
        attemptCount: qualityScore * 2 + Math.floor(Math.random() * 80),
        successRate: Number((Math.random() * 0.4 + 0.3).toFixed(2)),
        visibility: 'PUBLIC',
      },
    });

    for (const testCase of challengeData.testCases) {
      await prisma.testCase.create({
        data: {
          challengeId: challenge.id,
          isSample: testCase.isSample,
          inputData: testCase.input,
          outputData: testCase.output,
          timeLimitMs: testCase.timeLimitMs,
          memoryLimitKb: testCase.memoryLimitKb,
          score: testCase.score ?? (testCase.isSample ? 0 : 10),
        },
      });
    }

    await prisma.playlistChallenge.create({
      data: {
        playlistId: playlist.id,
        challengeId: challenge.id,
        order: createdChallenges.length,
      },
    });

    createdChallenges.push(challenge);
    console.log(`✅ Created challenge: ${challenge.title} (${challenge.difficulty})`);
  }

  console.log('💾 Creating sample submissions...');
  const submissionsTarget = Math.min(createdChallenges.length * 3, 30);
  let submissionsCreated = 0;

  while (submissionsCreated < submissionsTarget) {
    const user = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    const challenge = createdChallenges[Math.floor(Math.random() * createdChallenges.length)];
    const parsedLanguages: string[] = JSON.parse(challenge.languages || '[]');
    const language = parsedLanguages[Math.floor(Math.random() * parsedLanguages.length)] || 'python';
    const codeSamples = sampleCodeSnippets[language] || sampleCodeSnippets.python;
    const code = codeSamples[Math.floor(Math.random() * codeSamples.length)];
    const statusPool = ['PASS', 'FAIL', 'TLE'];
    const status = statusPool[Math.floor(Math.random() * statusPool.length)];

    const existing = await prisma.submission.findFirst({
      where: { challengeId: challenge.id, userId: user.id },
    });
    if (existing) continue;

    const totalTests = await prisma.testCase.count({ where: { challengeId: challenge.id, isSample: false } });
    const testsPassed = status === 'PASS' ? totalTests : Math.max(0, Math.floor(totalTests / 2));

    await prisma.submission.create({
      data: {
        challengeId: challenge.id,
        userId: user.id,
        language,
        code,
        status,
        runtimeMs: Math.floor(Math.random() * 900) + 100,
        memoryKb: Math.floor(Math.random() * 128000) + 64000,
        testsPassed,
        totalTests,
        verdictDetails: JSON.stringify({ cases: totalTests, passed: testsPassed }),
        hintCount: status === 'PASS' ? 0 : Math.floor(Math.random() * 2),
      },
    });

    submissionsCreated++;
  }

  console.log(`✅ Created ${submissionsCreated} submissions across ${createdChallenges.length} challenges`);

  console.log('📖 Creating resources...');
  for (const resourceData of resourcesData) {
    const author = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    await prisma.resource.create({
      data: {
        title: resourceData.title,
        content: resourceData.content,
        type: resourceData.type,
        category: resourceData.category,
        difficulty: resourceData.difficulty,
        authorId: author.id,
        viewCount: Math.floor(Math.random() * 2000),
        rating: Number((Math.random() * 4 + 1).toFixed(2)),
      },
    });
  }

  console.log('🏆 Creating achievements...');
  const achievementTemplates = [
    { type: 'FIRST_SUBMISSION', name: 'Hello, World!', description: 'Submitted your first piece of code.' },
    { type: 'STREAK_7', name: 'Weekly Grinder', description: 'Solved challenges 7 days in a row.' },
    { type: 'LANGUAGE_MASTER', name: 'Polyglot', description: 'Solved challenges in 4 different languages.' },
  ];

  for (const user of createdUsers.slice(0, 3)) {
    const achievement = achievementTemplates[Math.floor(Math.random() * achievementTemplates.length)];
    await prisma.achievement.create({
      data: {
        userId: user.id,
        type: achievement.type,
        name: achievement.name,
        description: achievement.description,
      },
    });
  }

  console.log('✨ Seeding complete!');
}

main()
  .catch((error) => {
    console.error('❌ Seeding failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
