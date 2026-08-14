import type { tags } from "typia";

export interface ICustomFieldDefinition {
  id: string & tags.Format<"uuid">;
  targetType: string;
  key: string;
  label: string;
  valueKind: "text" | "number" | "boolean" | "date" | "select";
  active: boolean;
  createdAt: string & tags.Format<"date-time">;
  updatedAt: string & tags.Format<"date-time">;
}
export namespace ICustomFieldDefinition {
  export interface ICreate {
    targetType: string;
    key: string;
    label: string;
    valueKind: "text" | "number" | "boolean" | "date" | "select";
  }
  export interface IUpdate { label?: string; valueKind?: "text" | "number" | "boolean" | "date" | "select"; }
  export interface IIndex { page?: number; limit?: number; targetType?: string; }
}

export interface ICustomFieldValue {
  id: string & tags.Format<"uuid">;
  definitionId: string & tags.Format<"uuid">;
  targetType: string;
  targetId: string;
  value: null | string;
  createdAt: string & tags.Format<"date-time">;
  updatedAt: string & tags.Format<"date-time">;
}
export namespace ICustomFieldValue {
  export interface ISet { definitionId: string & tags.Format<"uuid">; targetType: string; targetId: string & tags.Format<"uuid">; value: null | string; }
}
