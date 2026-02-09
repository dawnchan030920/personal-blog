+++
title = 'All About Consistencies'
date = 2026-02-09T20:55:32+08:00
toc = true
math = true
tags = ["architecture", "domain driven design", "hexagon architecture"]
showTags = true
readTime = true
draft = false
summary = "Implementation of DDD in Hexagon Architecture is all about its quantizied consistencies."
description = "Implementation of DDD in Hexagon Architecture is all about its quantizied consistencies."
+++

## Introduction

DDD and Hexagonal Architecture seem to be a good combo. However, they were not born for each other. That is to say: 1) the latter doesn't even use the terms of the former, meaning some concepts are defined on one side and used on the other for the wrong sake; 2) the overlapping of two totally different levels gives birth to insights that are never considered in either context alone.

This post introduces one of those insights: **there are different consistencies.**

## Domain and Business

According to DDD, business is divided into different domains, which are refined into "ubiquitous languages," namely "Bounded Contexts." Let's just call it "a domain." Obviously, domain and business are different: the latter is shattered into multiple former ones.

This reflects on the division of the "core layer" of Hexagonal Architecture: there's an "application layer" wrapping an inner "domain layer." From the standpoint of architectural topology, the application layer is just an intermediate layer for the "presentation" and "infrastructure" to access the domain, which brings us nothing interesting. 

The interesting thing surfaces, ironically, when you think about the implementation details of use cases (also named the Application Service, the unit of the application layer). You know there's something called a "database transaction," and if the application layer is where DAOs are injected, it has to do something with transactions. So, what's the size, or boundary, of the transaction? Undoubtedly, the beautiful answer is "the use case." 

However, we all know that domains have their own "consistency": a domain service or an aggregate behavior enforces its consistency implicitly, since they are all grouped in an independent function (method). The good news is that they write only to memory, so they can just be blown away. However, there's a weird thing called "Repository" with its iconic method `save`, which seems to do something with persistence and disk. It can't be a country inside a country, right?

Yes. Usually, `save` is implemented as part of a Unit of Work, which means it doesn't commit to the database immediately; it just registers the change to the current transaction as part of the atom.

There is an interesting contradiction here. When you think about the correspondence between "business use case" and "domain behavior" in reality, the former is often represented by logical or virtual entities (such as rituals and documents), while the latter is completely "real"—each action occurs tangibly in this world rather than in a "future world." However, when we simulate these two in information systems, a shift occurs: the former confirms and represents changes to "the real world" through persistence, while the latter happens in transient memory as part of the imagination.

## Individual/Internal and World/Life

What is a "Repository"? Is it an interface between the clean, pure domain layer and the dirty, impure infrastructure layer? Yes, it is. That's why it has no body and is just an interface. However, it is much more than that.

When you think about the domain layer thoroughly, you notice there's something missing: the **set** of aggregates. It's impossible to model every domain invariant within independent instances of a single aggregate type. Obviously, the set of aggregates also contains domain semantics, especially when you "insert" or "delete." 

The key to admitting the necessity of the set's existence is to realize that: 
1. Aggregates have a **life cycle**.
2. An aggregate cannot express the transition of its own life cycle; it only expresses the transition of its **state**, which is internal. 

It's sad, but real: individuals can't control their own existence. Their birth or death must be confirmed and executed by their set, or in my words, their "world." This intertwining reveals an isomorphism between *"world" and "life"*.

This duality is also naturally reflected in the semantics that repositories hold: they provide you with set/list-wide read/writes, and they provide `save` and `delete` (lifecycle operations).

Note that lifecycle behavior doesn't mean it must operate on more than one aggregate. It just operates **set-wide**, which means it can operate on a whole but single aggregate (like `delete` or `save`) or even just part of it, which will be shown in the example below.

But sometimes, knowing whether a behavior is about internal state or lifecycle can be a problem. The definitive judgment is to check **whether the internal consistency relies on the premise of input**. 

Note that changing your reference to other aggregates' domain IDs is **not** a lifecycle behavior, since whether the referenced domain ID exists never influences the internal state. What the aggregate cares about is that the ID fits the type it refers to.

### Example

Assume that you're developing a feed subscription system. When you take a new item snapshot, you want to find whether it's already there and update that instead of creating a new one. 

Think about the behavior "update the item." It seems like an aggregate's inner behavior. Assume it is `updateItem(original: ItemAggregate, new: ItemState)`. Now you have to ensure that the `new` state is indeed valid for updating the `original`, a check which should technically be ensured by your caller (the domain service that searches through the set of item aggregates and picks the one—or not). 

However, the aggregate behavior can't control where it's called. Obviously, this indicates that this method is not internal, but a **world-wide** one. Under the *life* metaphor, we can give it a very accurate name: **replace**. Now think about it: the aggregate never bothers being updated by a valid but probably inappropriate state. The domain service that decideds on the appropriateness just kicks the old one off the *world* and brings in a new one.

If the `replace` method is implemented brutally and just posts a new aggregate with a **new ID**, it means that all references to the **former ID** should be changed, but the other information remains. It's exactly where a partial modification emerges during lifecycle behavior. Of course we don't have to do that this way, and it doesn't influence the Repository interface, which is in the domain layer, at all.

It also proves that the use of repository and the coordination between different aggregates inside of the same domain is aligned correctly at domain service. The two actually reflect the same concept: the *world/life* view.

## Conclusion

There are different consistencies, and their differences only show up when you think about how different levels of DDD concepts interact, which is revealed by the design and implementation of DDD in Hexagonal Architecture. Just don't mix them up. They are quantized.
