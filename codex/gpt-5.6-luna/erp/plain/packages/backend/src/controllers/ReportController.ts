import * as core from "@nestia/core";
import type { IReport } from "@benchmark/erp-api";
import { Controller, Headers } from "@nestjs/common";
import { AuthProvider } from "../providers/AuthProvider";
import { ReportProvider as P } from "../providers/ReportProvider";
@Controller("organization/report") export class ReportController {
  private async run(a:string|undefined,t:string,b:IReport.IRequest):Promise<IReport>{return P.generate({session:await AuthProvider.authenticate(a),reportType:t,body:b});}
  @core.TypedRoute.Post("trial-balance") async trial(@Headers("authorization") a:string|undefined,@core.TypedBody() b:IReport.IRequest):Promise<IReport>{return this.run(a,"trial-balance",b);}
  @core.TypedRoute.Post("balance-sheet") async balance(@Headers("authorization") a:string|undefined,@core.TypedBody() b:IReport.IRequest):Promise<IReport>{return this.run(a,"balance-sheet",b);}
  @core.TypedRoute.Post("profit-loss") async profit(@Headers("authorization") a:string|undefined,@core.TypedBody() b:IReport.IRequest):Promise<IReport>{return this.run(a,"profit-loss",b);}
  @core.TypedRoute.Post("general-ledger") async ledger(@Headers("authorization") a:string|undefined,@core.TypedBody() b:IReport.IRequest):Promise<IReport>{return this.run(a,"general-ledger",b);}
  @core.TypedRoute.Post("ar-aging") async ar(@Headers("authorization") a:string|undefined,@core.TypedBody() b:IReport.IRequest):Promise<IReport>{return this.run(a,"ar-aging",b);}
  @core.TypedRoute.Post("ap-aging") async ap(@Headers("authorization") a:string|undefined,@core.TypedBody() b:IReport.IRequest):Promise<IReport>{return this.run(a,"ap-aging",b);}
  @core.TypedRoute.Post("cash-flow") async cash(@Headers("authorization") a:string|undefined,@core.TypedBody() b:IReport.IRequest):Promise<IReport>{return this.run(a,"cash-flow",b);}
  @core.TypedRoute.Post("tax-summary") async tax(@Headers("authorization") a:string|undefined,@core.TypedBody() b:IReport.IRequest):Promise<IReport>{return this.run(a,"tax-summary",b);}
  @core.TypedRoute.Post("budget-actual") async budget(@Headers("authorization") a:string|undefined,@core.TypedBody() b:IReport.IRequest):Promise<IReport>{return this.run(a,"budget-actual",b);}
  @core.TypedRoute.Post("purchase-status") async purchase(@Headers("authorization") a:string|undefined,@core.TypedBody() b:IReport.IRequest):Promise<IReport>{return this.run(a,"purchase-status",b);}
  @core.TypedRoute.Post("vendor-spend") async vendor(@Headers("authorization") a:string|undefined,@core.TypedBody() b:IReport.IRequest):Promise<IReport>{return this.run(a,"vendor-spend",b);}
  @core.TypedRoute.Post("stock-on-hand") async stock(@Headers("authorization") a:string|undefined,@core.TypedBody() b:IReport.IRequest):Promise<IReport>{return this.run(a,"stock-on-hand",b);}
  @core.TypedRoute.Post("sales-backlog") async sales(@Headers("authorization") a:string|undefined,@core.TypedBody() b:IReport.IRequest):Promise<IReport>{return this.run(a,"sales-backlog",b);}
  @core.TypedRoute.Post("headcount") async headcount(@Headers("authorization") a:string|undefined,@core.TypedBody() b:IReport.IRequest):Promise<IReport>{return this.run(a,"headcount",b);}
  @core.TypedRoute.Post(":reportType/export") async export(@Headers("authorization") a:string|undefined,@core.TypedParam("reportType") t:string,@core.TypedBody() b:IReport.IRequest):Promise<IReport>{return P.exportReport({session:await AuthProvider.authenticate(a),reportType:t,body:b});}
}
