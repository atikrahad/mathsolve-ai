import { PrismaClient, Difficulty, ResourceType } from '@prisma/client';
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

interface SeedProblem {
  title: string;
  description: string;
  difficulty: keyof typeof Difficulty;
  category: string;
  tags: string[];
  solution?: string;
}

interface SeedResource {
  title: string;
  content: string;
  type: keyof typeof ResourceType;
  category: string;
  difficulty?: string | null;
}

async function main() {
  console.log('🌱 Starting database seeding...');

  // Load seed data
  const usersData: SeedUser[] = JSON.parse(
    readFileSync(join(__dirname, 'seed/data/users.json'), 'utf-8')
  );
  
  const problemsData: SeedProblem[] = JSON.parse(
    readFileSync(join(__dirname, 'seed/data/problems.json'), 'utf-8')
  );
  
  const resourcesData: SeedResource[] = JSON.parse(
    readFileSync(join(__dirname, 'seed/data/resources.json'), 'utf-8')
  );

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.bookmark.deleteMany();
  await prisma.problemRating.deleteMany();
  await prisma.userFollow.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.solution.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.problem.deleteMany();
  await prisma.user.deleteMany();

  // Create users
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
      },
    });
    createdUsers.push(user);
    console.log(`✅ Created user: ${user.username}`);
  }

  // Create problems
  console.log('📚 Creating problems...');
  const createdProblems = [];
  for (let i = 0; i < problemsData.length; i++) {
    const problemData = problemsData[i];
    const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    
    const problem = await prisma.problem.create({
      data: {
        title: problemData.title,
        description: problemData.description,
        difficulty: Difficulty[problemData.difficulty],
        category: problemData.category,
        tags: problemData.tags,
        solution: problemData.solution,
        creatorId: randomUser.id,
        qualityScore: Math.random() * 5, // Random quality score 0-5
        viewCount: Math.floor(Math.random() * 1000), // Random view count
        attemptCount: Math.floor(Math.random() * 500), // Random attempt count
      },
    });
    createdProblems.push(problem);
    console.log(`✅ Created problem: ${problem.title}`);
  }

  // Create resources
  console.log('📖 Creating resources...');
  for (const resourceData of resourcesData) {
    const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    
    const resource = await prisma.resource.create({
      data: {
        title: resourceData.title,
        content: resourceData.content,
        type: ResourceType[resourceData.type],
        category: resourceData.category,
        difficulty: resourceData.difficulty,
        authorId: randomUser.id,
        viewCount: Math.floor(Math.random() * 2000),
        rating: Math.random() * 5, // Random rating 0-5
      },
    });
    console.log(`✅ Created resource: ${resource.title}`);
  }

  // Create some solutions
  console.log('💡 Creating solutions...');
  for (let i = 0; i < 20; i++) {
    const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    const randomProblem = createdProblems[Math.floor(Math.random() * createdProblems.length)];
    
    // Skip if user already solved this problem
    const existingSolution = await prisma.solution.findUnique({
      where: {
        problemId_userId: {
          problemId: randomProblem.id,
          userId: randomUser.id,
        },
      },
    });
    
    if (!existingSolution) {
      const isCorrect = Math.random() > 0.3; // 70% chance of correct solution
      const pointsEarned = isCorrect ? 
        (randomProblem.difficulty === 'LOW' ? 10 : 
         randomProblem.difficulty === 'MEDIUM' ? 25 : 50) : 0;
      
      await prisma.solution.create({
        data: {
          problemId: randomProblem.id,
          userId: randomUser.id,
          answer: `Sample answer for ${randomProblem.title}`,
          isCorrect,
          pointsEarned,
          timeSpent: Math.floor(Math.random() * 3600), // Random time 0-3600 seconds
          hintsUsed: Math.floor(Math.random() * 3),
        },
      });
    }
  }

  // Create some achievements
  console.log('🏆 Creating achievements...');
  const achievementTypes = [
    { type: 'FIRST_SOLVE', name: 'First Steps', description: 'Solved your first problem!' },
    { type: 'STREAK_5', name: 'On Fire', description: 'Maintained a 5-day streak!' },
    { type: 'CATEGORY_MASTER', name: 'Algebra Master', description: 'Solved 20 algebra problems!' },
    { type: 'PROBLEM_CREATOR', name: 'Content Creator', description: 'Created your first problem!' },
  ];

  for (const user of createdUsers.slice(0, 3)) { // Give achievements to first 3 users
    const randomAchievement = achievementTypes[Math.floor(Math.random() * achievementTypes.length)];
    await prisma.achievement.create({
      data: {
        userId: user.id,
        type: randomAchievement.type,
        name: randomAchievement.name,
        description: randomAchievement.description,
      },
    });
  }

  // Create some follows
  console.log('👥 Creating user follows...');
  for (let i = 0; i < 5; i++) {
    const follower = createdUsers[i];
    const following = createdUsers[(i + 1) % createdUsers.length];
    
    if (follower.id !== following.id) {
      try {
        await prisma.userFollow.create({
          data: {
            followerId: follower.id,
            followingId: following.id,
          },
        });
      } catch (error) {
        // Skip if relationship already exists
      }
    }
  }

  // Create some ratings
  console.log('⭐ Creating problem ratings...');
  for (let i = 0; i < 15; i++) {
    const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    const randomProblem = createdProblems[Math.floor(Math.random() * createdProblems.length)];
    
    try {
      await prisma.problemRating.create({
        data: {
          problemId: randomProblem.id,
          userId: randomUser.id,
          rating: Math.floor(Math.random() * 5) + 1, // 1-5 stars
        },
      });
    } catch (error) {
      // Skip if rating already exists
    }
  }

  console.log('✅ Database seeding completed successfully!');
  console.log(`📊 Created:`);
  console.log(`   - ${createdUsers.length} users`);
  console.log(`   - ${createdProblems.length} problems`);
  console.log(`   - ${resourcesData.length} resources`);
  console.log(`   - Various solutions, achievements, follows, and ratings`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });