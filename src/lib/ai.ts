"use server";

import OpenAI from "openai";
import { subjectNameMap } from "./subject";
import * as math from "mathjs";

const client = new OpenAI();

/**
 * Returns the most fitting subject given some input text.
 * Uses embeddings, calculates similarity by cosine similarity
 * @param text the text to assign a subject to
 */
export async function classifySubject(text: string) {
  const subjects = Object.keys(subjectNameMap);

  const subjectEmbeddingsPromise = client.embeddings.create({
    model: "text-embedding-3-small",
    input: subjects,
  });
  const textEmbeddingPromise = client.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  const embeddings = await Promise.all([
    subjectEmbeddingsPromise,
    textEmbeddingPromise,
  ]);

  const subjectEmbeddings = embeddings[0].data.map(
    (subjectEmbedding) => subjectEmbedding.embedding
  );
  const textEmbedding = embeddings[1].data[0].embedding;

  const scores = getScores(textEmbedding, subjectEmbeddings);

  const predictionConfidence = Math.max(...scores);
  const predictedSubject = subjects[scores.indexOf(predictionConfidence)];

  return {
    predictedSubject: predictedSubject,
    predictionConfidence: predictionConfidence,
  };
}

// Cosine similarity of two vectors is defined as the cosine of the
// angle between the vectors, found by taking the dot product of
// the vectors divided by the product of their lengths
function cosineSimilarity(A: number[], B: number[]): number {
  const dotProduct = math.dot(A, B);
  const normA = math.norm(A) as number;
  const normB = math.norm(B) as number;
  return dotProduct / (normA * normB);
}

/**
 *  Gets the cosine simularity scores of given input and target embeddings.
 * @param inputEmbedding one-dimensional input embeddings, e.g. from a text
 * @param targetEmbeddings two-dimensional target embeddings, represening classification targets
 *
 * @returns number array of the scores with index correlating to targets
 */
function getScores(
  inputEmbedding: number[],
  targetEmbeddings: number[][]
): number[] {
  return targetEmbeddings.map((subjectEmbedding) =>
    cosineSimilarity(inputEmbedding, subjectEmbedding)
  );
}
