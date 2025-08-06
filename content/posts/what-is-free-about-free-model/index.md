+++
title = 'What Is Free About Free Model'
date = 2025-04-21T19:09:29+08:00
draft = false
toc = true
math = true
tags = ["free model"]
showTags = true
readTime = true
summary = "Syntax itself is the free model for signature."
description = "Syntax itself is the free model for signature."
+++

## Background

I was trying to get an overview of algebraic effect, and I found the famous paper ["What is algebraic about algebraic effects and handlers?"](https://arxiv.org/abs/1807.05923). After reading it thoroughly I felt like grasping the main idea, however, left with some details haunting me.

And they really prevent me from digging into practical proofs and construction, which further prevents me from understanding another paper namely ["Algebraic Effects Meet Hoare Logic in Cubical Agda"](https://dl.acm.org/doi/10.1145/3632898) which initially ignites my interest in algebraic effect.

Also I'm trying to get rid of understanding them through *code*, which should be put on **top** of maths, and actually that's the whole idea of formalisation.

It turns out that among all the questions arise, the core one is:

**Free Model**.

## Construction

The construction of a free model of an algebraic theory is quite straight. Core steps are listed below:

1. Define $Tree_{\Sigma_{T}}(X)$;
2. Define $\approx_{T}$;
3. $F_T(X)=Tree_{\Sigma_{T}}(X)/\approx_{T}$, which is the free model for $\Sigma_T$

## X and I: Diverge

Models are **interpretations** that respect algebraic equations. When we define an interpretation $I$, we define the carrier set(type) $|I|$ and how to turn terms into them for a specific operation, which is of the type:

```haskell
[|op|] :: (P, A -> |I|) -> |I|
```

**There's no $X$ here.**

$X$ is for building trees, or providing the *variable environment* for terms and equations which can be turned into trees.

It is that $X$ and $I$ are **different** things that interpretations can be **extended** to trees:

```haskell
[|t|] :: (X -> |I|) -> |I|
```

The above type can be thought as **evaluating the value of the tree based on the environment**.

The definition for the `op` case is based on the interpretation provided for the corresponding operation.

## Freeness: Merge X and I

**It is that $X$ and $I$ are different that merging them is a special case.**

It is told and verified that $F_T(X)$ is the free model of the theory.

Intuitively it means that, **the syntactic meaning for free is the syntax itself plus equations**, since trees can be regarded as a faithful construction of syntax, and $F_T(X)$ is the quotient of it divided by equations.

The interesting part is that we don't need an independent $|I|$, which is almost a trivial statement since it is being *constructed* as $F_T(X)$ now. Since $I$ can be built of $X$ now,

1. Evaluation is done directly on **syntax**, more specifically **from and to** syntax,
2. One don't have to distinguish $X$ and $I$ which means $X$ is now conceptually **any set** rather than indexes over values. $x\in X$ can be a value.

## Further

The conclusions drawn above clarifies a lot of misunderstanfings, especially when I'm encountered with Monad related proofs - I just can't figure out *why* they correspond to each other since they're just too similar *in forms*.
