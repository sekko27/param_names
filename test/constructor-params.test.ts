import { assertEquals } from "https://deno.land/std@0.114.0/testing/asserts.ts";
import {ParamNames} from "../lib/ParamNames.ts";

Deno.test("No constructor is specified - empty params", () => {
    assertEquals(ParamNames.Constructor(class A {}), []);
});

Deno.test("Constructor defined with empty parameter list - empty params", () => {
    assertEquals(ParamNames.Constructor(class A { constructor() { } }), []);
});

Deno.test("Protected constructor defined with empty parameter list - empty params", () => {
    assertEquals(ParamNames.Constructor(class A { protected constructor() { } }), []);
});

Deno.test("Private constructor defined with empty parameter list - empty params", () => {
    assertEquals(ParamNames.Constructor(class A { private constructor() { } }), []);
});

Deno.test("Constructor is defined - normal case", () => {
    assertEquals(ParamNames.Constructor(class A {
        constructor(p1: number, p2: string) {
        }
    }), ["p1", "p2"]);
});

Deno.test("Constructor is defined - default params", () => {
    assertEquals(ParamNames.Constructor(class A {
        constructor(p1: number, p2: string = "", p3: boolean = true) {
        }
    }), ["p1", "p2", "p3"]);
});

Deno.test("Constructor is defined - complex default params", () => {
   assertEquals(ParamNames.Constructor(class A {
       private static readonly P1: number = 1;
       private static readonly P2: () => number = () => Math.PI;
       constructor(p1: number = A.P1, p2: number = A.P2(), p21: number = A.staticProvider(), p3: string = 'class SomeConfusion {private constructor') {
       }

       private static staticProvider(): number {
           return 1;
       }
   }), ["p1", "p2", "p21", "p3"]);
});

Deno.test("Constructor is defined - private / protected params", () => {
    assertEquals(ParamNames.Constructor(class A {
        constructor(private p1: number, protected p2: number) {
        }
    }), ["p1", "p2"]);
});

Deno.test("Constructor is defined - private / protected / public readonly params", () => {
    assertEquals(ParamNames.Constructor(class A {
        constructor(private readonly p1: number, protected readonly p2: string, readonly p3: boolean) {
        }
    }), ["p1", "p2", "p3"]);
});

Deno.test("Constructor is defined - rest params", () => {
    assertEquals(ParamNames.Constructor(class A {
        constructor(private readonly p1: number, readonly p2: string, p3: number, ...rest: number[]) {
        }
    }), ["p1", "p2", "p3", "rest"]);
});
