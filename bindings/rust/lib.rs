//! BMB language bindings for tree-sitter
//!
//! This crate provides Rust bindings for the BMB tree-sitter grammar.

use tree_sitter_language::LanguageFn;

extern "C" {
    fn tree_sitter_bmb() -> *const ();
}

/// Returns the tree-sitter Language for BMB.
///
/// # Safety
/// This function is safe to call as the underlying C function is a pure function
/// that returns a static pointer.
pub const LANGUAGE: LanguageFn = unsafe { LanguageFn::from_raw(tree_sitter_bmb) };

/// The syntax highlighting query for BMB.
pub const HIGHLIGHTS_QUERY: &str = include_str!("../../queries/highlights.scm");

/// The code folding query for BMB.
pub const FOLDS_QUERY: &str = include_str!("../../queries/folds.scm");

/// The indentation query for BMB.
pub const INDENTS_QUERY: &str = include_str!("../../queries/indents.scm");

/// Get the tree-sitter Language for BMB.
#[must_use]
pub fn language() -> tree_sitter_language::LanguageFn {
    LANGUAGE
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_can_load_grammar() {
        let mut parser = tree_sitter::Parser::new();
        parser
            .set_language(&LANGUAGE.into())
            .expect("Failed to load BMB grammar");
    }
}
