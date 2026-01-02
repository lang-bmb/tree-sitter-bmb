/**
 * @file BMB language grammar for tree-sitter
 * @author BMB Language Team
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: 'bmb',

  extras: $ => [
    /\s/,
    $.line_comment,
  ],

  word: $ => $.identifier,

  rules: {
    // Program: sequence of items
    source_file: $ => repeat($._item),

    // Items
    _item: $ => choice(
      $.function_definition,
      $.struct_definition,
      $.enum_definition,
      $.use_statement,
    ),

    // Line comment
    line_comment: $ => token(seq('//', /.*/)),

    // Use statement
    use_statement: $ => seq(
      'use',
      field('path', $.use_path),
      ';',
    ),

    use_path: $ => seq(
      $.identifier,
      repeat(seq('::', $.identifier)),
    ),

    // Visibility modifier
    visibility: $ => 'pub',

    // Attributes
    attribute: $ => seq(
      '@',
      field('name', $.identifier),
      optional(seq('(', optional($.argument_list), ')')),
    ),

    // Struct definition
    struct_definition: $ => seq(
      repeat($.attribute),
      optional($.visibility),
      'struct',
      field('name', $.identifier),
      '{',
      optional($.struct_fields),
      '}',
    ),

    struct_fields: $ => seq(
      $.struct_field,
      repeat(seq(',', $.struct_field)),
      optional(','),
    ),

    struct_field: $ => seq(
      field('name', $.identifier),
      ':',
      field('type', $._type),
    ),

    // Enum definition
    enum_definition: $ => seq(
      repeat($.attribute),
      optional($.visibility),
      'enum',
      field('name', $.identifier),
      '{',
      optional($.enum_variants),
      '}',
    ),

    enum_variants: $ => seq(
      $.enum_variant,
      repeat(seq(',', $.enum_variant)),
      optional(','),
    ),

    enum_variant: $ => seq(
      field('name', $.identifier),
      optional(seq('(', optional($.type_list), ')')),
    ),

    type_list: $ => seq(
      $._type,
      repeat(seq(',', $._type)),
      optional(','),
    ),

    // Function definition
    function_definition: $ => seq(
      repeat($.attribute),
      optional($.visibility),
      'fn',
      field('name', $.identifier),
      '(',
      optional($.parameters),
      ')',
      '->',
      optional(seq(field('ret_name', $.identifier), ':')),
      field('return_type', $._type),
      optional($.contract_clause),
      '=',
      field('body', $._expression),
      ';',
    ),

    // Contract clause
    contract_clause: $ => choice(
      $.where_block,
      $.legacy_contracts,
    ),

    where_block: $ => seq(
      'where',
      '{',
      optional($.named_contracts),
      '}',
    ),

    named_contracts: $ => seq(
      $.named_contract,
      repeat(seq(',', $.named_contract)),
      optional(','),
    ),

    named_contract: $ => seq(
      optional(seq(field('name', $.identifier), ':')),
      field('condition', $._expression),
    ),

    legacy_contracts: $ => seq(
      optional($.pre_condition),
      optional($.post_condition),
    ),

    pre_condition: $ => seq('pre', $._expression),
    post_condition: $ => seq('post', $._expression),

    // Parameters
    parameters: $ => seq(
      $.parameter,
      repeat(seq(',', $.parameter)),
      optional(','),
    ),

    parameter: $ => seq(
      field('name', $.identifier),
      ':',
      field('type', $._type),
    ),

    // Types
    _type: $ => choice(
      $.primitive_type,
      $.unit_type,
      $.reference_type,
      $.mutable_reference_type,
      $.array_type,
      $.refined_type,
      $.named_type,
    ),

    primitive_type: $ => choice('i32', 'i64', 'f64', 'bool', 'String'),
    unit_type: $ => seq('(', ')'),
    named_type: $ => $.identifier,

    reference_type: $ => seq('&', $._type),
    mutable_reference_type: $ => seq('&', 'mut', $._type),
    array_type: $ => seq('[', $._type, ';', $.integer_literal, ']'),

    refined_type: $ => seq(
      choice('i32', 'i64', 'f64', 'bool'),
      '{',
      optional($.refinement_constraints),
      '}',
    ),

    refinement_constraints: $ => seq(
      $._expression,
      repeat(seq(',', $._expression)),
      optional(','),
    ),

    // Expressions
    _expression: $ => choice(
      $.if_expression,
      $.let_expression,
      $.match_expression,
      $.while_expression,
      $.for_expression,
      $.block_expression,
      $._binary_expression,
    ),

    if_expression: $ => seq(
      'if',
      field('condition', $._expression),
      'then',
      field('then', $._expression),
      'else',
      field('else', $._expression),
    ),

    let_expression: $ => seq(
      'let',
      optional('mut'),
      field('name', $.identifier),
      optional(seq(':', $._type)),
      '=',
      field('value', $._expression),
      ';',
      field('body', $._expression),
    ),

    match_expression: $ => seq(
      'match',
      field('value', $._expression),
      '{',
      optional($.match_arms),
      '}',
    ),

    match_arms: $ => seq(
      $.match_arm,
      repeat(seq(',', $.match_arm)),
      optional(','),
    ),

    match_arm: $ => seq(
      field('pattern', $._pattern),
      '=>',
      field('body', $._expression),
    ),

    while_expression: $ => seq(
      'while',
      field('condition', $._expression),
      '{',
      field('body', $._expression),
      '}',
    ),

    for_expression: $ => seq(
      'for',
      field('variable', $.identifier),
      'in',
      field('iterator', $._expression),
      '{',
      field('body', $._expression),
      '}',
    ),

    block_expression: $ => seq(
      '{',
      repeat(seq($._block_statement, ';')),
      optional($._expression),
      '}',
    ),

    _block_statement: $ => choice(
      $.assignment,
      $._expression,
    ),

    assignment: $ => seq(
      field('name', $.identifier),
      '=',
      field('value', $._expression),
    ),

    // Binary expressions with precedence
    _binary_expression: $ => choice(
      $.or_expression,
      $.and_expression,
      $.comparison_expression,
      $.range_expression,
      $.additive_expression,
      $.multiplicative_expression,
      $._unary_expression,
    ),

    or_expression: $ => prec.left(1, seq(
      $._expression,
      'or',
      $._expression,
    )),

    and_expression: $ => prec.left(2, seq(
      $._expression,
      'and',
      $._expression,
    )),

    comparison_expression: $ => prec.left(3, seq(
      $._expression,
      choice('==', '!=', '<', '>', '<=', '>='),
      $._expression,
    )),

    range_expression: $ => prec.left(4, seq(
      $._expression,
      choice('..<', '..=', '..'),
      $._expression,
    )),

    additive_expression: $ => prec.left(5, seq(
      $._expression,
      choice('+', '-'),
      $._expression,
    )),

    multiplicative_expression: $ => prec.left(6, seq(
      $._expression,
      choice('*', '/', '%'),
      $._expression,
    )),

    // Unary expressions
    _unary_expression: $ => choice(
      $.negation_expression,
      $.not_expression,
      $.reference_expression,
      $.mutable_reference_expression,
      $.dereference_expression,
      $._postfix_expression,
    ),

    negation_expression: $ => prec(7, seq('-', $._unary_expression)),
    not_expression: $ => prec(7, seq('not', $._unary_expression)),
    reference_expression: $ => prec(7, seq('&', $._unary_expression)),
    mutable_reference_expression: $ => prec(7, seq('&', 'mut', $._unary_expression)),
    dereference_expression: $ => prec(7, seq('*', $._unary_expression)),

    // Postfix expressions
    _postfix_expression: $ => choice(
      $.method_call,
      $.field_access,
      $.index_expression,
      $.state_reference,
      $.call_expression,
      $.enum_variant_expression,
      $._primary_expression,
    ),

    method_call: $ => prec(8, seq(
      $._postfix_expression,
      '.',
      field('method', $.identifier),
      '(',
      optional($.argument_list),
      ')',
    )),

    field_access: $ => prec(8, seq(
      $._postfix_expression,
      '.',
      field('field', $.identifier),
    )),

    index_expression: $ => prec(8, seq(
      $._postfix_expression,
      '[',
      field('index', $._expression),
      ']',
    )),

    state_reference: $ => prec(8, seq(
      $._postfix_expression,
      '.',
      choice('pre', 'post'),
    )),

    call_expression: $ => seq(
      field('function', $.identifier),
      '(',
      optional($.argument_list),
      ')',
    ),

    enum_variant_expression: $ => seq(
      field('enum', $.identifier),
      '::',
      field('variant', $.identifier),
      optional(seq('(', optional($.argument_list), ')')),
    ),

    argument_list: $ => seq(
      $._expression,
      repeat(seq(',', $._expression)),
      optional(','),
    ),

    // Primary expressions
    _primary_expression: $ => choice(
      $.integer_literal,
      $.float_literal,
      $.string_literal,
      $.boolean_literal,
      $.unit_literal,
      $.identifier,
      $.ret,
      $.it,
      $.struct_init,
      $.array_literal,
      $.parenthesized_expression,
    ),

    integer_literal: $ => /[0-9]+/,
    float_literal: $ => /[0-9]+\.[0-9]+/,
    string_literal: $ => seq('"', /[^"]*/, '"'),
    boolean_literal: $ => choice('true', 'false'),
    unit_literal: $ => seq('(', ')'),
    ret: $ => 'ret',
    it: $ => 'it',

    struct_init: $ => seq(
      'new',
      field('name', $.identifier),
      '{',
      optional($.struct_init_fields),
      '}',
    ),

    struct_init_fields: $ => seq(
      $.struct_init_field,
      repeat(seq(',', $.struct_init_field)),
      optional(','),
    ),

    struct_init_field: $ => seq(
      field('name', $.identifier),
      ':',
      field('value', $._expression),
    ),

    array_literal: $ => seq(
      '[',
      optional($.argument_list),
      ']',
    ),

    parenthesized_expression: $ => seq('(', $._expression, ')'),

    // Patterns
    _pattern: $ => choice(
      $.wildcard_pattern,
      $.literal_pattern,
      $.enum_variant_pattern,
      $.variable_pattern,
    ),

    wildcard_pattern: $ => '_',
    variable_pattern: $ => $.identifier,

    literal_pattern: $ => choice(
      $.integer_literal,
      $.float_literal,
      $.string_literal,
      $.boolean_literal,
    ),

    enum_variant_pattern: $ => seq(
      field('enum', $.identifier),
      '::',
      field('variant', $.identifier),
      optional(seq('(', optional($.pattern_bindings), ')')),
    ),

    pattern_bindings: $ => seq(
      $.identifier,
      repeat(seq(',', $.identifier)),
      optional(','),
    ),

    // Identifier
    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,
  },
});
