/**
 * Field Types for Block Schema System
 *
 * Defines the available field types and their configurations
 * for the CMS page builder.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "multiselect"
  | "boolean"
  | "color"
  | "media"
  | "richtext"
  | "array"
  | "relationship"
  | "json";

export interface SelectOption {
  label: string;
  value: string | number;
  icon?: string;
}

export interface FieldValidation {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternMessage?: string;
}

export interface FieldCondition {
  field: string;
  operator: "equals" | "notEquals" | "contains" | "isEmpty" | "isNotEmpty";
  value?: unknown;
}

export interface BaseFieldSchema {
  name: string;
  type: FieldType;
  label: string;
  description?: string;
  placeholder?: string;
  defaultValue?: unknown;
  validation?: FieldValidation;
  condition?: FieldCondition;
  group?: "content" | "style" | "advanced";
  width?: "full" | "half" | "third";
}

export interface TextFieldSchema extends BaseFieldSchema {
  type: "text";
  prefix?: string;
  suffix?: string;
  inputType?: "text" | "email" | "url" | "tel" | "datetime-local";
}

export interface TextareaFieldSchema extends BaseFieldSchema {
  type: "textarea";
  rows?: number;
  showCharCount?: boolean;
}

export interface NumberFieldSchema extends BaseFieldSchema {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
  showSlider?: boolean;
  unit?: string;
}

export interface SelectFieldSchema extends BaseFieldSchema {
  type: "select";
  options: SelectOption[];
  searchable?: boolean;
}

export interface MultiselectFieldSchema extends BaseFieldSchema {
  type: "multiselect";
  options: SelectOption[];
  searchable?: boolean;
  maxItems?: number;
}

export interface BooleanFieldSchema extends BaseFieldSchema {
  type: "boolean";
  variant?: "switch" | "checkbox";
}

export interface ColorFieldSchema extends BaseFieldSchema {
  type: "color";
  presets?: string[];
  allowCustom?: boolean;
  format?: "hex" | "rgb" | "hsl";
}

export interface MediaFieldSchema extends BaseFieldSchema {
  type: "media";
  accept?: string[];
  multiple?: boolean;
  maxFiles?: number;
}

export interface RichtextFieldSchema extends BaseFieldSchema {
  type: "richtext";
  toolbar?: (
    | "heading"
    | "bold"
    | "italic"
    | "underline"
    | "strike"
    | "link"
    | "image"
    | "list"
    | "blockquote"
    | "code"
    | "align"
    | "color"
  )[];
  minHeight?: number;
}

export interface ArrayItemSchema {
  name: string;
  label: string;
  fields: FieldSchema[];
}

export interface ArrayFieldSchema extends BaseFieldSchema {
  type: "array";
  itemSchema: ArrayItemSchema;
  minItems?: number;
  maxItems?: number;
  addLabel?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export interface RelationshipFieldSchema extends BaseFieldSchema {
  type: "relationship";
  relationTo: "pages" | "posts" | "products" | "media" | "users";
  multiple?: boolean;
  maxItems?: number;
}

export interface JsonFieldSchema extends BaseFieldSchema {
  type: "json";
  schema?: Record<string, unknown>;
}

export type FieldSchema =
  | TextFieldSchema
  | TextareaFieldSchema
  | NumberFieldSchema
  | SelectFieldSchema
  | MultiselectFieldSchema
  | BooleanFieldSchema
  | ColorFieldSchema
  | MediaFieldSchema
  | RichtextFieldSchema
  | ArrayFieldSchema
  | RelationshipFieldSchema
  | JsonFieldSchema;

export interface BlockSchema {
  type: string;
  label: string;
  icon?: string;
  description?: string;
  category: "layout" | "content" | "interactive" | "section";
  fields: FieldSchema[];
  preview?: {
    field: string;
    fallback?: string;
  };
}

export type BlockSchemaRegistry = Record<string, BlockSchema>;
