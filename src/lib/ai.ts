import * as math from "mathjs";
import OpenAI from "openai";

const DEFAULT_EMBEDDINGS_MODEL = "text-embedding-3-small";

const openai = new OpenAI();

// Cosine similarity of two vectors is defined as the cosine of the
// angle between the vectors, found by taking the dot product of
// the vectors divided by the product of their lengths
export function cosineSimilarity(A: number[], B: number[]): number {
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
export function getCosineSimilarities(
  inputEmbedding: number[],
  targetEmbeddings: number[][]
): number[] {
  return targetEmbeddings.map((subjectEmbedding) =>
    cosineSimilarity(inputEmbedding, subjectEmbedding)
  );
}

/**
 * Used for generating embeddings from a string
 * @param rawInput a strings to generate embeddings from
 * @returns Embeddings as a list of numbers
 */
export async function generateEmbedding(
  rawInput: string,
  model = DEFAULT_EMBEDDINGS_MODEL
) {
  // OpenAI recommends replacing newlines with spaces for best results
  const input = rawInput.replace(/\n/g, " ");
  let response;
  try {
    response = await openai.embeddings.create({
      model: model,
      input: input,
    });
  } catch (error) {
    throw new Error(`Failed to retrieve embeddings:${error}`);
  }

  const embedding = response.data[0].embedding;
  return embedding;
}

/**
 * Used for generating multiple embeddings in a batch
 * @param rawInput a list of strings to generate embeddings from
 * @returns A list of embeddings with the same order as the input
 */
export async function generateEmbeddings(
  rawInput: string[],
  model = DEFAULT_EMBEDDINGS_MODEL
) {
  // OpenAI recommends replacing newlines with spaces for best results
  const input = rawInput.map((item) => item.replace(/\n/g, " "));
  let response;
  try {
    response = await openai.embeddings.create({
      model: model,
      input: [...input], // batch requests
    });
  } catch (error) {
    throw new Error(`Failed to retrieve embeddings:${error}`);
  }

  // Needed since the the response object may not return embeddings in the order of the inputs
  const embeddings: number[][] = new Array(response.data.length);
  for (const embedding of response.data) {
    embeddings[embedding.index] = embedding.embedding;
  }

  return embeddings;
}

export default openai;
