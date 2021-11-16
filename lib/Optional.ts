type OptionalValue<T> = T | undefined;

export class Optional<T> {
    public static readonly EMPTY: Optional<any> = new Optional(undefined);

    private constructor(private readonly value: OptionalValue<T>) {
    }

    public static of<T>(value: OptionalValue<T>): Optional<T> {
        return value === undefined ? Optional.EMPTY : new Optional(value);
    }

    get isEmpty(): boolean {
        return this.value === undefined;
    }

    public filter(predicate: (value: T) => boolean): Optional<T> {
        return ((this.value === undefined) || !predicate(this.value)) ? Optional.EMPTY : this;
    }

    public map<R>(mapper: (value: T) => R): Optional<R> {
        return (this.value === undefined) ? Optional.EMPTY : Optional.of(mapper(this.value));
    }

    public orElse(value: T): T {
        return this.value === undefined ? value : this.value;
    }

    public orElseGet(provider: () => T): T {
        return this.value === undefined ? provider() : this.value;
    }

    public orThrow(errorProvider: () => Error): T {
        if (this.value === undefined) {
            throw errorProvider();
        }
        return this.value;
    }
}
