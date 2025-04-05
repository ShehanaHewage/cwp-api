/**
 * Converts a string from snake_case to camelCase
 */
const snakeToCamel = (str: string): string => {
  return str.toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

/**
 * Recursively converts all keys in an object from snake_case to camelCase
 * @param obj The object to convert
 * @returns A new object with all keys converted to camelCase
 */
export const snakeToCamelCase = <T extends object>(obj: T): any => {
  if (Array.isArray(obj)) {
    return obj.map(item => 
      typeof item === 'object' && item !== null ? snakeToCamelCase(item) : item
    );
  }

  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  return Object.entries(obj).reduce((acc, [key, value]) => {
    const camelKey = snakeToCamel(key);
    const camelValue = typeof value === 'object' && value !== null
      ? snakeToCamelCase(value)
      : value;
    
    return { ...acc, [camelKey]: camelValue };
  }, {});
};