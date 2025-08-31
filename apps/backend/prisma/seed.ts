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

interface SeedProblem {
  title: string;
  description: string;
  difficulty: string;
  category: string;
  tags: string[];
  solution?: string;
}

interface SeedResource {
  title: string;
  content: string;
  type: string;
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
  
  // Helper function to calculate realistic quality score
  const calculateQualityScore = (problem: SeedProblem): number => {
    let score = 20; // Base score
    
    // Title quality (5-25 points)
    if (problem.title.length >= 10 && problem.title.length <= 60) score += 20;
    else if (problem.title.length >= 5) score += 15;
    else score += 5;
    
    // Description quality (10-25 points)
    if (problem.description.length >= 50) score += 25;
    else if (problem.description.length >= 20) score += 15;
    else score += 10;
    
    // Solution quality (0-20 points)
    if (problem.solution && problem.solution.length > 100) score += 20;
    else if (problem.solution && problem.solution.length > 50) score += 15;
    else if (problem.solution) score += 10;
    
    // Tags bonus (0-10 points)
    score += Math.min(problem.tags.length * 2, 10);
    
    // Difficulty adjustment
    if (problem.difficulty === 'HIGH') score += 5;
    else if (problem.difficulty === 'LOW') score -= 5;
    
    return Math.min(score, 100);
  };

  for (let i = 0; i < problemsData.length; i++) {
    const problemData = problemsData[i];
    const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    
    // Calculate realistic metrics based on difficulty and quality
    const qualityScore = calculateQualityScore(problemData);
    const difficultyMultiplier = problemData.difficulty === 'LOW' ? 1.5 : problemData.difficulty === 'HIGH' ? 0.7 : 1.0;
    const baseViews = Math.floor(qualityScore * 8 * difficultyMultiplier);
    const baseAttempts = Math.floor(baseViews * 0.3 * difficultyMultiplier);
    
    const problem = await prisma.problem.create({
      data: {
        title: problemData.title,
        description: problemData.description,
        difficulty: problemData.difficulty,
        category: problemData.category,
        tags: JSON.stringify(problemData.tags),
        solution: problemData.solution,
        creatorId: randomUser.id,
        qualityScore: qualityScore + (Math.random() - 0.5) * 10, // Add some variance
        viewCount: baseViews + Math.floor(Math.random() * 200), // Add random variance
        attemptCount: baseAttempts + Math.floor(Math.random() * 100), // Add random variance
      },
    });
    createdProblems.push(problem);
    console.log(`✅ Created problem: ${problem.title} (${problem.category}, ${problem.difficulty})`);
  }

  // Create resources
  console.log('📖 Creating resources...');
  for (const resourceData of resourcesData) {
    const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    
    const resource = await prisma.resource.create({
      data: {
        title: resourceData.title,
        content: resourceData.content,
        type: resourceData.type,
        category: resourceData.category,
        difficulty: resourceData.difficulty,
        authorId: randomUser.id,
        viewCount: Math.floor(Math.random() * 2000),
        rating: Math.random() * 5, // Random rating 0-5
      },
    });
    console.log(`✅ Created resource: ${resource.title}`);
  }

  // Create solutions for problems
  console.log('💡 Creating solutions...');
  let solutionsCreated = 0;
  const targetSolutions = Math.min(createdProblems.length * 2, 50); // 2 solutions per problem, max 50
  
  for (let attempts = 0; attempts < targetSolutions * 2 && solutionsCreated < targetSolutions; attempts++) {
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
      // Difficulty affects success rate and time
      const difficultyFactor = randomProblem.difficulty === 'LOW' ? 0.8 : 
                              randomProblem.difficulty === 'MEDIUM' ? 0.6 : 0.4;
      const isCorrect = Math.random() < difficultyFactor;
      
      const basePoints = randomProblem.difficulty === 'LOW' ? 15 : 
                        randomProblem.difficulty === 'MEDIUM' ? 35 : 60;
      const pointsEarned = isCorrect ? basePoints : Math.floor(basePoints * 0.1);
      
      // Time spent based on difficulty and success
      const baseTime = randomProblem.difficulty === 'LOW' ? 300 : 
                      randomProblem.difficulty === 'MEDIUM' ? 900 : 1800; // 5, 15, 30 minutes
      const timeVariance = baseTime * 0.5;
      const timeSpent = Math.floor(baseTime + (Math.random() - 0.5) * timeVariance);
      
      // Hints used more for difficult problems
      const hintsUsed = Math.floor(Math.random() * (randomProblem.difficulty === 'HIGH' ? 4 : 
                                                    randomProblem.difficulty === 'MEDIUM' ? 2 : 1));
      
      await prisma.solution.create({
        data: {
          problemId: randomProblem.id,
          userId: randomUser.id,
          answer: isCorrect ? 'Correct solution provided' : 'Incorrect attempt',
          isCorrect,
          pointsEarned,
          timeSpent: Math.max(timeSpent, 30), // Minimum 30 seconds
          hintsUsed,
        },
      });
      solutionsCreated++;
    }
  }
  
  console.log(`✅ Created ${solutionsCreated} solutions`);

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

  // Create problem ratings
  console.log('⭐ Creating problem ratings...');
  let ratingsCreated = 0;
  const targetRatings = Math.min(createdProblems.length * 3, 75); // 3 ratings per problem, max 75
  
  for (let attempts = 0; attempts < targetRatings * 2 && ratingsCreated < targetRatings; attempts++) {
    const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    const randomProblem = createdProblems[Math.floor(Math.random() * createdProblems.length)];
    
    try {
      // Rating influenced by problem quality
      const qualityBias = randomProblem.qualityScore / 100;
      const baseRating = Math.random();
      const adjustedRating = (baseRating + qualityBias * 0.6) / 1.6; // Weighted average
      const rating = Math.min(Math.max(Math.ceil(adjustedRating * 5), 1), 5);
      
      await prisma.problemRating.create({
        data: {
          problemId: randomProblem.id,
          userId: randomUser.id,
          rating,
        },
      });
      ratingsCreated++;
    } catch (error) {
      // Skip if rating already exists
    }
  }
  
  console.log(`✅ Created ${ratingsCreated} problem ratings`);

  console.log('✅ Database seeding completed successfully!');
  console.log(`📊 Created:`);
  console.log(`   - ${createdUsers.length} users`);
  console.log(`   - ${createdProblems.length} problems across ${new Set(problemsData.map(p => p.category)).size} categories`);
  console.log(`   - ${resourcesData.length} resources`);
  console.log(`   - ${solutionsCreated} solutions with realistic difficulty-based success rates`);
  console.log(`   - ${ratingsCreated} problem ratings with quality-based weighting`);
  console.log(`   - Various achievements and user follows`);
  
  // Display category breakdown
  const categoryBreakdown = problemsData.reduce((acc: any, problem) => {
    acc[problem.category] = (acc[problem.category] || 0) + 1;
    return acc;
  }, {});
  
  console.log(`\n📚 Problems by category:`);
  Object.entries(categoryBreakdown).forEach(([category, count]) => {
    console.log(`   - ${category}: ${count} problems`);
  });
  
  // Display difficulty breakdown
  const difficultyBreakdown = problemsData.reduce((acc: any, problem) => {
    acc[problem.difficulty] = (acc[problem.difficulty] || 0) + 1;
    return acc;
  }, {});
  
  console.log(`\n📊 Problems by difficulty:`);
  Object.entries(difficultyBreakdown).forEach(([difficulty, count]) => {
    console.log(`   - ${difficulty}: ${count} problems`);
  });
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });