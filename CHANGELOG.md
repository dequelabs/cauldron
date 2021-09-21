# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.0](https://github.com/dequelabs/cauldron/compare/v1.0.0...v2.0.0) (2021-09-20)

### ⚠ BREAKING CHANGES

- This pr removes the light/dark variant options for IconButton and TopBar.

### Features

- Adds stepper (progress) component ([#301](https://github.com/dequelabs/cauldron/issues/301)) ([a980190](https://github.com/dequelabs/cauldron/commit/a9801907229337c137b1668019fcd15aa37e81fb))
- apply themes to Loader and LoaderOverlay ([#342](https://github.com/dequelabs/cauldron/issues/342)) ([52d4a1a](https://github.com/dequelabs/cauldron/commit/52d4a1aeef1a2e3172c1136114b818450a976887))
- Dark theme support for modals ([#329](https://github.com/dequelabs/cauldron/issues/329)) ([5aade53](https://github.com/dequelabs/cauldron/commit/5aade5339c562c7f029e35753a457688e73732fd)), closes [#325](https://github.com/dequelabs/cauldron/issues/325)
- support for dark theme buttons and links ([#321](https://github.com/dequelabs/cauldron/issues/321)) ([f787364](https://github.com/dequelabs/cauldron/commit/f78736437aae8277d90b04b564884da1cd0289b8))
- supports dark/light theme for topbar & icon buttons ([#326](https://github.com/dequelabs/cauldron/issues/326)) ([d331084](https://github.com/dequelabs/cauldron/commit/d33108416f12356d7cf97ccddf18a1c1a00045e7))
- **react:** add "info" variant for modal that uses an unstyled heading ([#298](https://github.com/dequelabs/cauldron/issues/298)) ([c83d642](https://github.com/dequelabs/cauldron/commit/c83d64288752da52e09e886f288f01e5c6e5bff0))

### Bug Fixes

- optional icon button props ([413ccbc](https://github.com/dequelabs/cauldron/commit/413ccbc675fd483a86efef5602705008e873765f))
- skip link text missing space ([0dcee61](https://github.com/dequelabs/cauldron/commit/0dcee61c9da3900128da0cee4c9b84dd4ada43e0))
- **IconButton:** include additional tooltip props for IconButton ([#311](https://github.com/dequelabs/cauldron/issues/311)) ([97cc094](https://github.com/dequelabs/cauldron/commit/97cc094fbf0e99c4c8ae9958fd5c7472492c26e9))
- make Info modal heading symmetrical ([#304](https://github.com/dequelabs/cauldron/issues/304)) ([84c28a0](https://github.com/dequelabs/cauldron/commit/84c28a068ef30eee7222c2de7c7996effc3b968c))
- make variant optional for Modal ([#305](https://github.com/dequelabs/cauldron/issues/305)) ([3ad6ac9](https://github.com/dequelabs/cauldron/commit/3ad6ac953a2f500dfe63d9592d962af80f5438f5))
- **performance:** do not render tooltip when an icon button is disabled ([#303](https://github.com/dequelabs/cauldron/issues/303)) ([d3c0fb4](https://github.com/dequelabs/cauldron/commit/d3c0fb49fecd44e7526a052520abd52e7ba607ba))

## [1.0.0](https://github.com/dequelabs/cauldron/compare/v0.2.6...v1.0.0) (2021-07-28)

### ⚠ BREAKING CHANGES

- **react:** Loader component now set role, aria-valuetext, aria-busy, aria-valuemin, and aria-valuemax instead of making a generic role (div) have an aria-label
- **Select:** selects now have parity with <TextField /> s in that they always render an .Error div. This causes a slight layout difference with more space below each <Select />. The text "Required" will now show up with any <Select /> who is passed a true required prop.

### Features

- **react:** Sets progressbar attributes on Loader ([#289](https://github.com/dequelabs/cauldron/issues/289)) ([f865166](https://github.com/dequelabs/cauldron/commit/f8651666a321fa02a418152e97ad908cd429f3e4)), closes [#53](https://github.com/dequelabs/cauldron/issues/53)
- **Select:** Adds support for required/error ([#296](https://github.com/dequelabs/cauldron/issues/296)) ([4b0dfec](https://github.com/dequelabs/cauldron/commit/4b0dfecfa295a550e27ced833e97dabf7ea9eb1c)), closes [#89](https://github.com/dequelabs/cauldron/issues/89)
- **Toast:** Adds support for error type ([#297](https://github.com/dequelabs/cauldron/issues/297)) ([10d3089](https://github.com/dequelabs/cauldron/commit/10d308976042cc48100ca7e7d4994cba59801583)), closes [#106](https://github.com/dequelabs/cauldron/issues/106)
- add download icon ([77f186d](https://github.com/dequelabs/cauldron/commit/77f186dbc6c24fd13071e5b40cfd0f2964bbc97d))

### Bug Fixes

- **react:** remove unsupported props for alert component ([#180](https://github.com/dequelabs/cauldron/issues/180)) ([f5bf264](https://github.com/dequelabs/cauldron/commit/f5bf264dc33bf62fa59f2ceae6ac0106ce161677))

### [0.2.6](https://github.com/dequelabs/cauldron/compare/v0.2.5...v0.2.6) (2021-07-23)

### Features

- style updates to TextFields (and better docs) ([#290](https://github.com/dequelabs/cauldron/issues/290)) ([b2de8e0](https://github.com/dequelabs/cauldron/commit/b2de8e0dc34236e9ca701bd98d565b15ffa04d0e)), closes [#102](https://github.com/dequelabs/cauldron/issues/102) [#87](https://github.com/dequelabs/cauldron/issues/87) [#175](https://github.com/dequelabs/cauldron/issues/175)
- **react:** add TooltipTabstop component ([#284](https://github.com/dequelabs/cauldron/issues/284)) ([183af54](https://github.com/dequelabs/cauldron/commit/183af54415c452e7c9412933485c138df5b93b7f))
- **react:** Adds theme provider ([#292](https://github.com/dequelabs/cauldron/issues/292)) ([d34ee25](https://github.com/dequelabs/cauldron/commit/d34ee2518d52336b3c548c497b9253da689e4869)), closes [#283](https://github.com/dequelabs/cauldron/issues/283)
- **styles:** Adds full color palette ([#265](https://github.com/dequelabs/cauldron/issues/265)) ([f1f02ff](https://github.com/dequelabs/cauldron/commit/f1f02ff765224af74e0c9c4f630334e81480ec69))

### Bug Fixes

- **react:** use background color instead of scrim for proper scrolling with dialogs ([#293](https://github.com/dequelabs/cauldron/issues/293)) ([471280a](https://github.com/dequelabs/cauldron/commit/471280adb0235a2f4e7ddda7aaeee6c3182a4576))

### [0.2.5](https://github.com/dequelabs/cauldron/compare/v0.2.0...v0.2.5) (2021-06-28)

### Features

- **components:** Apply light/dark theme to TopBar ([#279](https://github.com/dequelabs/cauldron/issues/279)) ([e753f30](https://github.com/dequelabs/cauldron/commit/e753f30bf0a22065292da7832c0bdb625c73680d))
- **icons:** Adds highlight icon ([#269](https://github.com/dequelabs/cauldron/issues/269)) ([8a2e2ff](https://github.com/dequelabs/cauldron/commit/8a2e2ffdbb3fc65522cec8b4d77908814b6b09df))
- add disabled styles to IconButtons ([#184](https://github.com/dequelabs/cauldron/issues/184)) ([4fef23f](https://github.com/dequelabs/cauldron/commit/4fef23f76efa410cc0319664a1bbaf70a5571195))
- adds 'add-user' icon ([#263](https://github.com/dequelabs/cauldron/issues/263)) ([051de48](https://github.com/dequelabs/cauldron/commit/051de4848237b548293255f69a141b5daecbe6ec))
- adds 'check-shield' icon ([#262](https://github.com/dequelabs/cauldron/issues/262)) ([fc8727d](https://github.com/dequelabs/cauldron/commit/fc8727d828593bbed428254f6bd8e6f2f8d15c83))
- Adds DescriptionList components ([#258](https://github.com/dequelabs/cauldron/issues/258)) ([ab5bf6c](https://github.com/dequelabs/cauldron/commit/ab5bf6c4ef58b2c0b2a8e2e0b1f431bf1bc2ee9a))
- Adds simple table ([#255](https://github.com/dequelabs/cauldron/issues/255)) ([02b4f1b](https://github.com/dequelabs/cauldron/commit/02b4f1b0c600d71bb106af2c46667660b92a1b29))
- **icons:** Add a share icon ([#249](https://github.com/dequelabs/cauldron/issues/249)) ([5af005d](https://github.com/dequelabs/cauldron/commit/5af005dda138c374475c2c47c68c90d529d05620))
- **react:** Support YAML highlighint in Code component ([#247](https://github.com/dequelabs/cauldron/issues/247)) ([d71003d](https://github.com/dequelabs/cauldron/commit/d71003d23267eae8081196672bfa7f4d29d9feb3))

### Bug Fixes

- **react:** Makes "value" optional in RadioGroup ([#268](https://github.com/dequelabs/cauldron/issues/268)) ([62fed42](https://github.com/dequelabs/cauldron/commit/62fed4293ac6093fa17db6a41cbc2e5f96985cb1))
- pass classnames from menubar to rendered ul ([#241](https://github.com/dequelabs/cauldron/issues/241)) ([cffd938](https://github.com/dequelabs/cauldron/commit/cffd9389450465827ad6622d99de0e75ec61ed10))

### [0.2.4](https://github.com/dequelabs/cauldron/compare/v0.2.3...v0.2.4) (2021-06-10)

### Features

- **icons:** Adds highlight icon ([#269](https://github.com/dequelabs/cauldron/issues/269)) ([8a2e2ff](https://github.com/dequelabs/cauldron/commit/8a2e2ffdbb3fc65522cec8b4d77908814b6b09df))

### Bug Fixes

- **react:** Makes "value" optional in RadioGroup ([#268](https://github.com/dequelabs/cauldron/issues/268)) ([62fed42](https://github.com/dequelabs/cauldron/commit/62fed4293ac6093fa17db6a41cbc2e5f96985cb1))

### [0.2.3](https://github.com/dequelabs/cauldron/compare/v0.2.2...v0.2.3) (2021-06-02)

### Features

- adds 'add-user' icon ([#263](https://github.com/dequelabs/cauldron/issues/263)) ([051de48](https://github.com/dequelabs/cauldron/commit/051de4848237b548293255f69a141b5daecbe6ec))
- adds 'check-shield' icon ([#262](https://github.com/dequelabs/cauldron/issues/262)) ([fc8727d](https://github.com/dequelabs/cauldron/commit/fc8727d828593bbed428254f6bd8e6f2f8d15c83))

### [0.2.2](https://github.com/dequelabs/cauldron/compare/v0.2.0...v0.2.2) (2021-06-01)

### Features

- add disabled styles to IconButtons ([#184](https://github.com/dequelabs/cauldron/issues/184)) ([4fef23f](https://github.com/dequelabs/cauldron/commit/4fef23f76efa410cc0319664a1bbaf70a5571195))
- Adds DescriptionList components ([#258](https://github.com/dequelabs/cauldron/issues/258)) ([ab5bf6c](https://github.com/dequelabs/cauldron/commit/ab5bf6c4ef58b2c0b2a8e2e0b1f431bf1bc2ee9a))
- Adds simple table ([#255](https://github.com/dequelabs/cauldron/issues/255)) ([02b4f1b](https://github.com/dequelabs/cauldron/commit/02b4f1b0c600d71bb106af2c46667660b92a1b29))
- **icons:** Add a share icon ([#249](https://github.com/dequelabs/cauldron/issues/249)) ([5af005d](https://github.com/dequelabs/cauldron/commit/5af005dda138c374475c2c47c68c90d529d05620))
- **react:** Support YAML highlighint in Code component ([#247](https://github.com/dequelabs/cauldron/issues/247)) ([d71003d](https://github.com/dequelabs/cauldron/commit/d71003d23267eae8081196672bfa7f4d29d9feb3))

### Bug Fixes

- pass classnames from menubar to rendered ul ([#241](https://github.com/dequelabs/cauldron/issues/241)) ([cffd938](https://github.com/dequelabs/cauldron/commit/cffd9389450465827ad6622d99de0e75ec61ed10))

### [0.2.1](https://github.com/dequelabs/cauldron/compare/v0.2.0...v0.2.1) (2021-05-17)

### Features

- **icons:** Add a share icon ([#249](https://github.com/dequelabs/cauldron/issues/249)) ([5af005d](https://github.com/dequelabs/cauldron/commit/5af005dda138c374475c2c47c68c90d529d05620))
- **react:** Support YAML highlighint in Code component ([#247](https://github.com/dequelabs/cauldron/issues/247)) ([d71003d](https://github.com/dequelabs/cauldron/commit/d71003d23267eae8081196672bfa7f4d29d9feb3))

### Bug Fixes

- pass classnames from menubar to rendered ul ([#241](https://github.com/dequelabs/cauldron/issues/241)) ([cffd938](https://github.com/dequelabs/cauldron/commit/cffd9389450465827ad6622d99de0e75ec61ed10))

## 0.2.0 (2021-05-03)

### Features

- **react:** allows select component to be controlled ([#234](https://github.com/dequelabs/cauldron/pull/232)) ([3e7de22](https://github.com/dequelabs/cauldron/commit/3e7de22e8dda98ac36978570103dcc840e888c8e))
- **react:** Allow RadioGroup component to be 'controlled' ([#232](https://github.com/dequelabs/cauldron/pull/232)) ([baf02d9](https://github.com/dequelabs/cauldron/commit/baf02d9a3b877e27a92d8f17aa41838728a78534))

### [0.1.2](https://github.com/dequelabs/cauldron/compare/v0.1.1...v0.1.2) (2021-04-26)

### Features

- **react:** implement icon button variants ([#181](https://github.com/dequelabs/cauldron/issues/181)) ([20ca9b2](https://github.com/dequelabs/cauldron/commit/20ca9b2add710024dc7b25a3acde58e50d6d50cf))

### Bug Fixes

- **react:** use offscreen container instead of aria-label for icon elements ([#228](https://github.com/dequelabs/cauldron/issues/228)) ([07d748d](https://github.com/dequelabs/cauldron/commit/07d748d895bc805dd958dcdff35d5ce0a74e27cf))

### [0.1.1](https://github.com/dequelabs/cauldron/compare/v0.1.0...v0.1.1) (2021-03-31)

# [0.1.0](https://github.com/dequelabs/cauldron/compare/v0.0.0...v0.1.0) (2021-03-30)

### Bug Fixes

- **react:** allows radio's icon to be appear checked (icon) ([#207](https://github.com/dequelabs/cauldron/issues/207)) ([e2a2f8a](https://github.com/dequelabs/cauldron/commit/e2a2f8a2757c3c2f5165c4ce42d0717d3d6e581a))
- **react:** prevent memory leaks in Icon component ([#198](https://github.com/dequelabs/cauldron/issues/198)) ([f3e253e](https://github.com/dequelabs/cauldron/commit/f3e253ee9d6766e86bc956ac81cd15a8abcd8e5c))
- **styles:** Adds sufficient focus indication to options menu items ([#192](https://github.com/dequelabs/cauldron/issues/192)) ([927049f](https://github.com/dequelabs/cauldron/commit/927049f00580e575813d4c994497c89609b4557b))
- **styles:** ensures sufficient focus indication for erroneous text fields ([#191](https://github.com/dequelabs/cauldron/issues/191)) ([a086790](https://github.com/dequelabs/cauldron/commit/a086790d74dd4a0f66ae02b403509e664b220c6d))
- make icons inside IconButtons flex to fit button container ([#154](https://github.com/dequelabs/cauldron/issues/154)) ([940300f](https://github.com/dequelabs/cauldron/commit/940300f99371c09633ec69a860d2745b74f81721))
- remove pointer events from iconbutton icon ([#170](https://github.com/dequelabs/cauldron/issues/170)) ([e71bf29](https://github.com/dequelabs/cauldron/commit/e71bf29e2a43171eeda786578fce957621eac409))
- use before pseudo element for button indicators ([#164](https://github.com/dequelabs/cauldron/issues/164)) ([456cc89](https://github.com/dequelabs/cauldron/commit/456cc89ccf722553e90691d9275470bf1f98fbea))
- use Pattern Library lock icon ([#174](https://github.com/dequelabs/cauldron/issues/174)) ([012b783](https://github.com/dequelabs/cauldron/commit/012b78321648662b4a0dfe85f85fd458918511a4))
- **docs:** set 300px width wrapper around textfields ([#130](https://github.com/dequelabs/cauldron/issues/130)) ([5222427](https://github.com/dequelabs/cauldron/commit/5222427ff7bd88d2e91ecae304937a52bfb68995))
- **docs:** support redirects for SPA router ([#49](https://github.com/dequelabs/cauldron/issues/49)) ([699bd26](https://github.com/dequelabs/cauldron/commit/699bd2656f5656e60ad4240224e1ffb57fb0c588))
- **icons:** use the updated save icon ([#155](https://github.com/dequelabs/cauldron/issues/155)) ([750dae3](https://github.com/dequelabs/cauldron/commit/750dae3ef57d5ddad49734f584168c3f846bb6de))
- **react:** add lock icon ([#92](https://github.com/dequelabs/cauldron/issues/92)) ([b3be508](https://github.com/dequelabs/cauldron/commit/b3be5086523f16e4a798fb348b702681b17be30a))
- **react:** Adds aria-haspopup to options menu trigger ([#149](https://github.com/dequelabs/cauldron/issues/149)) ([5788ab5](https://github.com/dequelabs/cauldron/commit/5788ab52ca322c6085de2901a77629c045c08b8c)), closes [#55](https://github.com/dequelabs/cauldron/issues/55) [#support-table-4](https://github.com/dequelabs/cauldron/issues/support-table-4)
- **react:** allow save icon to inherit color ([#159](https://github.com/dequelabs/cauldron/issues/159)) ([5e6bbd3](https://github.com/dequelabs/cauldron/commit/5e6bbd384f221ebe12a4db38a0e88df08f220e13))
- **react:** always calculate new tooltip position on show ([#123](https://github.com/dequelabs/cauldron/issues/123)) ([5636bf9](https://github.com/dequelabs/cauldron/commit/5636bf9ecbce4d53b509f2b94e43e1178e4072e7))
- **react:** directly import Light syntax highlighter to avoid side effects and limit the number of languages bundled ([#127](https://github.com/dequelabs/cauldron/issues/127)) ([7af84f8](https://github.com/dequelabs/cauldron/commit/7af84f8116a30b5e507e35e6c43274195c47c652))
- **react:** fix button styles according to the style guide ([#119](https://github.com/dequelabs/cauldron/issues/119)) ([271c086](https://github.com/dequelabs/cauldron/commit/271c0864f49201a2a6df9d5ef7188f699ab0e585))
- **react:** fix dialog not being initialized correctly ([#94](https://github.com/dequelabs/cauldron/issues/94)) ([f6c22a3](https://github.com/dequelabs/cauldron/commit/f6c22a3259f9115f8841281f4dec0eead4b42b54))
- **react:** fix exchange icon fill color ([#69](https://github.com/dequelabs/cauldron/issues/69)) ([8b030b0](https://github.com/dequelabs/cauldron/commit/8b030b000ca740193b30d10e9f4a4c3956aa27a2))
- **react:** Make Dialog's `onClose` optional ([#168](https://github.com/dequelabs/cauldron/issues/168)) ([dfa1818](https://github.com/dequelabs/cauldron/commit/dfa181802d4aa0a3787762ec7038e8b80128c1b4)), closes [#105](https://github.com/dequelabs/cauldron/issues/105)
- **react:** make name, value optional for Checkbox and RadioGroup ([#118](https://github.com/dequelabs/cauldron/issues/118)) ([72e97f9](https://github.com/dequelabs/cauldron/commit/72e97f9312e75a0b75a90e7539bddd37d9b4ab13))
- **react:** make tooltips have consistent line heights ([#120](https://github.com/dequelabs/cauldron/issues/120)) ([09837d1](https://github.com/dequelabs/cauldron/commit/09837d1fa4a795ffff10d3bb1793753ac8b1dc17))
- **react:** makes dialogRef an optional prop for Dialog ([#100](https://github.com/dequelabs/cauldron/issues/100)) ([b19190b](https://github.com/dequelabs/cauldron/commit/b19190b241476dbf6276d3032c5ed301b5f6f21c))
- **react:** move next/prev pointout buttons to after content to allow for a more natural tab order ([#169](https://github.com/dequelabs/cauldron/issues/169)) ([af851bd](https://github.com/dequelabs/cauldron/commit/af851bde8ee5d90d1c4623c5bcbcdba2a4e82565))
- **react:** prevent onDismiss being passed as an attribute value on the toast element ([#145](https://github.com/dequelabs/cauldron/issues/145)) ([293a24c](https://github.com/dequelabs/cauldron/commit/293a24cb887c50be41d981aa5e0f91a28c7e2838))
- **SkipLink:** pass props through to nav dom node ([#96](https://github.com/dequelabs/cauldron/issues/96)) ([989442b](https://github.com/dequelabs/cauldron/commit/989442ba7fcb16850facef6530098ba99c69582b))
- **styles:** Adds pointer cursor to Button with variant link ([#131](https://github.com/dequelabs/cauldron/issues/131)) ([85c52fb](https://github.com/dequelabs/cauldron/commit/85c52fb21c34b64cd6e667b6fcc673791809944a))
- **styles:** align radio labels properly ([369ec6b](https://github.com/dequelabs/cauldron/commit/369ec6be3d9adb2f64c87efef7419959de6dc721))
- **styles:** ensure that dialogs are anchored to the top of its relative container ([#93](https://github.com/dequelabs/cauldron/issues/93)) ([9190b1a](https://github.com/dequelabs/cauldron/commit/9190b1a85e110972fee3eb930787be0f635efa6d))
- **styles:** make heading take up full modal header height ([#73](https://github.com/dequelabs/cauldron/issues/73)) ([8102e11](https://github.com/dequelabs/cauldron/commit/8102e11ea80df03056ac1109585f24aed6360016))
- **styles:** remove height/width styles from Icon ([#172](https://github.com/dequelabs/cauldron/issues/172)) ([006fcbf](https://github.com/dequelabs/cauldron/commit/006fcbf2191909a11e060cabd6956ec57069cbcc))
- **styles:** remove topbar shadow ([#27](https://github.com/dequelabs/cauldron/issues/27)) ([33bc4ed](https://github.com/dequelabs/cauldron/commit/33bc4eda2fc7c1cad6e0c8548e5821ff1c56ef49))
- **styles:** set correct height on thin buttons ([#66](https://github.com/dequelabs/cauldron/issues/66)) ([41b179d](https://github.com/dequelabs/cauldron/commit/41b179de723b8780325f57be30ba88327b4b445e))
- **styles:** set valid color for border of loader overlay ([#124](https://github.com/dequelabs/cauldron/issues/124)) ([2c36e67](https://github.com/dequelabs/cauldron/commit/2c36e6756e8b58daac174e9df1174228ac8582e2))
- **styles:** tweak checkbox/radio margins ([ecdbe33](https://github.com/dequelabs/cauldron/commit/ecdbe33425cc1227ac4f95255eb7113c1c747589))
- **styles:** Updates font-size of text field to `--text-size-small` ([#133](https://github.com/dequelabs/cauldron/issues/133)) ([9920af4](https://github.com/dequelabs/cauldron/commit/9920af44b98ab08f0ce685ea5fa7e83c663db9b6))
- **styles:** Updates textfield labels/margins ([9064f27](https://github.com/dequelabs/cauldron/commit/9064f276c195e1be2296a5260c42c548e75a7aeb))
- **styles:** use inline-grid for buttons to fix layout issues ([#165](https://github.com/dequelabs/cauldron/issues/165)) ([1c7a72b](https://github.com/dequelabs/cauldron/commit/1c7a72b32179be6d0a2e55808db21f9bb457d939))
- **styles:** use the same outline color for IconButton as the background ([#173](https://github.com/dequelabs/cauldron/issues/173)) ([b3cbe4b](https://github.com/dequelabs/cauldron/commit/b3cbe4b523388447fbb9b75e59c09bda548f4397))
- add missing icons hamburger, list ([#70](https://github.com/dequelabs/cauldron/issues/70)) ([92f6e61](https://github.com/dequelabs/cauldron/commit/92f6e61e9f7e9d3bf4d9b5b805b8237fa1ea7d97))
- align links to baseline ([#56](https://github.com/dequelabs/cauldron/issues/56)) ([6092f2c](https://github.com/dequelabs/cauldron/commit/6092f2ca9e01e8ae876bb2c6c04cf57074bfd385))
- export select types ([#45](https://github.com/dequelabs/cauldron/issues/45)) ([8d00708](https://github.com/dequelabs/cauldron/commit/8d00708ab37ab61e1be0311f175d1c5e49e589ef))
- link to new repo in demo app ([#78](https://github.com/dequelabs/cauldron/issues/78)) ([736abbf](https://github.com/dequelabs/cauldron/commit/736abbf0f919844edd1251224f3e6b725f6aa97f))
- make trigger optional prop for OptionsMenu ([#122](https://github.com/dequelabs/cauldron/issues/122)) ([e548330](https://github.com/dequelabs/cauldron/commit/e548330001cd17ae1cf07a535311ab84423498aa))
- update checkboxes and radio states to match new iconography ([#68](https://github.com/dequelabs/cauldron/issues/68)) ([e2d2268](https://github.com/dequelabs/cauldron/commit/e2d226886e4f41e8682ed68973fe8cbe06cc1a4b))
- update field inputs and text areas for new design ([#85](https://github.com/dequelabs/cauldron/issues/85)) ([85aa89e](https://github.com/dequelabs/cauldron/commit/85aa89eb0ed9f023b139cd5bd23ca868e27ad286))
- use flexbox for modal layouts and include default spacing in the content ([#83](https://github.com/dequelabs/cauldron/issues/83)) ([505a660](https://github.com/dequelabs/cauldron/commit/505a6606b5d8d5b3e8df0d6e45b2f3b50169388d))
- **styles:** use psuedo element for topbar active border state ([#41](https://github.com/dequelabs/cauldron/issues/41)) ([1b2eaee](https://github.com/dequelabs/cauldron/commit/1b2eaeeb83a8c12781920be89dbf475a9f62b9f5))
- **tooltip:** prevent word breaks on tooltip content ([#44](https://github.com/dequelabs/cauldron/issues/44)) ([4770259](https://github.com/dequelabs/cauldron/commit/4770259ada054a65d76ee0353f4f3f36b9049ed4))

### Features

- adds triangle icon ([#206](https://github.com/dequelabs/cauldron/issues/206)) ([12576ee](https://github.com/dequelabs/cauldron/commit/12576ee0b5f8bbbfd30be6ff7943773f2eb854cc))
- **icon-button:** exposes ref prop ([#199](https://github.com/dequelabs/cauldron/issues/199)) ([15ccc98](https://github.com/dequelabs/cauldron/commit/15ccc98b0c1d60b848290b3313b108dabac6383b))
- add arrows-alt icon to icon component ([#151](https://github.com/dequelabs/cauldron/issues/151)) ([5a27561](https://github.com/dequelabs/cauldron/commit/5a275610055d4dab4298958173b5d46ffc2a6b02))
- add check and solid check icons ([#160](https://github.com/dequelabs/cauldron/issues/160)) ([7eddb4d](https://github.com/dequelabs/cauldron/commit/7eddb4d570ca044bd1a6e8b97e0f209a615a7234))
- add filter icon to icon package ([#197](https://github.com/dequelabs/cauldron/issues/197)) ([95a0593](https://github.com/dequelabs/cauldron/commit/95a0593b9fdacf2d5f6d140443209464c84f17ac))
- add forwardRef to icon component ([#152](https://github.com/dequelabs/cauldron/issues/152)) ([f921c3e](https://github.com/dequelabs/cauldron/commit/f921c3e0707bd771677c85d582676bbf666313db))
- add new releases icon ([#187](https://github.com/dequelabs/cauldron/issues/187)) ([75708c3](https://github.com/dequelabs/cauldron/commit/75708c34505976e2b2467b86e24a536cfc722bd8))
- add upload icon ([#179](https://github.com/dequelabs/cauldron/issues/179)) ([9e0b385](https://github.com/dequelabs/cauldron/commit/9e0b3851941da119b34e61c77cf36116b55aafa5))
- Adds big Tooltip component ([#134](https://github.com/dequelabs/cauldron/issues/134)) ([6570dc6](https://github.com/dequelabs/cauldron/commit/6570dc6cdd7e7be8891690702edb28112c0eab55))
- Adds LoaderOverlay component ([#117](https://github.com/dequelabs/cauldron/issues/117)) ([14b6178](https://github.com/dequelabs/cauldron/commit/14b617851a192e624146bf64b5f29aa5e8a68b26))
- Adds tag component ([#193](https://github.com/dequelabs/cauldron/issues/193)) ([ee9d1d5](https://github.com/dequelabs/cauldron/commit/ee9d1d596355deeea9580eb40def0c0d9dfb8039))
- allow pointouts to specify their positioning in alignment with their target element ([#185](https://github.com/dequelabs/cauldron/issues/185)) ([3822407](https://github.com/dequelabs/cauldron/commit/3822407f0ea4f2c3c23487689e329dd994374017))
- Allow tooltip to continue displaying when hovered ([#188](https://github.com/dequelabs/cauldron/issues/188)) ([744ba98](https://github.com/dequelabs/cauldron/commit/744ba9887e3926491d68d2078a7f53170eb24f9e))
- **button:** handle style icons as children inside of buttons ([#142](https://github.com/dequelabs/cauldron/issues/142)) ([20c3012](https://github.com/dequelabs/cauldron/commit/20c30126aacc069c785a6021f431c5138291056d))
- **Checkbox:** support errors ([#128](https://github.com/dequelabs/cauldron/issues/128)) ([b079ed3](https://github.com/dequelabs/cauldron/commit/b079ed3038e1eda5ad51d1c8200550963d2743c7))
- **code:** Add syntax highlighting as css (instead of inline styles in js) and explicitly import specific languages ([#75](https://github.com/dequelabs/cauldron/issues/75)) ([2dd315b](https://github.com/dequelabs/cauldron/commit/2dd315b666863bec74699f2cf4611613812105f5))
- **react:** add grid and sort icons, update run-again icon ([#112](https://github.com/dequelabs/cauldron/issues/112)) ([e54e972](https://github.com/dequelabs/cauldron/commit/e54e9720264e4b637d0b521dfb7f58ae2d126dde))
- **react:** add icon-buttons ([#116](https://github.com/dequelabs/cauldron/issues/116)) ([368103f](https://github.com/dequelabs/cauldron/commit/368103ff311a2daf3fe8fc50e21433fae7dc1ac9))
- **react:** add new icon ([#158](https://github.com/dequelabs/cauldron/issues/158)) ([76bc995](https://github.com/dequelabs/cauldron/commit/76bc9957916e4f78c967531b41ec55c53803249f))
- **react:** add pencil, arrow-circle, and save icons ([#97](https://github.com/dequelabs/cauldron/issues/97)) ([c3f2515](https://github.com/dequelabs/cauldron/commit/c3f2515a419ab2550650bf18cdce522c0803a88d))
- **react:** Adds tag icon ([b28457c](https://github.com/dequelabs/cauldron/commit/b28457cffdd5ecff3a1b4328734a660f33ad9ef3))
- **react:** allow props to be passed to next and previous buttons in pointout ([#166](https://github.com/dequelabs/cauldron/issues/166)) ([aacbef1](https://github.com/dequelabs/cauldron/commit/aacbef1333f8cd6d1377c2c90c46b2b126b307de))
- **react:** allow toast auto-focus to be disabled ([#143](https://github.com/dequelabs/cauldron/issues/143)) ([bb6efa4](https://github.com/dequelabs/cauldron/commit/bb6efa434c1ffc0b224709adfce4b7666908d932))
- **react:** fire custom show/hide event when tooltip is shown/hidden ([#161](https://github.com/dequelabs/cauldron/issues/161)) ([2cf6acd](https://github.com/dequelabs/cauldron/commit/2cf6acdad3e1ed288b846ca45c1b90f626a3977d))
- **react:** implement new tooltips, replacing rc-tooltip ([#115](https://github.com/dequelabs/cauldron/issues/115)) ([39c7aa2](https://github.com/dequelabs/cauldron/commit/39c7aa2c8678c8b6dd3353e706e6805a5bd36e50))
- **react:** update pointout to reflect updated designs ([#156](https://github.com/dequelabs/cauldron/issues/156)) ([8410d8d](https://github.com/dequelabs/cauldron/commit/8410d8de44cedf5e28cfdfacb379f53a430d2e1e))
- add icons ([#58](https://github.com/dequelabs/cauldron/issues/58)) ([159b747](https://github.com/dequelabs/cauldron/commit/159b7479720110db762dcff1396b22a5ba671e7e))
- implement new versions of modals and alerts ([#88](https://github.com/dequelabs/cauldron/issues/88)) ([dbc3431](https://github.com/dequelabs/cauldron/commit/dbc34312d5b9d7e36b7f5f21590c27d4be0b7f5c))
- semantic select ([#36](https://github.com/dequelabs/cauldron/issues/36)) ([4e80281](https://github.com/dequelabs/cauldron/commit/4e802816ee218e7a5198e88837af44b89867219e)), closes [#333](https://github.com/dequelabs/cauldron/issues/333)
- separate menubar from topbar ([#39](https://github.com/dequelabs/cauldron/issues/39)) ([38eebc6](https://github.com/dequelabs/cauldron/commit/38eebc6e6da8370373bf2df6ad0f7ba9995c7ea8))
- support adding className to alert/modal content/footer ([#101](https://github.com/dequelabs/cauldron/issues/101)) ([3eedbb9](https://github.com/dequelabs/cauldron/commit/3eedbb90445bc57885b1cf2c38a1a32248391187))
- support any node type in toast component ([#125](https://github.com/dequelabs/cauldron/issues/125)) ([7475af4](https://github.com/dequelabs/cauldron/commit/7475af40549a86c14f552939e03624783afc22ab))
- Update toast icons/styles and adds type 'info' ([#95](https://github.com/dequelabs/cauldron/issues/95)) ([e11dfa6](https://github.com/dequelabs/cauldron/commit/e11dfa6b2c5621660e2be2b116d242b7a7dd7951))
- **styles:** redesigned buttons ([#86](https://github.com/dequelabs/cauldron/issues/86)) ([7e05de1](https://github.com/dequelabs/cauldron/commit/7e05de19d40eca4e289c2746575e90a4b1ad236d))
- **styles:** set default heading text color ([#91](https://github.com/dequelabs/cauldron/issues/91)) ([d9e080a](https://github.com/dequelabs/cauldron/commit/d9e080a17dc1198789e2308c57b610b0e83d3b2b))
- thin button ([#48](https://github.com/dequelabs/cauldron/issues/48)) ([60bc2c7](https://github.com/dequelabs/cauldron/commit/60bc2c7d6afb68bfe0df1603c3f9131e7da53a6b))

### BREAKING CHANGES

- children are no longer rendered within a direct-child span element
- **react:** The api for for implementing a tooltip has changed.

Instead of `<Tooltip><button /><Tooltip>`, the tooltip takes a target ref or html element.

- removes autoHide prop because it violates WCAG 2.2.1 - Timing Adjustable
- topbar no longer renders role=menubar. New component <MenuBar /> must now be used if menubar is desired

# [0.0.0](https://github.com/dequelabs/cauldron/compare/f8337ed16ab5fd19b753aefe63298d92a190c06a...v0.0.0) (2020-05-11)

### Features

- new TopBar and SideBar ([#21](https://github.com/dequelabs/cauldron/issues/21)) ([f8337ed](https://github.com/dequelabs/cauldron/commit/f8337ed16ab5fd19b753aefe63298d92a190c06a))
