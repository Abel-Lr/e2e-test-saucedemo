export function getRandomNumber(min: number = 1, max: number = 6): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomPick<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}
