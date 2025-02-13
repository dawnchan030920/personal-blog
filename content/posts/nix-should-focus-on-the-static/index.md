+++
title = 'Nix Should Focus on the Static'
date = 2025-02-12T12:33:25+08:00
draft = false
+++

## Cause

My Firefox on NixOS met a problem: everytime the home environment is rebuilt, the `~/.mozilla` folder must be removed for home-manager to set up configs. Therefore, all stored information, including those that cannot be generated from `Nix` like history, passwords, etc are lost.

Blaming `Nix` for overriding those information is almost the sudden reaction. However, home-manager is just doing its job: reproduce the **same** thing. The problem is that we're requiring something that should **not** be considered part of reproducibility - which is exactly the opposite.

**`Nix` is just not for representing such information**.

## Static and Dynamic

Intuitively, any thing contains both static and dynamic elements. Let's first analyze some scenarios and divide them into these two parts, then summarize the composition of the concepts of static and dynamic, which are universal across different contexts, and explore why `Nix` greatly reflects these characteristics.

### Runtime

The general definition of **Runtime** refers to all things related to the running of an application. It is easily misunderstood that runtime is dynamic. It's not true.

The environment of runtime can be static. All the runtime dependents required can be determined and pinned to a specific version in advance.

However, all the information collected along with the running and the *dynamic* adjustment of components like load balancer are obviously dynamic.

### Development (Shell)

Development shell requires a lot of static utilities. Tasks are required to run specific groups of commands to calculate some results. Services are required to be set up for running the application. This is why there're `CMake` and alternatives like `Just`.

What about the dynamic ones? Well, actually, the `code` being developed is the dynamic part.

### Browsing

Let's take Firefox for example. Firefox Sync provides a bunch of available things to be synced: bookmarks, search engines, passwords, history... The border can be vague - it really depends on your scenario. But, still, every scenario leads to two groups, not one, though groups can be empty.

To me, the first two are static and the rest are dynamic.

### Conclusion

The static is about the declaration and the definition which stay still along with time. For the static, changes are **external**. For the dynamic, however, changes are **internal**.

Obviously, the concepts of dynamic and static are relative. The same thing can be considered dynamic or static in different contexts.

## Reflection by Nix

`Nix` is a functional programming language. Once the expression is determined, the result is determined.[^1] It's considered **statically** naturally, since there's no **compile time** or **runtime** for `Nix`.[^2]

The lack of the stages mentioned above also indicates why `Nix` is not suitable for representing dynamic things. `Nix` is tailored for configuration. It's for configuration, so it's not used to build a web server or connect to a database. It does have the potential to do other things but why will we want such feature?

The different thing between `Nix` and other programming-like config languages such as `Dhall` is that it can also represent the blueprint of a package, which extends the range of the **static** things it can represent - the runnable thing is now **static**. Therefore, scenarios that treat packages/binaries as static things can now be defined in `Nix`.

## What to Do with the Dynamic

Define the tool that can handle it, using Nix. That's it.

Examples are: Convert Nix to k8s manifast; config your system Git hosting platform; config your syncing account.

[^1]: ...to some extent. Actually there's no guarantee that it'a pure. However the community is pushing the purity of its usacase to make the most out of a functional programming language. Examples include `flake` and the explcitily `--impure` flag.

[^2]: There's parsing stage, but it's inappropriate to say *compile the S-expression*.
