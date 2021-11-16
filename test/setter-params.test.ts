import { assertEquals, assertThrows } from "https://deno.land/std@0.114.0/testing/asserts.ts";
import { ParamNames } from "../lib/ParamNames.ts";
import { NoPropertyDescriptorFoundError } from "../lib/errors/NoPropertyDescriptorFoundError.ts";

class A {
    nonSetter(p1: number): void {}

    set p1(value: number) {}
}

Deno.test("Non-existing setter", () => {
    assertThrows(() => ParamNames.Setter((class A {}).prototype, "nonExisting"), NoPropertyDescriptorFoundError);
});

Deno.test("Non setter", () => {
    assertThrows(() => ParamNames.Setter((class A {}).prototype, "nonSetter"), NoPropertyDescriptorFoundError);
});

Deno.test("Valid setter", () => {
    assertEquals(ParamNames.Setter(A.prototype, "p1"), ["value"]);
});
