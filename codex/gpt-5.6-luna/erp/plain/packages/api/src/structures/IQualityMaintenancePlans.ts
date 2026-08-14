import type { tags } from "typia";

export interface IInspectionPlan {
  id: string & tags.Format<"uuid">;
  itemId: string & tags.Format<"uuid">;
  inspectionType: "incoming_receipt" | "in_process_production" | "final_production" | "sales_return";
  sampleRule: string;
  characteristics: string[];
  status: "draft" | "active" | "inactive";
  version: number;
  effectiveFrom: string & tags.Format<"date-time">;
  effectiveTo: null | (string & tags.Format<"date-time">);
}
export namespace IInspectionPlan {
  export interface ICreate {
    itemId: string & tags.Format<"uuid">;
    inspectionType: IInspectionPlan["inspectionType"];
    sampleRule: string;
    characteristics: string[];
    effectiveFrom: string & tags.Format<"date-time">;
    effectiveTo?: null | (string & tags.Format<"date-time">);
  }
  export interface IUpdate {
    sampleRule?: string;
    characteristics?: string[];
    effectiveFrom?: string & tags.Format<"date-time">;
    effectiveTo?: null | (string & tags.Format<"date-time">);
  }
}

export interface IMaintenancePlan {
  id: string & tags.Format<"uuid">;
  equipmentId: string & tags.Format<"uuid">;
  frequencyDays: number;
  checklist: string[];
  requiredParts: string[];
  laborSkills: string[];
  nextDueAt: string & tags.Format<"date-time">;
  status: "active" | "inactive";
  version: number;
}
export namespace IMaintenancePlan {
  export interface ICreate {
    equipmentId: string & tags.Format<"uuid">;
    frequencyDays: number & tags.Type<"uint32">;
    checklist: string[];
    requiredParts: string[];
    laborSkills: string[];
    nextDueAt: string & tags.Format<"date-time">;
  }
  export interface IUpdate {
    frequencyDays?: number & tags.Type<"uint32">;
    checklist?: string[];
    requiredParts?: string[];
    laborSkills?: string[];
    nextDueAt?: string & tags.Format<"date-time">;
  }
}
