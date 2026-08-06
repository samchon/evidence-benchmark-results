import * as core from "@nestia/core";
import type { IFixedAsset, IHRAsset, IPage, IMaintenanceOrder, IPayrollRun, IPayslip } from "@benchmark/erp-api";
import { Controller, Headers } from "@nestjs/common";
import { AuthProvider } from "../providers/AuthProvider";
import { HRAssetProvider as P } from "../providers/HRAssetProvider";
@Controller("organization") export class HRAssetController {
 @core.TypedRoute.Post("payroll-run") async createRun(@Headers("authorization") a:string|undefined,@core.TypedBody() body:IHRAsset.ICreate):Promise<IPayrollRun>{return P.createPayrollRun({session:await AuthProvider.authenticate(a),body});}
 @core.TypedRoute.Patch("payroll-run") async listRuns(@Headers("authorization") a:string|undefined,@core.TypedBody() body:IHRAsset.IRequest):Promise<IPage<IPayrollRun>>{return P.listPayrollRuns({session:await AuthProvider.authenticate(a),input:body});}
 @core.TypedRoute.Post("payroll-run/:id/calculate") async calculateRun(@Headers("authorization") a:string|undefined,@core.TypedParam("id") id:string):Promise<IPayrollRun>{return P.calculatePayrollRun({session:await AuthProvider.authenticate(a),id});}
 @core.TypedRoute.Post("payroll-run/:id/approve") async approveRun(@Headers("authorization") a:string|undefined,@core.TypedParam("id") id:string):Promise<IPayrollRun>{return P.approvePayrollRun({session:await AuthProvider.authenticate(a),id});}
 @core.TypedRoute.Post("payroll-run/:id/post") async postRun(@Headers("authorization") a:string|undefined,@core.TypedParam("id") id:string):Promise<IPayrollRun>{return P.postPayrollRun({session:await AuthProvider.authenticate(a),id});}
 @core.TypedRoute.Post("payslip") async createSlip(@Headers("authorization") a:string|undefined,@core.TypedBody() body:IHRAsset.ICreate):Promise<IPayslip>{return P.createPayslip({session:await AuthProvider.authenticate(a),body});}
 @core.TypedRoute.Patch("payslip") async listSlips(@Headers("authorization") a:string|undefined,@core.TypedBody() body:IHRAsset.IRequest):Promise<IPage<IPayslip>>{return P.listPayslips({session:await AuthProvider.authenticate(a),input:body});}
 @core.TypedRoute.Post("payslip/:id/issue") async issueSlip(@Headers("authorization") a:string|undefined,@core.TypedParam("id") id:string):Promise<IPayslip>{return P.issuePayslip({session:await AuthProvider.authenticate(a),id});}
 @core.TypedRoute.Post("fixed-asset") async createAsset(@Headers("authorization") a:string|undefined,@core.TypedBody() body:IHRAsset.ICreate):Promise<IFixedAsset>{return P.createFixedAsset({session:await AuthProvider.authenticate(a),body});}
 @core.TypedRoute.Patch("fixed-asset") async listAssets(@Headers("authorization") a:string|undefined,@core.TypedBody() body:IHRAsset.IRequest):Promise<IPage<IFixedAsset>>{return P.listFixedAssets({session:await AuthProvider.authenticate(a),input:body});}
 @core.TypedRoute.Post("fixed-asset/:id/capitalize") async capitalizeAsset(@Headers("authorization") a:string|undefined,@core.TypedParam("id") id:string):Promise<IFixedAsset>{return P.capitalizeFixedAsset({session:await AuthProvider.authenticate(a),id});}
 @core.TypedRoute.Post("fixed-asset/:id/depreciate") async depreciateAsset(@Headers("authorization") a:string|undefined,@core.TypedParam("id") id:string,@core.TypedBody() body:{amount:number}):Promise<IFixedAsset>{return P.depreciateFixedAsset({session:await AuthProvider.authenticate(a),id,body});}
 @core.TypedRoute.Post("fixed-asset/:id/dispose") async disposeAsset(@Headers("authorization") a:string|undefined,@core.TypedParam("id") id:string):Promise<IFixedAsset>{return P.disposeFixedAsset({session:await AuthProvider.authenticate(a),id});}
 @core.TypedRoute.Post("maintenance-order") async createMaintenance(@Headers("authorization") a:string|undefined,@core.TypedBody() body:IHRAsset.ICreate):Promise<IMaintenanceOrder>{return P.createMaintenanceOrder({session:await AuthProvider.authenticate(a),body});}
 @core.TypedRoute.Patch("maintenance-order") async listMaintenance(@Headers("authorization") a:string|undefined,@core.TypedBody() body:IHRAsset.IRequest):Promise<IPage<IMaintenanceOrder>>{return P.listMaintenanceOrders({session:await AuthProvider.authenticate(a),input:body});}
 @core.TypedRoute.Post("maintenance-order/:id/complete") async completeMaintenance(@Headers("authorization") a:string|undefined,@core.TypedParam("id") id:string):Promise<IMaintenanceOrder>{return P.completeMaintenanceOrder({session:await AuthProvider.authenticate(a),id});}
}
