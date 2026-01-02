const path = require('path');
const { LANGUAGE_VERSION, MIN_LANGUAGE_VERSION } = require('tree-sitter');

try {
  module.exports = require('../../build/Release/tree_sitter_bmb_binding.node');
} catch (_) {
  try {
    module.exports = require('../../build/Debug/tree_sitter_bmb_binding.node');
  } catch (_) {
    // Fallback for development when native module isn't built yet
    console.warn('tree-sitter-bmb: Native binding not found. Run npm run build first.');
  }
}

try {
  module.exports.nodeTypeInfo = require('../../src/node-types.json');
} catch (_) {}
