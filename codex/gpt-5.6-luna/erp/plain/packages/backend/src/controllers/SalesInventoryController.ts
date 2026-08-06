import * as core from "@nestia/core";
import type { IPage, ISalesInvoice, ISalesOrder, IStockMovement } from "@benchmark/erp-api";
import { Controller, Headers } from "@nestjs/common";
import { AuthProvider } from "../providers/AuthProvider";
import { SalesInventoryProvider as P } from "../providers/SalesInventoryProvider";
@Controller("organization")
export class SalesInventoryController {
  @core.TypedRoute.Post("sales-order") async createOrder(@Headers("authorization") a: string | undefined, @core.TypedBody() body: ISalesOrder.ICreate): Promise<ISalesOrder> { return P.createSalesOrder({ session: await AuthProvider.authenticate(a), body }); }
  @core.TypedRoute.Patch("sales-order") async listOrders(@Headers("authorization") a: string | undefined, @core.TypedBody() body: ISalesOrder.IRequest): Promise<IPage<ISalesOrder>> { return P.listSalesOrders({ session: await AuthProvider.authenticate(a), input: body }); }
  @core.TypedRoute.Put("sales-order/:id") async updateOrder(@Headers("authorization") a: string | undefined, @core.TypedParam("id") id: string, @core.TypedBody() body: ISalesOrder.IUpdate): Promise<ISalesOrder> { return P.updateSalesOrder({ session: await AuthProvider.authenticate(a), id, body }); }
  @core.TypedRoute.Post("sales-order/:id/submit") async submitOrder(@Headers("authorization") a: string | undefined, @core.TypedParam("id") id: string): Promise<ISalesOrder> { return P.submitSalesOrder({ session: await AuthProvider.authenticate(a), id }); }
  @core.TypedRoute.Post("sales-order/:id/approve") async approveOrder(@Headers("authorization") a: string | undefined, @core.TypedParam("id") id: string): Promise<ISalesOrder> { return P.approveSalesOrder({ session: await AuthProvider.authenticate(a), id }); }
  @core.TypedRoute.Post("sales-order/:id/cancel") async cancelOrder(@Headers("authorization") a: string | undefined, @core.TypedParam("id") id: string): Promise<ISalesOrder> { return P.cancelSalesOrder({ session: await AuthProvider.authenticate(a), id }); }
  @core.TypedRoute.Post("sales-invoice") async createInvoice(@Headers("authorization") a: string | undefined, @core.TypedBody() body: ISalesInvoice.ICreate): Promise<ISalesInvoice> { return P.createSalesInvoice({ session: await AuthProvider.authenticate(a), body }); }
  @core.TypedRoute.Patch("sales-invoice") async listInvoices(@Headers("authorization") a: string | undefined, @core.TypedBody() body: ISalesInvoice.IRequest): Promise<IPage<ISalesInvoice>> { return P.listSalesInvoices({ session: await AuthProvider.authenticate(a), input: body }); }
  @core.TypedRoute.Put("sales-invoice/:id") async updateInvoice(@Headers("authorization") a: string | undefined, @core.TypedParam("id") id: string, @core.TypedBody() body: ISalesInvoice.IUpdate): Promise<ISalesInvoice> { return P.updateSalesInvoice({ session: await AuthProvider.authenticate(a), id, body }); }
  @core.TypedRoute.Post("sales-invoice/:id/post") async postInvoice(@Headers("authorization") a: string | undefined, @core.TypedParam("id") id: string): Promise<ISalesInvoice> { return P.postSalesInvoice({ session: await AuthProvider.authenticate(a), id }); }
  @core.TypedRoute.Post("sales-invoice/:id/void") async voidInvoice(@Headers("authorization") a: string | undefined, @core.TypedParam("id") id: string): Promise<ISalesInvoice> { return P.voidSalesInvoice({ session: await AuthProvider.authenticate(a), id }); }
  @core.TypedRoute.Post("stock-movement") async createMovement(@Headers("authorization") a: string | undefined, @core.TypedBody() body: IStockMovement.ICreate): Promise<IStockMovement> { return P.createStockMovement({ session: await AuthProvider.authenticate(a), body }); }
  @core.TypedRoute.Patch("stock-movement") async listMovements(@Headers("authorization") a: string | undefined, @core.TypedBody() body: IStockMovement.IRequest): Promise<IPage<IStockMovement>> { return P.listStockMovements({ session: await AuthProvider.authenticate(a), input: body }); }
}
