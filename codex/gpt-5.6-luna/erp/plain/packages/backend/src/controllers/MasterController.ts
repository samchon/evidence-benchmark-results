import type * as api from "@benchmark/erp-api";
import * as core from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { tags } from "typia";
import { ErpAuth, ErpAuthGuard, type ErpPayload } from "../decorators/ErpAuth";
import { MasterProvider } from "../providers/MasterProvider";

/** Organization-scoped master data and external party operations. */
@Controller("erp")
@UseGuards(ErpAuthGuard)
export class MasterController {
  /** Creates an address. @tag Address */
  @core.TypedRoute.Post("address")
  public async addressCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IAddress.ICreate): Promise<api.IAddress> { return MasterProvider.addressCreate({ actor, body }); }
  /** Finds active addresses. @tag Address */
  @core.TypedRoute.Patch("address")
  public async addressIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest & { purpose?: null | string }): Promise<api.IPage<api.IAddress>> { return MasterProvider.addressIndex({ actor, input }); }
  /** Reads one address. @tag Address */
  @core.TypedRoute.Get("address/:id")
  public async addressAt(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IAddress> { return MasterProvider.addressAt({ actor, id }); }
  /** Updates a reusable address. @tag Address */
  @core.TypedRoute.Put("address/:id")
  public async addressUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IAddress.IUpdate): Promise<api.IAddress> { return MasterProvider.addressUpdate({ actor, id, body }); }
  /** Deactivates an address for future selection. @tag Address */
  @core.TypedRoute.Delete("address/:id")
  public async addressErase(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IEntity> { return MasterProvider.addressErase({ actor, id }); }

  /** Creates a contact. @tag Contact */
  @core.TypedRoute.Post("contact")
  public async contactCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IContact.ICreate): Promise<api.IContact> { return MasterProvider.contactCreate({ actor, body }); }
  /** Finds active contacts. @tag Contact */
  @core.TypedRoute.Patch("contact")
  public async contactIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest & { search?: null | string }): Promise<api.IPage<api.IContact>> { return MasterProvider.contactIndex({ actor, input }); }
  /** Updates a contact. @tag Contact */
  @core.TypedRoute.Put("contact/:id")
  public async contactUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IContact.IUpdate): Promise<api.IContact> { return MasterProvider.contactUpdate({ actor, id, body }); }
  /** Deactivates a contact. @tag Contact */
  @core.TypedRoute.Delete("contact/:id")
  public async contactErase(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IEntity> { return MasterProvider.contactErase({ actor, id }); }

  /** Creates a vendor or customer. @tag Party */
  @core.TypedRoute.Post("party")
  public async partyCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IParty.ICreate): Promise<api.IParty> { return MasterProvider.partyCreate({ actor, body }); }
  /** Searches active parties. @tag Party */
  @core.TypedRoute.Patch("party")
  public async partyIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest & { kind?: null | ("vendor" | "customer"); search?: null | string }): Promise<api.IPage<api.IParty>> { return MasterProvider.partyIndex({ actor, input }); }
  /** Reads a party. @tag Party */
  @core.TypedRoute.Get("party/:id")
  public async partyAt(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IParty> { return MasterProvider.partyAt({ actor, id }); }
  /** Updates non-sensitive party information. @tag Party */
  @core.TypedRoute.Put("party/:id")
  public async partyUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IParty.IUpdate): Promise<api.IParty> { return MasterProvider.partyUpdate({ actor, id, body }); }
  /** Deactivates a party while retaining history. @tag Party */
  @core.TypedRoute.Delete("party/:id")
  public async partyErase(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IEntity> { return MasterProvider.partyErase({ actor, id }); }
  /** Requests a controlled vendor-bank or customer-credit change. @tag Party */
  @core.TypedRoute.Post("party/:id/change-request")
  public async partyChangeCreate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IPartyChangeRequest.ICreate): Promise<api.IPartyChangeRequest> { return MasterProvider.partyChangeCreate({ actor, id, body }); }
  /** Lists controlled party changes. @tag Party */
  @core.TypedRoute.Patch("party/change-request")
  public async partyChangeIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest & { partyId?: null | (string & tags.Format<"uuid">) }): Promise<api.IPage<api.IPartyChangeRequest>> { return MasterProvider.partyChangeIndex({ actor, input, partyId: input.partyId ?? undefined }); }
  /** Approves or rejects a controlled party change. @tag Party */
  @core.TypedRoute.Put("party/change-request/:id/transition/:status")
  public async partyChangeResolve(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedParam("status") status: "approved" | "rejected"): Promise<api.IPartyChangeRequest> { return MasterProvider.partyChangeResolve({ actor, id, status }); }
  /** Applies an approved party change and emits a sensitive audit event. @tag Party */
  @core.TypedRoute.Put("party/change-request/:id/apply")
  public async partyChangeApply(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IPartyChangeRequest> { return MasterProvider.partyChangeApply({ actor, id }); }

  /** Creates a unit of measure. @tag Unit */
  @core.TypedRoute.Post("unit")
  public async unitCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IUnit.ICreate): Promise<api.IUnit> { return MasterProvider.unitCreate({ actor, body }); }
  /** Lists units of measure. @tag Unit */
  @core.TypedRoute.Patch("unit")
  public async unitIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.IUnit>> { return MasterProvider.unitIndex({ actor, input }); }
  @core.TypedRoute.Put("unit/:id")
  public async unitUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IUnit.IUpdate): Promise<api.IUnit> { return MasterProvider.unitUpdate({ actor, id, body }); }
  @core.TypedRoute.Delete("unit/:id")
  public async unitErase(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IEntity> { return MasterProvider.unitErase({ actor, id }); }

  /** Creates an inventory or service item. @tag Item */
  @core.TypedRoute.Post("item")
  public async itemCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IItem.ICreate): Promise<api.IItem> { return MasterProvider.itemCreate({ actor, body }); }
  /** Searches active items. @tag Item */
  @core.TypedRoute.Patch("item")
  public async itemIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IItem.IIndex): Promise<api.IPage<api.IItem>> { return MasterProvider.itemIndex({ actor, input }); }
  /** Reads one item. @tag Item */
  @core.TypedRoute.Get("item/:id")
  public async itemAt(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IItem> { return MasterProvider.itemAt({ actor, id }); }
  /** Updates commercial item fields. @tag Item */
  @core.TypedRoute.Put("item/:id")
  public async itemUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IItem.IUpdate): Promise<api.IItem> { return MasterProvider.itemUpdateSafe({ actor, id, body }); }
  /** Deactivates an item. @tag Item */
  @core.TypedRoute.Delete("item/:id")
  public async itemErase(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IEntity> { return MasterProvider.itemErase({ actor, id }); }

  /** Creates a warehouse. @tag Warehouse */
  @core.TypedRoute.Post("warehouse")
  public async warehouseCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IWarehouse.ICreate): Promise<api.IWarehouse> { return MasterProvider.warehouseCreate({ actor, body }); }
  /** Searches active warehouses. @tag Warehouse */
  @core.TypedRoute.Patch("warehouse")
  public async warehouseIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IWarehouse.IIndex): Promise<api.IPage<api.IWarehouse>> { return MasterProvider.warehouseIndex({ actor, input }); }
  /** Reads one warehouse. @tag Warehouse */
  @core.TypedRoute.Get("warehouse/:id")
  public async warehouseAt(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IWarehouse> { return MasterProvider.warehouseAt({ actor, id }); }
  /** Updates a warehouse. @tag Warehouse */
  @core.TypedRoute.Put("warehouse/:id")
  public async warehouseUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IWarehouse.IUpdate): Promise<api.IWarehouse> { return MasterProvider.warehouseUpdateSafe({ actor, id, body }); }
  /** Deactivates a warehouse. @tag Warehouse */
  @core.TypedRoute.Delete("warehouse/:id")
  public async warehouseErase(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IEntity> { return MasterProvider.warehouseErase({ actor, id }); }

  /** Creates a storage location and enforces the three-level hierarchy. @tag Location */
  @core.TypedRoute.Post("location")
  public async locationCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.ILocation.ICreate): Promise<api.ILocation> { return MasterProvider.locationCreate({ actor, body }); }
  /** Searches storage locations. @tag Location */
  @core.TypedRoute.Patch("location")
  public async locationIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.ILocation.IIndex): Promise<api.IPage<api.ILocation>> { return MasterProvider.locationIndex({ actor, input }); }
  @core.TypedRoute.Put("location/:id")
  public async locationUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.ILocation.IUpdate): Promise<api.ILocation> { return MasterProvider.locationUpdateSafe({ actor, id, body }); }
  @core.TypedRoute.Delete("location/:id")
  public async locationErase(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IEntity> { return MasterProvider.locationErase({ actor, id }); }
}
