import * as math from "mathjs";

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