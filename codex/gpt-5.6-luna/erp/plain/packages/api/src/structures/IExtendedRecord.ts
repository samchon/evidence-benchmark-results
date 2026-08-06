export interface IExtendedRecord {
  id: string;
  kind: string;
  number?: string | null;
  name?: string | null;
  status: string;
  payload_json: string;
  created_at: string;
  updated_at: string;
}
export namespace IExtendedRecord {
  export interface ICreate { number?: string; name?: string; payload_json?: string; }
  export interface IUpdate { number?: string; name?: string; payload_json?: string; }
  export interface IRequest { page?: number; limit?: number; status?: string | null; query?: string | null; }
  export interface IReason { reason?: string; }
}
export interface IContract extends IExtendedRecord {}
export namespace IContract {
  export interface ICreate extends IExtendedRecord.ICreate {}
  export interface IUpdate extends IExtendedRecord.IUpdate {}
  export interface IRequest extends IExtendedRecord.IRequest {}
  export interface IReason extends IExtendedRecord.IReason {}
}
export interface ICostCenter extends IExtendedRecord {}
export namespace ICostCenter {
  export interface ICreate extends IExtendedRecord.ICreate {}
  export interface IUpdate extends IExtendedRecord.IUpdate {}
  export interface IRequest extends IExtendedRecord.IRequest {}
}
export interface IProfitCenter extends IExtendedRecord {}
export namespace IProfitCenter {
  export interface ICreate extends IExtendedRecord.ICreate {}
  export interface IUpdate extends IExtendedRecord.IUpdate {}
  export interface IRequest extends IExtendedRecord.IRequest {}
}
export interface IAllocationRule extends IExtendedRecord {}
export namespace IAllocationRule {
  export interface ICreate extends IExtendedRecord.ICreate {}
  export interface IUpdate extends IExtendedRecord.IUpdate {}
  export interface IRequest extends IExtendedRecord.IRequest {}
}
export interface IRouting extends IExtendedRecord {}
export namespace IRouting {
  export interface ICreate extends IExtendedRecord.ICreate {}
  export interface IUpdate extends IExtendedRecord.IUpdate {}
  export interface IRequest extends IExtendedRecord.IRequest {}
}
export interface IWorkCenter extends IExtendedRecord {}
export namespace IWorkCenter {
  export interface ICreate extends IExtendedRecord.ICreate {}
  export interface IUpdate extends IExtendedRecord.IUpdate {}
  export interface IRequest extends IExtendedRecord.IRequest {}
}
export interface IMachine extends IExtendedRecord {}
export namespace IMachine {
  export interface ICreate extends IExtendedRecord.ICreate {}
  export interface IUpdate extends IExtendedRecord.IUpdate {}
  export interface IRequest extends IExtendedRecord.IRequest {}
}
export interface IInspectionPlan extends IExtendedRecord {}
export namespace IInspectionPlan {
  export interface ICreate extends IExtendedRecord.ICreate {}
  export interface IUpdate extends IExtendedRecord.IUpdate {}
  export interface IRequest extends IExtendedRecord.IRequest {}
}
export interface IEquipment extends IExtendedRecord {}
export namespace IEquipment {
  export interface ICreate extends IExtendedRecord.ICreate {}
  export interface IUpdate extends IExtendedRecord.IUpdate {}
  export interface IRequest extends IExtendedRecord.IRequest {}
}
export interface IMaintenancePlan extends IExtendedRecord {}
export namespace IMaintenancePlan {
  export interface ICreate extends IExtendedRecord.ICreate {}
  export interface IUpdate extends IExtendedRecord.IUpdate {}
  export interface IRequest extends IExtendedRecord.IRequest {}
}
export interface IServiceCase extends IExtendedRecord {}
export namespace IServiceCase {
  export interface ICreate extends IExtendedRecord.ICreate {}
  export interface IUpdate extends IExtendedRecord.IUpdate {}
  export interface IRequest extends IExtendedRecord.IRequest {}
}
export interface IPaySchedule extends IExtendedRecord {}
export namespace IPaySchedule {
  export interface ICreate extends IExtendedRecord.ICreate {}
  export interface IUpdate extends IExtendedRecord.IUpdate {}
  export interface IRequest extends IExtendedRecord.IRequest {}
}
export interface IPayrollConfig extends IExtendedRecord {}
export namespace IPayrollConfig {
  export interface ICreate extends IExtendedRecord.ICreate {}
  export interface IUpdate extends IExtendedRecord.IUpdate {}
  export interface IRequest extends IExtendedRecord.IRequest {}
}
export interface IPurchaseReceipt extends IExtendedRecord {}
export namespace IPurchaseReceipt {
  export interface ICreate extends IExtendedRecord.ICreate {}
  export interface IUpdate extends IExtendedRecord.IUpdate {}
  export interface IRequest extends IExtendedRecord.IRequest {}
}
export interface IPurchaseReturn extends IExtendedRecord {}
export namespace IPurchaseReturn {
  export interface ICreate extends IExtendedRecord.ICreate {}
  export interface IUpdate extends IExtendedRecord.IUpdate {}
  export interface IRequest extends IExtendedRecord.IRequest {}
}
export interface ITransfer extends IExtendedRecord {}
export namespace ITransfer {
  export interface ICreate extends IExtendedRecord.ICreate {}
  export interface IUpdate extends IExtendedRecord.IUpdate {}
  export interface IRequest extends IExtendedRecord.IRequest {}
}
export interface ICycleCount extends IExtendedRecord {}
export namespace ICycleCount {
  export interface ICreate extends IExtendedRecord.ICreate {}
  export interface IUpdate extends IExtendedRecord.IUpdate {}
  export interface IRequest extends IExtendedRecord.IRequest {}
}
export interface IInventoryAdjustment extends IExtendedRecord {}
export namespace IInventoryAdjustment {
  export interface ICreate extends IExtendedRecord.ICreate {}
  export interface IUpdate extends IExtendedRecord.IUpdate {}
  export interface IRequest extends IExtendedRecord.IRequest {}
}
export interface ISalesQuote extends IExtendedRecord {}
export namespace ISalesQuote {
  export interface ICreate extends IExtendedRecord.ICreate {}
  export interface IUpdate extends IExtendedRecord.IUpdate {}
  export interface IRequest extends IExtendedRecord.IRequest {}
}
export interface ISalesPrice extends IExtendedRecord {}
export namespace ISalesPrice {
  export interface ICreate extends IExtendedRecord.ICreate {}
  export interface IUpdate extends IExtendedRecord.IUpdate {}
  export interface IRequest extends IExtendedRecord.IRequest {}
}
export interface ICustomerPayment extends IExtendedRecord {}
export namespace ICustomerPayment {
  export interface ICreate extends IExtendedRecord.ICreate {}
  export interface IUpdate extends IExtendedRecord.IUpdate {}
  export interface IRequest extends IExtendedRecord.IRequest {}
}
export interface ISalesReturn extends IExtendedRecord {}
export namespace ISalesReturn {
  export interface ICreate extends IExtendedRecord.ICreate {}
  export interface IUpdate extends IExtendedRecord.IUpdate {}
  export interface IRequest extends IExtendedRecord.IRequest {}
}
export interface ICreditMemo extends IExtendedRecord {}
export namespace ICreditMemo {
  export interface ICreate extends IExtendedRecord.ICreate {}
  export interface IUpdate extends IExtendedRecord.IUpdate {}
  export interface IRequest extends IExtendedRecord.IRequest {}
}
export interface IStockQuarantine extends IExtendedRecord {}
export namespace IStockQuarantine {
  export interface ICreate extends IExtendedRecord.ICreate {}
  export interface IUpdate extends IExtendedRecord.IUpdate {}
  export interface IRequest extends IExtendedRecord.IRequest {}
}
export interface IMrp extends IExtendedRecord {}
export namespace IMrp {
  export interface ICreate extends IExtendedRecord.ICreate {}
  export interface IUpdate extends IExtendedRecord.IUpdate {}
  export interface IRequest extends IExtendedRecord.IRequest {}
}
export interface IMrpRecommendation extends IExtendedRecord {}
export namespace IMrpRecommendation {
  export interface ICreate extends IExtendedRecord.ICreate {}
  export interface IUpdate extends IExtendedRecord.IUpdate {}
  export interface IRequest extends IExtendedRecord.IRequest {}
}
export interface IStockView extends IExtendedRecord {}
export namespace IStockView {
  export interface ICreate extends IExtendedRecord.ICreate {}
  export interface IUpdate extends IExtendedRecord.IUpdate {}
  export interface IRequest extends IExtendedRecord.IRequest {}
}
export interface INotificationPreference extends IExtendedRecord {}
export namespace INotificationPreference {
  export interface ICreate extends IExtendedRecord.ICreate {}
  export interface IUpdate extends IExtendedRecord.IUpdate {}
  export interface IRequest extends IExtendedRecord.IRequest {}
}
export interface IPayrollAdjustment extends IExtendedRecord {}
export namespace IPayrollAdjustment {
  export interface ICreate extends IExtendedRecord.ICreate {}
  export interface IUpdate extends IExtendedRecord.IUpdate {}
  export interface IRequest extends IExtendedRecord.IRequest {}
}
