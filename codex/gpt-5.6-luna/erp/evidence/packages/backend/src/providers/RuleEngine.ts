import { ErrorUtil } from "../utils/ErrorUtil";

type Attributes = Record<string, unknown>;

interface IExisting {
  status: string | null;
  attributes: string | null;
}

/** Applies the cross-module business invariants before an ERP mutation. */
export namespace RuleEngine {
  export function validate(props: {
    operation: string;
    status: string | null | undefined;
    quantity: number | null | undefined;
    attributes: Attributes | null | undefined;
    existing?: IExisting | null;
  }): Attributes {
    const supplied = props.attributes ?? {};
    const previous = parse(props.existing?.attributes);
    const next: Attributes = { ...previous, ...supplied };
    const status =
      props.status ??
      props.existing?.status ??
      (typeof next.status === "string" ? next.status : null);
    const operation = props.operation;

    if (props.existing !== null && props.existing !== undefined) {
      enforceVersion(next, previous);
      if (isImmutable(props.existing.status) && isMutableOperation(operation, status))
        throw ErrorUtil.conflict("Posted, filed, completed, or closed records are immutable.");
    }

    enforceAuditImmutability(operation, props.existing);
    enforceApproval(next, status);
    enforceApprovalStep(operation, next);
    enforceAuthorization(next);
    enforceFiscalPeriod(next, status);
    enforceBalance(next, status);
    enforceJournal(operation, next, status);
    enforceQuantity(next, props.quantity);
    enforceDownstreamRemainder(next);
    enforceInventory(operation, next, props.quantity, status);
    enforcePrimaryContact(next);
    enforceTracking(next, operation, props.quantity);
    enforceTaskHierarchy(operation, next);
    enforceProjectTime(operation, next, status);
    enforceContract(operation, next, status);
    enforceTaxAndReconciliation(operation, next, status);
    deriveCalculatedFacts(operation, next, props.quantity);
    enforceSubmission(next, operation, status);
    enforceSourceLink(next, operation, status);

    next.status = status;
    next.version = (number(previous.version) ?? 0) + 1;
    return next;
  }

  function enforceVersion(next: Attributes, previous: Attributes): void {
    const expected = number(next.expectedVersion);
    const actual = number(previous.version);
    if (expected !== null && actual !== null && expected !== actual)
      throw ErrorUtil.conflict("The record changed before this command was applied.");
  }

  function enforceApproval(attributes: Attributes, status: string | null): void {
    if (
      attributes.requiresApproval === true &&
      (status === "approved" || status === "posted" || status === "completed") &&
      attributes.approvalStatus !== "approved"
    )
      throw ErrorUtil.unprocessable("This transition requires completed approval.");
    if (
      attributes.approvalState === "pending" &&
      (status === "approved" || status === "posted" || status === "completed")
    )
      throw ErrorUtil.unprocessable("A pending approval request cannot be completed.");
  }

  function enforceApprovalStep(operation: string, attributes: Attributes): void {
    if (!/approval/i.test(operation)) return;
    if (
      (attributes.action === "approve" || attributes.action === "reject" || attributes.action === "delegate") &&
      attributes.isCurrentApprover === false
    )
      throw ErrorUtil.forbidden("Only the resolved current-step approver may change approval state.");
    if (Array.isArray(attributes.approverIds)) {
      const ids = attributes.approverIds.filter((id): id is string => typeof id === "string");
      if (new Set(ids).size !== ids.length)
        throw ErrorUtil.unprocessable("One person cannot count twice toward an approval step.");
    }
  }

  function enforceAuthorization(attributes: Attributes): void {
    if (attributes.hasActiveMembership === false)
      throw ErrorUtil.forbidden("An active organization membership is required.");
    if (attributes.authorized === false || attributes.ownerRequired === true && attributes.isOwner !== true)
      throw ErrorUtil.forbidden("The current authority is not permitted for this operation.");
  }

  function enforceFiscalPeriod(attributes: Attributes, status: string | null): void {
    if (status !== "posted" && status !== "filed") return;
    const period = attributes.fiscalPeriodStatus;
    if (period === "hard_closed")
      throw ErrorUtil.conflict("A hard-closed fiscal period refuses new postings.");
    if (period === "soft_closed" && attributes.approvalStatus !== "approved")
      throw ErrorUtil.unprocessable("Posting in a soft-closed period requires approval.");
  }

  function enforceBalance(attributes: Attributes, status: string | null): void {
    if (status !== "posted") return;
    const debit = number(attributes.debitTotal ?? attributes.debits);
    const credit = number(attributes.creditTotal ?? attributes.credits);
    if (debit !== null && credit !== null && debit !== credit)
      throw ErrorUtil.unprocessable("Base-currency debits and credits must balance before posting.");
  }

  function enforceJournal(operation: string, attributes: Attributes, status: string | null): void {
    if (status !== "posted" || !/journal|fin-post|posting/i.test(operation)) return;
    if (!Array.isArray(attributes.lines) || attributes.lines.length === 0)
      throw ErrorUtil.unprocessable("A posted journal requires at least one complete line.");
    let debits = 0;
    let credits = 0;
    for (const line of attributes.lines) {
      if (typeof line !== "object" || line === null || Array.isArray(line))
        throw ErrorUtil.unprocessable("A journal line is incomplete.");
      const row = line as Attributes;
      if (typeof row.accountId !== "string" || row.accountActive === false)
        throw ErrorUtil.unprocessable("Every posted journal line requires an active account.");
      const debit = number(row.debit) ?? 0;
      const credit = number(row.credit) ?? 0;
      if (debit < 0 || credit < 0 || debit > 0 && credit > 0)
        throw ErrorUtil.unprocessable("A journal line must contain one non-negative debit or credit amount.");
      debits += debit;
      credits += credit;
    }
    const declaredDebit = number(attributes.debitTotal ?? attributes.debits) ?? debits;
    const declaredCredit = number(attributes.creditTotal ?? attributes.credits) ?? credits;
    if (declaredDebit !== declaredCredit || debits !== credits)
      throw ErrorUtil.unprocessable("Base-currency debits and credits must balance before posting.");
  }

  function enforceQuantity(attributes: Attributes, quantity: number | null | undefined): void {
    const requested = quantity ?? number(attributes.quantity);
    const remaining = number(attributes.remainingQuantity);
    if (
      requested !== null &&
      remaining !== null &&
      requested > remaining &&
      attributes.approvedOverride !== true
    )
      throw ErrorUtil.unprocessable("The requested quantity exceeds the eligible remainder.");
  }

  function enforcePrimaryContact(attributes: Attributes): void {
    const count = number(attributes.primaryContactCount);
    if (count !== null && count !== 1)
      throw ErrorUtil.unprocessable("Exactly one primary contact is required.");
  }

  function enforceDownstreamRemainder(attributes: Attributes): void {
    const sourceRemaining = number(attributes.sourceRemainingQuantity ?? attributes.remainingQuantity);
    const requested = number(attributes.requestedQuantity ?? attributes.consumedQuantity);
    if (
      sourceRemaining !== null &&
      requested !== null &&
      requested > sourceRemaining &&
      attributes.approvedOverride !== true
    )
      throw ErrorUtil.unprocessable("The downstream document exceeds the remaining source quantity.");
    if (attributes.duplicateEffect === true)
      throw ErrorUtil.conflict("The requested downstream effect has already been accepted.");
  }

  function enforceInventory(
    operation: string,
    attributes: Attributes,
    quantity: number | null | undefined,
    status: string | null,
  ): void {
    if (!/movement|stock_view|shipment|receipt|transfer|allocation|inventory-adjustment|cycle-count/i.test(operation)) return;
    if (attributes.itemType === "service" || attributes.isStockTracked === false)
      throw ErrorUtil.unprocessable("Service items cannot create physical stock movements.");
    const available = number(attributes.availableQuantity);
    const delta = number(attributes.decreaseQuantity ?? quantity ?? attributes.quantity);
    if (
      status === "posted" &&
      available !== null &&
      delta !== null &&
      delta > available &&
      attributes.negativeStockEnabled !== true &&
      attributes.approvedOverride !== true
    )
      throw ErrorUtil.unprocessable("The posting would create negative available stock.");
    if (attributes.movementImmutable === true && attributes.correctsMovement !== true)
      throw ErrorUtil.conflict("Stock movements are immutable; create a linked correction.");
  }

  function enforceTracking(attributes: Attributes, operation: string, quantity: number | null | undefined): void {
    const moving = /receipt|shipment|transfer|movement|allocation/i.test(operation);
    if (moving && attributes.requiresLot === true && typeof attributes.lotId !== "string")
      throw ErrorUtil.unprocessable("Lot-tracked movement requires a valid lot.");
    if (moving && attributes.requiresSerial === true && typeof attributes.serialId !== "string" && !Array.isArray(attributes.serialIds))
      throw ErrorUtil.unprocessable("Serial-tracked movement requires one serial per unit.");
    if (moving && Array.isArray(attributes.serialIds)) {
      const expected = quantity ?? number(attributes.quantity);
      if (expected !== null && attributes.serialIds.length !== expected)
        throw ErrorUtil.unprocessable("Serial-tracked movement requires one serial per unit.");
      if (new Set(attributes.serialIds).size !== attributes.serialIds.length)
        throw ErrorUtil.conflict("A serial code cannot be reused for the same item.");
    }
    if (attributes.serialCodeExists === true)
      throw ErrorUtil.conflict("A serial code already exists for this item.");
  }

  function enforceTaskHierarchy(operation: string, attributes: Attributes): void {
    if (!/task/i.test(operation)) return;
    if (attributes.parentHasParent === true || attributes.parentProjectId !== undefined && attributes.projectId !== undefined && attributes.parentProjectId !== attributes.projectId)
      throw ErrorUtil.unprocessable("Tasks may have one subtask level within one project.");
  }

  function enforceProjectTime(operation: string, attributes: Attributes, status: string | null): void {
    if (/timelog/i.test(operation) && status !== "deleted") {
      if (attributes.projectAssignmentActive === false || attributes.projectDateEligible === false)
        throw ErrorUtil.forbidden("The employee is not assigned to the project for this work date.");
      if (attributes.projectStatus === "archived" || attributes.projectStatus === "completed")
        throw ErrorUtil.conflict("Archived or completed projects refuse new time.");
      if (attributes.locked === true && attributes.isCorrection !== true)
        throw ErrorUtil.conflict("Approved timelogs are locked.");
    }
  }

  function enforceContract(operation: string, attributes: Attributes, status: string | null): void {
    if (!/contract/i.test(operation)) return;
    if (attributes.activeContractCount !== undefined && number(attributes.activeContractCount) !== null && number(attributes.activeContractCount)! > 0 && status === "active" && attributes.replacesContractId === undefined)
      throw ErrorUtil.conflict("An employee may have only one active employment contract.");
    if (attributes.pastContract === true && status !== "replaced" && status !== "ended")
      throw ErrorUtil.conflict("Past employment contracts are immutable.");
  }

  function enforceTaxAndReconciliation(operation: string, attributes: Attributes, status: string | null): void {
    if (status !== "filed" && status !== "completed") return;
    if (/tax-return/i.test(operation) && attributes.taxReconciled === false)
      throw ErrorUtil.unprocessable("A tax return must reconcile before filing.");
    if (/reconciliation/i.test(operation) && attributes.beginningBalance !== undefined && attributes.endingBalance !== undefined) {
      const beginning = number(attributes.beginningBalance);
      const ending = number(attributes.endingBalance);
      const activity = number(attributes.statementActivity);
      if (beginning !== null && ending !== null && activity !== null && beginning + activity !== ending)
        throw ErrorUtil.unprocessable("Statement activity must reconcile to the ending balance.");
    }
  }

  function deriveCalculatedFacts(
    operation: string,
    attributes: Attributes,
    quantity: number | null | undefined,
  ): void {
    if (/receipt/i.test(operation)) {
      const previousQuantity = number(attributes.previousQuantity);
      const previousAverage = number(attributes.previousAverageCost);
      const incomingQuantity = number(attributes.incomingQuantity ?? attributes.quantity ?? quantity);
      const incomingCost = number(attributes.incomingUnitCost ?? attributes.unitCost);
      if (previousQuantity !== null && previousAverage !== null && incomingQuantity !== null && incomingCost !== null) {
        const totalQuantity = previousQuantity + incomingQuantity;
        if (totalQuantity > 0)
          attributes.weightedAverageCost =
            (previousQuantity * previousAverage + incomingQuantity * incomingCost) / totalQuantity;
      }
    }
    if (/shipment/i.test(operation)) {
      const average = number(attributes.weightedAverageCost ?? attributes.currentAverageCost);
      const shippedQuantity = number(attributes.shippedQuantity ?? attributes.quantity ?? quantity);
      if (average !== null && shippedQuantity !== null)
        attributes.cogsAmount = average * shippedQuantity;
    }
    if (/sales[-_]invoice|vendor[-_]bill/i.test(operation)) {
      const taxableBase = number(attributes.taxableBase ?? attributes.amount);
      const taxRate = number(attributes.taxRate);
      if (taxableBase !== null && taxRate !== null)
        attributes.taxAmount = taxableBase * taxRate;
    }
  }

  function enforceAuditImmutability(operation: string, existing?: IExisting | null): void {
    if (existing !== undefined && existing !== null && /audit/i.test(operation))
      throw ErrorUtil.conflict("Audit history cannot be changed through ordinary operations.");
  }

  function enforceSubmission(attributes: Attributes, operation: string, status: string | null): void {
    if (!/timesheet/i.test(operation) || status !== "submitted") return;
    if (Array.isArray(attributes.entries) && attributes.entries.length === 0)
      throw ErrorUtil.unprocessable("An empty timesheet cannot be submitted.");
    if (attributes.rejectionReasonRequired === true && typeof attributes.rejectionReason !== "string")
      throw ErrorUtil.unprocessable("A timesheet rejection reason is required.");
  }

  function enforceSourceLink(attributes: Attributes, operation: string, status: string | null): void {
    if (
      status === "posted" &&
      /invoice|bill|payment|shipment|receipt|return|movement|disposal|impairment/i.test(operation) &&
      attributes.requiresSourceLink === true &&
      typeof attributes.sourceDocumentId !== "string"
    )
      throw ErrorUtil.unprocessable("Posted effects must retain their source-document link.");
  }

  function isImmutable(status: string | null): boolean {
    return status !== null && [
      "approved", "posted", "filed", "completed", "closed", "hard_closed",
      "cancelled", "rejected", "disposed", "voided",
    ].includes(status);
  }

  function isMutableOperation(operation: string, status: string | null): boolean {
    if (status === null) return false;
    return !/reversal|reverse|adjustment|return|reopen|reactivat/i.test(operation);
  }

  function parse(value: string | null | undefined): Attributes {
    if (value === null || value === undefined) return {};
    try {
      const parsed: unknown = JSON.parse(value);
      return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)
        ? (parsed as Attributes)
        : {};
    } catch {
      return {};
    }
  }

  function number(value: unknown): number | null {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() !== "") {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
  }
}
