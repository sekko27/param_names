export class NoPropertyDescriptorFoundError extends Error {
    constructor(readonly target: any, property: string) {
        super(`No property description has been found for "${target?.constructor?.name ?? target?.name ?? "unknown"}.${property}`);
    }

    public static provider(target: any, property: string): () => NoPropertyDescriptorFoundError {
        return () => new NoPropertyDescriptorFoundError(target, property);
    }
}
