import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const summaries = await prisma.monthlySummary.findMany();
  
  const grouped: Record<string, string[]> = {};
  
  // Format the date by year-month to find duplicates within the SAME month regardless of timezone shifts
  summaries.forEach(s => {
    // using UTC methods to be absolutely sure
    const year = s.monthYear.getUTCFullYear();
    const month = s.monthYear.getUTCMonth();
    const key = `${s.userId}-${year}-${month}`;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(s.id);
  });
  
  console.log("Grouped keys:", Object.keys(grouped).length);
  
  for (const [k, ids] of Object.entries(grouped)) {
    console.log(`Key ${k} has ${ids.length} records`);
    if (ids.length > 1) {
      // Keep the last one, delete the rest
      for (let i = 0; i < ids.length - 1; i++) {
          await prisma.monthlySummary.delete({ where: { id: ids[i] } });
      }
      console.log(`Deleted ${ids.length - 1} duplicates for key ${k}`);
    }
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
