import { assertEquals } from "https://deno.land/std@0.114.0/testing/asserts.ts";
import { ParamNames } from "../lib/ParamNames.ts";

type Observer = (params: string[]) => void;

const Constructor = (observer: Observer) => (cls: any) => observer(ParamNames.Constructor(cls));
const Method = (observer: Observer) => (proto: any, method: string) => observer(ParamNames.Method(proto, method));
const Setter = (observer: Observer) => (proto: any, property: string) => observer(ParamNames.Setter(proto, property));
const StaticMethod = (observer: Observer) => (cls: any, method: string) => observer(ParamNames.StaticMethod(cls, method));

const result: {ctr?: string[], method?: string[], setter?: string[], staticMethod?: string[]} = {
};

@Constructor(p => result.ctr = p)
class A {
    constructor(private readonly p1: number) {}

    @Method(p => result.method = p)
    method(p1: number, p2: string, ...p3: boolean[]): void {}

    @Setter(p => result.setter = p)
    set setter(value: boolean) {}

    @StaticMethod(p => result.staticMethod = p)
    static staticMethod(sm1: number, sm2: boolean = true) {}
}

Deno.test("Decorators - Constructor params", () => {
    assertEquals(result.ctr, ["p1"]);
});

Deno.test("Decorators - Method params", () => {
    assertEquals(result.method, ["p1", "p2", "p3"]);
});

Deno.test("Decorators - Setter params", () => {
    assertEquals(result.setter, ["value"]);
});

Deno.test("Decorators - Static method params", () => {
    assertEquals(result.staticMethod, ["sm1", "sm2"]);
});
