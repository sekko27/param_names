[![param_names ci](https://github.com/sekko27/param_names/workflows/Deno/badge.svg)](https://github.com/sekko/param_names)
[![codecov](https://codecov.io/gh/sekko27/param_names/branch/master/graph/badge.svg?token=PEIMOKPEB6)](https://codecov.io/gh/sekko27/param_names)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/param_names/mod.ts)

![Custom badge](https://img.shields.io/endpoint?url=https://deno-visualizer.danopia.net/shields/dep-count/x/param_names/mod.ts)
![Custom badge](https://img.shields.io/endpoint?url=https://deno-visualizer.danopia.net/shields/updates/x/param_names/mod.ts)
[![Custom badge](https://img.shields.io/endpoint?url=https://deno-visualizer.danopia.net/shields/latest-version/x/param_names/mod.ts)](https://deno.land/x/param_names)

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
} from **https://deno.land/x/param_names/mod.ts**;

const PrintConstructorParamNames = (cls: any) => console.log(parseConstructorParamNames(cls));
const PrintMethodParamNames = (proto: any, method: string) => console.log(parseMethodParamNames(proto, method));
const PrintSetterParamNames = (proto: any, property: string) => console.log(parseSetterParamNames(proto, property));
const PrintStaticMethodParamNames = (cls: any, method: string) => console.log(parseStaticMethodParamNames(cls, method));

// Will print [**p1**, **rest**]
@PrintConstructorParamNames
class Test {
    constructor(private readonly p1: number, ...rest: boolean[]) {
    }
    
    // Will print [**input**, **limit**]
    @PrintMethodParamNames
    public async method(input: ReadableStream, limit: number = 1024): Promise<WritableStream> {
        // ...
    }

    // Will print [**value**]
    @PrintSetterParamNames
    set name(value: string) {}

    // Will print [**arr**, **mapper**]
    @PrintStaticMethodParamNames    
    protected static async staticMethod<T, R = any>(arr: T[], mapper: (value: T) => R): Promise<R[]> {
        // ...
    }
}
```

## Testing

We exclude lint checks for **no-explicit-any**, **ban-types**, **require-await**, **no-unused-vars**, **no-inferrable-types**, 
because we test parameter names not the implementations. We also add **--no-check** flag for ignore ts errors in tests.

> deno test -A --unstable --coverage=./.cov --no-check --config deno.json

