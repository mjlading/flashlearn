import OpenAI from "openai";

const DEFAULT_EMBEDDINGS_MODEL = "text-embedding-3-small";

const openai = new OpenAI();

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
