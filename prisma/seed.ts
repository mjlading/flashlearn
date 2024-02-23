import { generateEmbeddings } from "../src/lib/ai";
import prisma from "../src/lib/prisma";
import { subjectNameMap } from "../src/lib/subject";

// Populates the database with data that is required for the application to start, such as subjects
async function main() {
  populateSubjects();
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

async function populateSubjects() {
  const subjectNames = Object.keys(subjectNameMap);
  const subjectEmbeddings = await generateEmbeddings(subjectNames);

  for (let i = 0; i < subjectNames.length; i++) {
    const subjectName = subjectNames[i];
    const subjectEmbedding = subjectEmbeddings[i];

    const subject = await prisma.subject.upsert({
      where: {
        name: subjectName,
      },
      update: {},
      create: {
        name: subjectName,
      },
    });

    // Add the embedding
    await prisma.$executeRaw`
   UPDATE "Subject"
   SET embedding = ${subjectEmbedding}::vector
   WHERE name = ${subject.name}
`;

    console.log("Upserted subject: ", subject);
  }
}