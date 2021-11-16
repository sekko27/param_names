# PARAM-NAMES

## Introduction

Parse method (constructors, methods, static methods, setters) parameter names mostly because typescript compiler does not emit this kind of information.

It also caches the result so subsequent calls can be served from it.

The initial implementation uses the [acorn](https://github.com/acornjs/acorn) and the [acorn-class-fields](https://github.com/acornjs/acorn-class-fields) modules and expose utility methods based on this implementation.

## Supports

Tested on

* constructor / method / static method / setter parameters
* rest parameters
* generics
* default parameters

## Usage

The utilities prepared to easy use in decorators.

```typescript
import {
    parseConstructorParamNames,
    parseMethodParamNames,
    parseSetterParamNames,
    parseStaticMethodParamNames
} from "https://deno.land/x/param_names/mod.ts";

const PrintConstructorParamNames = (cls: any) => console.log(parseConstructorParamNames(cls));
const PrintMethodParamNames = (proto: any, method: string) => console.log(parseMethodParamNames(proto, method));
const PrintSetterParamNames = (proto: any, property: string) => console.log(parseSetterParamNames(proto, property));
const PrintStaticMethodParamNames = (cls: any, method: string) => console.log(parseStaticMethodParamNames(cls, method));

// Will print ["p1", "rest"]
@PrintConstructorParamNames
class Test {
    constructor(private readonly p1: number, ...rest: boolean[]) {
    }
    
    // Will print ["input", "limit"]
    @PrintMethodParamNames
    public async method(input: ReadableStream, limit: number = 1024): Promise<WritableStream> {
        // ...
    }

    // Will print ["value"]
    @PrintSetterParamNames
    set name(value: string) {}

    // Will print ["arr", "mapper"]
    @PrintStaticMethodParamNames    
    protected static async staticMethod<T, R = any>(arr: T[], mapper: (value: T) => R): Promise<R[]> {
        // ...
    }
}
```

## Testing

> deno test --allow-all --config ./tsconfig.json
