; indents.scm - BMB indentation queries

; Indent after opening braces
[
  (function_definition)
  (struct_definition)
  (enum_definition)
  (block_expression)
  (match_expression)
  (while_expression)
  (for_expression)
  (where_block)
  (struct_init)
] @indent.begin

; Dedent at closing braces
[
  "}"
] @indent.end

; Indent continuation for multi-line expressions
(if_expression
  "then" @indent.begin)

(if_expression
  "else" @indent.begin)

; Match arms
(match_arm) @indent.begin

; Parameters and arguments on multiple lines
(parameters) @indent.begin
(argument_list) @indent.begin

; Zero indent for top-level items
[
  (function_definition)
  (struct_definition)
  (enum_definition)
  (use_statement)
] @indent.zero
