import type { IPage, IReport } from "@benchmark/erp-api";
import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";
import type { SessionPayload } from "./AuthProvider";

export namespace ReportProvider {
  function organization(session: SessionPayload): string {
    if (!session.organizationId)
      throw ErrorUtil.forbidden("Select an active organization first.");
    return session.organizationId;
  }

  async function count(reportType: string, organizationId: string): Promise<number> {
    switch (reportType) {
      case "trial-balance":
      case "balance-sheet":
      case "profit-loss":
      case "general-ledger":
      case "budget-actual":
        return MyGlobal.prisma.journal_entries.count({ where: { organization_id: organizationId } });
      case "ar-aging":
        return MyGlobal.prisma.sales_invoices.count({ where: { organization_id: organizationId } });
      case "ap-aging":
      case "vendor-spend":
        return MyGlobal.prisma.vendor_bills.count({ where: { organization_id: organizationId } });
      case "cash-flow":
        return MyGlobal.prisma.bank_transactions.count({ where: { organization_id: organizationId } });
      case "tax-summary":
        return MyGlobal.prisma.tax_returns.count({ where: { organization_id: organizationId } });
      case "purchase-status":
        return MyGlobal.prisma.purchase_orders.count({ where: { organization_id: organizationId } });
      case "stock-on-hand":
        return MyGlobal.prisma.stock_movements.count({ where: { organization_id: organizationId } });
      case "sales-backlog":
        return MyGlobal.prisma.sales_orders.count({ where: { organization_id: organizationId } });
      case "headcount":
        return MyGlobal.prisma.employees.count({ where: { organization_id: organizationId } });
      default:
        throw ErrorUtil.notFound("Unknown report type.");
    }
  }

  export async function generate(p: {
    session: SessionPayload;
    reportType: string;
    body: IReport.IRequest;
  }): Promise<IReport> {
    const organizationId = organization(p.session);
    const records = await count(p.reportType, organizationId);
    return {
      report_type: p.reportType,
      generated_at: new Date().toISOString(),
      organization_id: organizationId,
      filters: { ...p.body },
      rows: [{ records }],
    };
  }

  export async function exportReport(p: {
    session: SessionPayload;
    reportType: string;
    body: IReport.IRequest;
  }): Promise<IReport> {
    return generate(p);
  }
}
