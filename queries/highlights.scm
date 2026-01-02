; highlights.scm - BMB syntax highlighting queries

; Comments
(line_comment) @comment

; Keywords - Control flow
[
  "if"
  "then"
  "else"
  "match"
  "while"
  "for"
  "in"
] @keyword.control

; Keywords - Definition
[
  "fn"
  "let"
  "struct"
  "enum"
  "use"
  "mod"
  "new"
] @keyword

; Keywords - Modifier
[
  "pub"
  "mut"
] @keyword.modifier

; Keywords - Contract
[
  "pre"
  "post"
  "where"
] @keyword.contract

; Keywords - Operator
[
  "and"
  "or"
  "not"
] @keyword.operator

; Keywords - Special
[
  "ret"
  "it"
] @keyword.special

; Types - Primitive
(primitive_type) @type.builtin

; Types - Named
(named_type) @type

; Types - Unit
(unit_type) @type.builtin

; Function definitions
(function_definition
  name: (identifier) @function.definition)

; Function calls
(call_expression
  function: (identifier) @function.call)

; Method calls
(method_call
  method: (identifier) @function.method)

; Struct definitions
(struct_definition
  name: (identifier) @type.definition)

; Struct fields
(struct_field
  name: (identifier) @property)

; Struct initialization
(struct_init
  name: (identifier) @type)

(struct_init_field
  name: (identifier) @property)

; Enum definitions
(enum_definition
  name: (identifier) @type.definition)

; Enum variants
(enum_variant
  name: (identifier) @constant)

; Enum variant expressions
(enum_variant_expression
  enum: (identifier) @type
  variant: (identifier) @constant)

; Enum variant patterns
(enum_variant_pattern
  enum: (identifier) @type
  variant: (identifier) @constant)

; Parameters
(parameter
  name: (identifier) @variable.parameter)

; Variables
(variable_pattern) @variable
(let_expression
  name: (identifier) @variable)
(for_expression
  variable: (identifier) @variable)
(assignment
  name: (identifier) @variable)

; Field access
(field_access
  field: (identifier) @property)

; Index access
(index_expression) @punctuation.bracket

; Literals
(integer_literal) @number
(float_literal) @number.float
(string_literal) @string
(boolean_literal) @constant.builtin
(unit_literal) @constant.builtin

; Operators
[
  "+"
  "-"
  "*"
  "/"
  "%"
  "=="
  "!="
  "<"
  ">"
  "<="
  ">="
  "..<"
  "..="
  ".."
] @operator

; Punctuation - Delimiters
[
  ","
  ";"
  ":"
  "::"
  "."
] @punctuation.delimiter

; Punctuation - Brackets
[
  "("
  ")"
  "{"
  "}"
  "["
  "]"
] @punctuation.bracket

; Punctuation - Special
[
  "->"
  "=>"
  "="
  "@"
  "&"
] @punctuation.special

; Attributes
(attribute
  name: (identifier) @attribute)

; Use paths
(use_path
  (identifier) @module)

; Identifiers (fallback)
(identifier) @variable

; Patterns
(wildcard_pattern) @constant.builtin
