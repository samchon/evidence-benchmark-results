import * as core from "@nestia/core";
import type { IApprovalRequest, IAuditEvent, INotification, IPage, IWorkflow } from "@benchmark/erp-api";
import { Controller, Headers } from "@nestjs/common";
import { AuthProvider } from "../providers/AuthProvider";
import { WorkflowProvider as P } from "../providers/WorkflowProvider";
@Controller("organization") export class WorkflowController {
 @core.TypedRoute.Post("workflow") async createWorkflow(@Headers("authorization") a:string|undefined,@core.TypedBody() body:IWorkflow.ICreate):Promise<IWorkflow>{return P.createWorkflow({session:await AuthProvider.authenticate(a),body});}
 @core.TypedRoute.Patch("workflow") async listWorkflows(@Headers("authorization") a:string|undefined,@core.TypedBody() body:IWorkflow.IRequest):Promise<IPage<IWorkflow>>{return P.listWorkflows({session:await AuthProvider.authenticate(a),input:body});}
 @core.TypedRoute.Post("workflow/:id/activate") async activateWorkflow(@Headers("authorization") a:string|undefined,@core.TypedParam("id") id:string):Promise<IWorkflow>{return P.activateWorkflow({session:await AuthProvider.authenticate(a),id});}
 @core.TypedRoute.Post("workflow/:id/deactivate") async deactivateWorkflow(@Headers("authorization") a:string|undefined,@core.TypedParam("id") id:string):Promise<IWorkflow>{return P.deactivateWorkflow({session:await AuthProvider.authenticate(a),id});}
 @core.TypedRoute.Post("approval") async createApproval(@Headers("authorization") a:string|undefined,@core.TypedBody() body:IApprovalRequest.ICreate):Promise<IApprovalRequest>{return P.createApproval({session:await AuthProvider.authenticate(a),body});}
 @core.TypedRoute.Patch("approval") async listApprovals(@Headers("authorization") a:string|undefined,@core.TypedBody() body:IApprovalRequest.IRequest):Promise<IPage<IApprovalRequest>>{return P.listApprovals({session:await AuthProvider.authenticate(a),input:body});}
 @core.TypedRoute.Post("approval/:id/approve") async approve(@Headers("authorization") a:string|undefined,@core.TypedParam("id") id:string):Promise<IApprovalRequest>{return P.approve({session:await AuthProvider.authenticate(a),id});}
 @core.TypedRoute.Post("approval/:id/reject") async reject(@Headers("authorization") a:string|undefined,@core.TypedParam("id") id:string,@core.TypedBody() body:IApprovalRequest.IReason):Promise<IApprovalRequest>{return P.reject({session:await AuthProvider.authenticate(a),id,body});}
 @core.TypedRoute.Post("audit") async createAudit(@Headers("authorization") a:string|undefined,@core.TypedBody() body:IAuditEvent.ICreate):Promise<IAuditEvent>{return P.createAudit({session:await AuthProvider.authenticate(a),body});}
 @core.TypedRoute.Patch("audit") async listAudits(@Headers("authorization") a:string|undefined,@core.TypedBody() body:IAuditEvent.IRequest):Promise<IPage<IAuditEvent>>{return P.listAudits({session:await AuthProvider.authenticate(a),input:body});}
 @core.TypedRoute.Patch("notification") async listNotifications(@Headers("authorization") a:string|undefined,@core.TypedBody() body:INotification.IRequest):Promise<IPage<INotification>>{return P.listNotifications({session:await AuthProvider.authenticate(a),input:body});}
 @core.TypedRoute.Post("notification/:id/read") async readNotification(@Headers("authorization") a:string|undefined,@core.TypedParam("id") id:string):Promise<INotification>{return P.readNotification({session:await AuthProvider.authenticate(a),id});}
}
