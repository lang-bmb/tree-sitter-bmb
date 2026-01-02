# tree-sitter-bmb

Tree-sitter grammar for BMB (Bare-Metal-Banter) programming language.

## Status

✅ **v0.1.0** - Core grammar complete

## Features

- Full BMB syntax support (functions, structs, enums, contracts)
- Syntax highlighting queries
- Code folding support
- Indentation queries
- Node.js and Rust bindings

## Installation

### Node.js

```bash
npm install tree-sitter-bmb
```

### Rust

Add to your `Cargo.toml`:

```toml
[dependencies]
tree-sitter-bmb = "0.1"
```

## Usage

### Node.js

```javascript
const Parser = require('tree-sitter');
const BMB = require('tree-sitter-bmb');

const parser = new Parser();
parser.setLanguage(BMB);

const sourceCode = `
fn add(a: i32, b: i32) -> i32
  pre a >= 0 and b >= 0
  post ret == a + b
= a + b;
`;

const tree = parser.parse(sourceCode);
console.log(tree.rootNode.toString());
```

### Rust

```rust
use tree_sitter::Parser;
use tree_sitter_bmb::LANGUAGE;

fn main() {
    let mut parser = Parser::new();
    parser.set_language(&LANGUAGE.into()).unwrap();

    let source = r#"
        fn factorial(n: i64) -> i64
          pre n >= 0
          post ret >= 1
        = if n <= 1 then 1 else n * factorial(n - 1);
    "#;

    let tree = parser.parse(source, None).unwrap();
    println!("{}", tree.root_node().to_sexp());
}
```

### Neovim

```lua
-- In your Neovim config
require('nvim-treesitter.configs').setup {
  ensure_installed = { 'bmb' },
  highlight = { enable = true },
}
```

### Helix

Add to `languages.toml`:

```toml
[[language]]
name = "bmb"
scope = "source.bmb"
file-types = ["bmb"]
roots = []
```

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [tree-sitter CLI](https://github.com/tree-sitter/tree-sitter/tree/master/cli)

### Build

```bash
# Install dependencies
npm install

# Generate parser from grammar
npm run generate

# Build native module
npm run build

# Build WASM module
npm run build-wasm
```

### Test

```bash
# Run tree-sitter tests
npm test

# Parse a file
tree-sitter parse example.bmb
```

## Structure

```
tree-sitter-bmb/
├── grammar.js          # Grammar definition
├── package.json        # npm package
├── binding.gyp         # Node.js native binding
├── bindings/
│   ├── node/           # Node.js bindings
│   └── rust/           # Rust bindings
├── queries/
│   ├── highlights.scm  # Syntax highlighting
│   ├── folds.scm       # Code folding
│   └── indents.scm     # Auto-indentation
└── src/                # Generated parser (after build)
    └── parser.c
```

## Query Files

| File | Purpose |
|------|---------|
| `queries/highlights.scm` | Syntax highlighting rules |
| `queries/folds.scm` | Code folding regions |
| `queries/indents.scm` | Automatic indentation |

## Supported Syntax

### Definitions
- Functions (`fn`)
- Structs (`struct`)
- Enums (`enum`)
- Use statements (`use`)
- Attributes (`@attr`)

### Types
- Primitives: `i32`, `i64`, `f64`, `bool`, `String`
- Unit: `()`
- References: `&T`, `&mut T`
- Arrays: `[T; N]`
- Refinement types: `i32{it > 0}`

### Expressions
- Control flow: `if-then-else`, `match`, `while`, `for`
- Binary operators: `+`, `-`, `*`, `/`, `%`, `==`, `!=`, `<`, `>`, `<=`, `>=`, `and`, `or`
- Unary operators: `-`, `not`, `&`, `&mut`, `*`
- Ranges: `..<`, `..=`, `..`
- Method calls: `expr.method(args)`
- Field access: `expr.field`
- Index access: `expr[index]`

### Contracts
- Preconditions: `pre <expr>`
- Postconditions: `post <expr>`
- Where blocks: `where { name: condition, ... }`
- State references: `x.pre`, `x.post`

### Special Keywords
- `ret` - Return value in postconditions
- `it` - Self-reference in refinement types
- `new` - Struct initialization

## Related

- [BMB Compiler](https://github.com/lang-bmb/lang-bmb) - Main compiler repository
- [VS Code Extension](https://github.com/lang-bmb/vscode-bmb) - VS Code support

## License

MIT
