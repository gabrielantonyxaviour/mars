export function capitalizeString(input: string): string {
  try {
    return input.charAt(0).toUpperCase() + input.slice(1);
  } catch (er) {
    return "error";
  }
}
