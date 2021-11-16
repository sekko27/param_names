// @deno-types="https://raw.githubusercontent.com/acornjs/acorn/8.4.1/acorn/dist/acorn.d.ts"
import * as acorn from "https://cdn.esm.sh/v43/acorn@8.4.1/deno/acorn.js";
// @deno-types="./types/acorn-class-fields.d.ts"
import cf from "https://dev.jspm.io/acorn-class-fields@0.3.7";
import { Optional } from "./Optional.ts";
import { NoPropertyDescriptorFoundError } from "./errors/NoPropertyDescriptorFoundError.ts";

class Cache<K, V> {
    private readonly internal: Map<K, V> = new Map();

    orElseGet(key: K, provider: () => V): V {
        return Optional.of(this.internal.get(key))
            .orElseGet(() => {
                const value = provider();
                this.internal.set(key, value);
                return value;
            });
    }
}

type Setter<T = any> = (value: T) => void;

export class ParamNames {
    private static readonly CLASS_NAME: string = "X";
    private static readonly PARSER: typeof acorn.Parser = cf(acorn.Parser);
    /**
     * We must use ecma version 13 at least to able to parse class level variables.
     * @private
     */
    private static readonly ECMA_VERSION = 13;
    private static readonly CACHE: Cache<Function, string[]> = new Cache();


    public static Constructor(cls: any): string[] {
        return ParamNames.params(cls);
    }

    public static Method(proto: any, property: string): string[] {
        return ParamNames.params(proto, property);
    }

    public static StaticMethod(cls: any, property: string): string[] {
        return ParamNames.params(cls, property);
    }

    public static Setter(proto: any, property: string): string[] {
        return ParamNames.params(proto, property);
    }

    private static params(target: any, property: string | undefined = undefined): string[] {
        const cacheKey: Function = property === undefined ? target : target[property];
        return ParamNames.CACHE.orElseGet(
            cacheKey,
            () => property === undefined ? ParamNames.constructorParams(target) : ParamNames.methodParams(target, property as string)
        )
    }

    private static methodParams(target: any, property: string): string[] {
        const pd: PropertyDescriptor = Optional
            .of(Object.getOwnPropertyDescriptor(target, property))
            .orThrow(NoPropertyDescriptorFoundError.provider(target, property));

        return Optional.of(pd.set)
            .map(ParamNames.setterParser(property))
            .orElseGet(ParamNames.nonSetterParser(property, pd));
    }

    private static setterParser(property: string): (setter: Setter) => string[] {
        return setter => ParamNames.parseSetterParams(property, setter);
    }

    private static nonSetterParser(property: string, pd: PropertyDescriptor): () => string[] {
        return () => ParamNames.parseNonSetterMethodParams(property, pd);
    }

    private static constructorParams(cls: any): string[] {
        return ParamNames.extractParams(ParamNames.findMethod(cls.toString(), "constructor"));
    }

    private static parseNonSetterMethodParams(property: string, pd: PropertyDescriptor): string[] {
        return ParamNames.extractMethodParams("method", pd?.value?.toString() ?? "", property);
    }

    private static parseSetterParams(property: string, setter: Setter): string[] {
        return ParamNames.extractMethodParams("set", setter.toString(), property);
    }

    private static extractMethodParams(kind: string, body: string, property: string): string[] {
        return ParamNames.extractParams(
            ParamNames.findMethod(
                `class ${ParamNames.CLASS_NAME} {${body}}`,
                kind,
                ParamNames.classNameFilter,
                ParamNames.propertyNameFilter(property)
            ),
        );
    }

    private static parse(source: string): any {
        return ParamNames.PARSER.parse(source, {ecmaVersion: ParamNames.ECMA_VERSION});
    }

    private static findMethod(
        source: string,
        kind: string,
        classFilter: (m: any) => boolean = () => true,
        methodFilter: (e: any) => boolean = () => true,
    ): any {
        return ParamNames.parse(source)
            ?.body?.find?.((e: any) => e?.type === "ClassDeclaration" && classFilter(e))
            ?.body?.body?.find?.((e: any) => e?.type === "MethodDefinition" && (e?.kind === kind) && methodFilter(e));
    }

    private static classNameFilter(c: any): boolean {
        return c?.id?.name === ParamNames.CLASS_NAME;
    }

    private static propertyNameFilter(property: string): (node: any) => boolean {
        return node => node?.key?.name === property;
    }

    private static extractParams(methodDescriptor: any): string[] {
        return methodDescriptor?.value?.params?.map((e: any) => {
            if (e?.type === "Identifier") {
                return e.name;
            } else if (e?.type === "RestElement") {
                return e.argument.name;
            } else if (e?.type === "AssignmentPattern") {
                return e.left.name;
            } else {
                throw new TypeError(`Unhandled parameter type: ${JSON.stringify(e, null, 2)}`);
            }
        }) ?? [];
    }

}
