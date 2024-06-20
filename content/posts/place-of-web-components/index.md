+++
title = 'Place of Web Components'
date = 2024-06-20T15:43:05Z
toc = true
tags = ["web components", "architecture"]
showTags = true
readTime = true
draft = true
+++

## Problem

Web Components are widely **misused**. Guides and frameworks invest a lot of time and resources into upgrading web components into something capable of handling **state**.

However, state should not be handled by web components. It doesn't mean that they can't hold states; actually, handling states here refers to 2 facts:

1. Be used to build business-level logics.
2. Reactivity is considered a feature.

And this is what's happening with `Lit`, one of the most powerful and popular web component building framework.

The consequence is that, although `Lit` declares its platform-agnostic-ability, `Lit`-built web components play best with themselves considering the state-handling model, not *native* ones, which prevents one of the biggest advantage of web component from taking effect, that it is a *native standard* that should be welcomed and adopted and used to its maximum without any pre-requirements.

What's worth emphasizing is that, `Lit`-built web components not being used to its most doesn't mean that it can't compare with ones built without `Lit`. The problem is that, if the advantage of `Lit` can't take effect, why still use it?

## Solution

The solution is obvious: extract state handling out of web components. Web components should be **state-less**, or more specific, **state-handling-model-agnostic**.

Web components should be used for stateless reuse, **not for wrapping business logic**, which brings with it the complexity of handling state.

## Advantage

1. Easier to build web components.
2. Wider range and more flexible use of state handling strategies/libraries/frameworks, because they're free from the context of web components.
3. Less bundle size, becasue state handling logics are removed. Now web components are mostly static.

## Implementation
