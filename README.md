# tree-sitter-bmb

Tree-sitter grammar for BMB (Bare-Metal-Banter) programming language.

## Status

🚧 **Under Development** - Target: v1.0.0

## Usage

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

```bash
# Install tree-sitter CLI
npm install -g tree-sitter-cli

# Generate parser
tree-sitter generate

# Run tests
tree-sitter test

# Parse a file
tree-sitter parse example.bmb
```

## Structure

```
tree-sitter-bmb/
├── grammar.js          # Grammar definition
├── src/
│   ├── parser.c        # Generated parser
│   └── scanner.c       # Custom scanner (if needed)
├── queries/
│   ├── highlights.scm  # Syntax highlighting
│   ├── injections.scm  # Language injections
│   └── locals.scm      # Local definitions
├── test/
│   └── corpus/         # Test cases
└── package.json
```

## Related

- [BMB Compiler](https://github.com/lang-bmb/lang-bmb) - Main compiler repository
- [VS Code Extension](https://github.com/lang-bmb/vscode-bmb) - VS Code support (TextMate grammar)

## License

MIT
