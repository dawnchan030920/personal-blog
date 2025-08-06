+++
title = 'Easy Way Understanding Fix'
date = 2024-09-06T10:14:07Z
toc = true
math = true
tags = ["functional programming", "haskell"]
showTags = true
readTime = true
draft = false
summary = "Recursion is something that uses itself to define itself."
description = "Recursion is something that uses itself to define itself."
+++

## Introduction

Fix point of $f: A \rightarrow A$ is $x \in A$ such that $f(x)=x$.

`fix` in haskell is used to find the (least) fix point for a function, which has the type `(a -> a) -> a`. It's also widely used as a helper function for writing recursive functions.

But how, and why?

## Fix and Recursive Functions

### Generalise Recursive Function

We can first describe recursive functions without using the word "recursive".

> Recursive function is function that use itself.

In functional programming, "used" often refers to "being fed as the parameter". Therefore, recursive functions share the following structure:

```haskell
-- f is the recursive function
-- g is an arbitrary function used as the container where 'f' is fed into.
f = g f
```

With the concept of fix point bear in mind, it's obvious that `f` is the fix point of `g`. The only thing left is how to define `g`.

### Conceptual Power of Laziness

Haskell features **lazy evaluation**, which means that the right side is not **immediately** replacing the left side. Therefore, we're given the conceptual power to think of them as separate things, and perform the replacement when needed.

Here `g` plays two roles:
1. As part of the definition of `f`;
2. As something that uses `f`.

Obviously, `g` is the thing left after factoring the use of `f` out of the definition of `f`. Since what we need is merely the definition of `f` and a parameter that will serve as the `f` which is usually named `rec`, `g` now has nothing to do with recursion.

### Gain f from g

According to the above, `f` is the fix point of `g`. Therefore, the definition of `f` can be constructed from `g` as:

```haskell
f = fix g
```

## Old School Factorial Example

With basic knowledge of `fix`, let's introduce a classical example: the *factorial*.

The canonical recursive definition of factorial is:
```haskell
factorial n = case n of
                0 -> 1
                n -> n * factorial (n - 1)
```

With previous knowledge, we can write another definition which is not (explicitly) recursive:

```haskell
factorial' = \rec -> \n -> case n of
                            0 -> 1
                            n -> n * rec (n - 1)
factorial = fix factorial'
```

## Operational View

So far, we have only tried to gain some intuition about `fix` from a semantical view. What about the actual code?

Actually, hiding the recursion from our code is not a magic: we just let someone else do the thing for us.

Writing code is not as free as writing equations: we need to **resolve the thing out**. The good thing is that being able to **prove the correctness** of such definition is enough; we don't need the *actual answer*. Therefore, `fix` can be defined as
```haskell
fix f = let x = f x in x -- the same as: x where f x = x
        -- or: f (fix f), which is more obvious.
```

In fact, the first one uses a feature from Haskell called **recursive binding**, which is provided as `let rec` in some other languages. The second one is explicitly being recursive.

Expanding `fix` results in an infinite sequence `f f f..`. However, how does it automatically *find* the fix point? The only thing we know is that by definition `fix` should converge to the fix point.

Well, language system doesn't know how to reason; it only computes. There are chances when it succeeds, or not. If it does succeed, we then know that it's the fix point.

There's acutally theoretical stuff behind that defines and hence completes the "failed" part.

### Manual Expansion

Luckily, we now have an example that can succeed due to some features of Haskell, which is the *factorial*. Take `fix factorial' 5` for example. Obviously `fix factorial'` is an infinite sequence, and due to the fact that Haskell is lazy, we can keep this notion where we want.

```haskell
fix factorial' 5
= factorial' (fix factorial') 5
= case 5 of
    0 -> 1
    n -> n * (fix factorial' 4)
= 5 * (fix factorial' 4)
= ..
= 5 * (4 * (3 * (2 * (1 * (fix factorial' 0)))))
= .. * factorial' (fix factorial') 0
= .. * 1
= 120
```

The smart thing happens on the third to last line, where we ignore the further expansion of `fix factorial'` and converge `factorial' _ 0` to 1.

During the process, we don't even need to know what `fix factorial'` is like; we just define it, use it, get the answer, and that's it.

Similar thing happens when evaluating `fix (const x)`: it'll be evaluated to `x`.

## Conclusion

Understanding `fix` is not difficult. It's actually a good example of combining the theory and the implementation.

There're a lot of things missing or simplified in this post. Further information can be gained from the [Haskell Wikibook](https://en.wikibooks.org/wiki/Haskell) or the [book "Denotational Semantics - A Methodology for Language Development"](http://www.cis.ksu.edu/~schmidt/text/densem.html).
