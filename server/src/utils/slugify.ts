import slugifyPackage from 'slugify';

/**
 * Generates a clean URL-friendly slug from a text string.
 */
export const createSlug = (text: string): string => {
  return slugifyPackage(text, {
    lower: true,
    strict: true,
    trim: true,
    remove: /[*+~.()'"!:@]/g,
  });
};
