# noscript-ui
Mockup User Interface for NoScript 10.x

## Demo

*Note: This is a work in progress. This demo is designed to work in Firefox Quantum. It will not work in older browsers lacking ES2015 support.*

https://mattok.github.io/noscript-ui/

## Aims

Develop a user interface for NoScript 10.x that has the following properties:

- *Simple to use by anyone.* Requiring virtually no knowledge of the web and web security. (I want my whole family to be able to use it.)
- *Highly configurable* for users that want full control.
- Users should be able to *understand what is being blocked and allowed* at a glance.
- Will act as a true *whitelist*, blocking all by default in the first instance.
- NoScript UI will *learn what you want quickly*, globally and site by site, thus very quickly minimising disruption while browsing common. (Overcome the annoying 5.x requirement to temporarily allow the same scripts every time you visit a given site because you don't want to allow them everywhere.)
- Prefer *plain-English* text over obscure iconography.
- Should be *accessible* and work just as well for *mobile and desktop*. (Responsive. No reliance on double-clicking, hovering, etc. Thinking of Firefox for Android.)
- Avoid unnecessary embellishments, gimmicks, animations, effects etc.

## Current dependencies

- jquery https://github.com/jquery/jquery.git
  For Bootstrap and noscript-ui. Dependency could probably be fairly easily removed from noscript-ui.
- popper.js https://github.com/FezVrasta/popper.js.git
  For Bootstrap.
- bootstrap https://github.com/twbs/bootstrap.git
- nano-tpl https://github.com/mattok/nano-tpl.git
  ES2015 HTML templating solution.
  Required for noscript-ui.
  (I wrote this for this project!)
- URI.js https://github.com/medialize/URI.js.git
  For parsing URLs within noscript-ui.
- EcmaScript 2015 (present in Mozilla Quantum)

## To do

- With this design, undoing a rule is one click away, so everything is temporary in that sense. However, there may still be a desire to make a change that is only stored for the current session, and not permanently. Build this into the design.
- The uncategorised URL components bar is bugged. It occasionally allows invalid combinations (nothing selected, subdomain selected without domain selected, etc.) The logic to prevent this is not always being applied. Fix.
- Bootstrap has been used to very quickly build a responsive design, but it hasn't been done very well! Needs a lot of tinkering. General principle only really been tested on desktop screen at the moment.
- Preferences screen is not yet implemented.
  - Provide a list of common rules, site-by-site, with explanations for why you might use them. Allow users to add them to their policy, one-by-one, or all at once.
  - Allow users to enable allowing first party resources by default.
    * Allow the user to define what is means by first party. Just domain, domain and subdomain, protocol, etc?
    * Allow the user to define the types of first party resources they will allow by default. Just scripts?
    * Since this is a mockup, nothing is currently stored in local storage. The configuration should be.
    * Allow the user to view and save their current policy.

## License

MIT license, see `LICENSE`.
