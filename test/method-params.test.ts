import { assertEquals, assertThrows } from "https://deno.land/std@0.114.0/testing/asserts.ts";
import { ParamNames } from "../lib/ParamNames.ts";
import { NoPropertyDescriptorFoundError } from "../lib/errors/NoPropertyDescriptorFoundError.ts";

class B {}

class A {
    parameterless() {}
    protected protectedParameterless(): void {}
    private privateParameterless(): void {}
    async asyncParameterless(): Promise<void> {}
    protected async asyncProtectedParameterless(): Promise<void> {}
    private async asyncPrivateParameterless(): Promise<void> {}
    normal(p1: number, p2: string): void {}
    protected protectedNormal(p1: number, p2: string): void {}
    private privateNormal(p1: number, p2: string): void {}
    async normalAsync(p1: number, p2: string): Promise<void> {}
    protected async protectedNormalAsync(p1: number, p2: string): Promise<void> {}
    private async privateNormalAsync(p1: number, p2: string): Promise<void> {}
    public normalDefaults(p1: number, p2: string = ""): void {}
    protected protectedNormalDefaults(p1: number, p2: string = ""): void {}
    private privateNormalDefaults(p1: number, p2: string = ""): void {}
    private async complex(p1: number, p2: string = A.P2, p3: string = A.p3(), p4: [number, string] = [1, "2"]): Promise<void> {}
    public async rest(p1: number, ...p2: B[]): Promise<void> {}
    public async generic<T, R = any>(arr: T[], mapper: (value: T) => R): Promise<R[]> {
        return [];
    }

    static parameterless() {}
    protected static protectedParameterless(): void {}
    private static privateParameterless(): void {}
    static async asyncParameterless(): Promise<void> {}
    protected static async asyncProtectedParameterless(): Promise<void> {}
    private static async asyncPrivateParameterless(): Promise<void> {}
    static normal(p1: number, p2: string): void {}
    protected static protectedNormal(p1: number, p2: string): void {}
    private static privateNormal(p1: number, p2: string): void {}
    static async normalAsync(p1: number, p2: string): Promise<void> {}
    protected static async protectedNormalAsync(p1: number, p2: string): Promise<void> {}
    private static async privateNormalAsync(p1: number, p2: string): Promise<void> {}
    public static normalDefaults(p1: number, p2: string = ""): void {}
    protected static protectedNormalDefaults(p1: number, p2: string = ""): void {}
    private static privateNormalDefaults(p1: number, p2: string = ""): void {}
    private static async complex(p1: number, p2: string = A.P2, p3: string = A.p3(), p4: [number, string] = [1, "2"]): Promise<void> {}
    public static async rest(p1: number, ...p2: B[]): Promise<void> {}
    public static async generic<T, R = any>(arr: T[], mapper: (value: T) => R): Promise<R[]> {
        return [];
    }


    private static readonly P2: string = "p2";
    private static p3(): string {
        return "p3";
    }
}

Deno.test("Non-existing method", () => {
    assertThrows(() => ParamNames.Method(class A {}, "nonExisting"), NoPropertyDescriptorFoundError);
});

[
    ["no parameters", "parameterless", []],
    ["no parameters - protected", "protectedParameterless", []],
    ["no parameters - private", "privateParameterless", []],
    ["no parameters - async public", "asyncParameterless", []],
    ["no parameters - async protected", "asyncProtectedParameterless", []],
    ["no parameters - async private", "asyncPrivateParameterless", []],
    ["normal parameters - public", "normal", ["p1", "p2"]],
    ["normal parameters - protected", "protectedNormal", ["p1", "p2"]],
    ["normal parameters - public async", "normalAsync", ["p1", "p2"]],
    ["normal parameters - protected async", "protectedNormalAsync", ["p1", "p2"]],
    ["normal parameters - private async", "privateNormalAsync", ["p1", "p2"]],
    ["normal parameters - private", "privateNormal", ["p1", "p2"]],
    ["normal parameters protected + defaults", "protectedNormalDefaults", ["p1", "p2"]],
    ["normal parameters private + defaults", "privateNormalDefaults", ["p1", "p2"]],
    ["complex", "complex", ["p1", "p2", "p3", "p4"]],
    ["rest", "rest", ["p1", "p2"]],
    ["generic", "generic", ["arr", "mapper"]],
].forEach(([title, method, expected]) => {
    Deno.test(`Method - ${title}`, () => {
        assertEquals(ParamNames.Method(A.prototype, method as string), expected);
    });
    Deno.test(`Static method - ${title}`, () => {
        assertEquals(ParamNames.StaticMethod(A, method as string), expected);
    });
})

