export default async function wait(delay: number = 0): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delay));
}
