+++
title = 'Place of Web Components'
date = 2024-06-20T15:43:05Z
toc = true
tags = ["web components", "architecture"]
showTags = true
readTime = true
draft = false
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

The solution is obvious: extract state handling out of web components. Web components should be **state-less**, or more specific, **state-handling-model-agnostic**. They should be used for stateless reuse, **not for wrapping business logic**, which brings with it the complexity of handling state.

At the same time, the value should not be obtained from the attribute, which means that attributes are readonly. Once they're set, the logic of the component is determined, and all the *dynamic thing* should be done through event listening.

## Advantage

1. Easier to build web components.
2. Wider range and more flexible use of state handling strategies/libraries/frameworks, because they're free from the context of web components.
3. Less bundle size, becasue state handling logics are removed. Now web components are mostly static.
4. Easy to adjust business logic and state, because it's no longer in the web components.

## Implementation

> The following sample can be found in the [sample repo](https://github.com/dawnchan030920/business-state-free-web-component-sample).

There're multiple approaches to use web components in a stateless way. But generally, they can be divided into two steps:

1. Make web components stateless.
2. Set up state model outside of web components.

Still, let's take the good old counter as the example. However, this time we won't start with the web component; we start with the **business logic** and see what should be done in the web component and what should not.

Requirements:

1. Init with a value.
2. Different step number.
3. Get the value from outer world.

The crucial point here is that can outer world set the **current value** of the counter? Or to be expressed in another way: how deep should the outer world interfere with the logic inside of the counter? Should the outer world take the number that's updated to and transform it and give it back to the counter to show?

Here we assume that the extra requirement is **not** needed. Therefore, there're some inner states remained. Inner states are not terrible thing; sometimes they're the key to maintaining state-free.

Therefore, the prototype looks like this:

```html
<counter-add initial-value="0" step="5"></counter-add>
```

Notice the "init" prefix. We don't want the attribute to be too smart and hence we degrade the smartness of the attribute. We're setting **initial** value.

It's like IO monad in Haskell. We just throw a `getLine` or `putStrLn $ s` and we don't really care about the inner state. It's blocked out from our vision, which makes the monad "the same".

### Extract State

The key point in extracting state is to distinguish between business state and component state. Usually, the latter one is determined by the former one, which means that "something that does not need to be used in business logic and has to be treated as state" is component state.

One thing to notice is that the web component should look **"declarative"** after extracting state. Declarativity here is a little bit different from the one used in other contexts. Here it refers to the fact of the data being **"one-way" and not "reactive"**. Business state is something that should be transmitted between the component and the outer world both in "one-way". Attributes should **not** be the single source of truth for both the component and the outer world, and the component should therefore not try to change the attribute to reflect the change.

To make the web component more "native-like", we can also add a getter for the value since the event won't be triggered during initialization.

We have already discussed the business logic and hence completed this part.

### Set Up State Outside

Here we use rxjs to set up an FRP state managing model for it.

Make your own choice on how to manage state and there're no constraints. You can use React Hooks or Elm architecture. Just whatever you like since it's merely HTML.

## Conclusion

The best place for web components in architecture is based on the specific use case and there're no silver bullets.

However, the extracting of business logic and hence *state* makes web components more reusable and more *native-like*, therefore lays the foundation for different usages. But it should also be noticed that the recognition and indentifying of business logic and state are based on the use case.

Give such pattern a try!
