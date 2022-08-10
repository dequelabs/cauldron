# Cauldron RFCs

## What is an RFC?

A request for comments, or further referred to as "RFC" is a process intended to provide a consistent and controlled path for changes to be introduced to cauldron.

Many changes, including bug fixes and documentation improvements can be implemented and reviewed via the normal GitHub pull request workflow. Some changes though are "substantial", and we ask that these be put through a bit of a design process and provide a consensus among the cauldron team.

## When to follow this process

You should follow this process if you intend to make "substantial" changes to cauldron or its documentation. Some examples that would benefit from an RFC include:

- A new component or feature
- Any breaking changes

Some changes that would not need an RFC:

- Bug fixes
- Refactoring an existing component (while maintaining the same API contract)
- Rephrasing or clarifying documentation

## How to submit an RFC

1. Create a new issue
1. Add the `rfc` label
1. Be sure to include descriptive details, this includes:
   - A descriptive title
   - Implemention details
   - Screenshots (if necessary for a new component)

## The RFC Process

The goal of our RFC process is to reach a consensus among the cauldron team on proposed changes, and to ensure that new features are congruent with the rest of cauldron. The cauldron team will have a recurring office hours meeting on the 1st Wednesday of each month, giving the team the opportunity to discuss any new RFCs that have been introduced and make comments.

Once a consensus has been reached for the proposed RFC, the `rfc` label will be removed from the issue and the proposed changes can then be implemented.
