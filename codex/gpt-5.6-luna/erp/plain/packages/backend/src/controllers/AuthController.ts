import * as core from "@nestia/core";
import type {IAuth,IAuthorized,IInvitation,IUser} from "@benchmark/erp-api";
import {Controller,Headers} from "@nestjs/common";
import {AuthProvider} from "../providers/AuthProvider";
@Controller("auth") export class AuthController {
 @core.TypedRoute.Post("user") async createUser(@core.TypedBody() body:IAuth.ICreate):Promise<IUser>{return AuthProvider.createUser({body});}
 @core.TypedRoute.Post("user/login") async login(@core.TypedBody() body:IAuth.ILogin):Promise<IAuthorized>{return AuthProvider.login({body});}
 @core.TypedRoute.Post("user/refresh") async refresh(@core.TypedBody() body:IAuth.IRefresh):Promise<IAuthorized>{return AuthProvider.refresh({body});}
 @core.TypedRoute.Get("user/profile") async profile(@Headers("authorization") a?:string):Promise<IUser>{return AuthProvider.profile({session:await AuthProvider.authenticate(a)});}
 @core.TypedRoute.Put("user/profile") async update(@Headers("authorization") a:string|undefined,@core.TypedBody() body:Partial<Pick<IUser,"displayName"|"avatar"|"phone"|"locale"|"timezone">>):Promise<IUser>{return AuthProvider.updateProfile({session:await AuthProvider.authenticate(a),body});}
 @core.TypedRoute.Post("user/password") async password(@Headers("authorization") a:string|undefined,@core.TypedBody() body:IAuth.IChangePassword):Promise<{success:true}>{return AuthProvider.changePassword({session:await AuthProvider.authenticate(a),body});}
 @core.TypedRoute.Post("user/deactivate") async deactivate(@Headers("authorization") a:string|undefined,@core.TypedBody() body:IAuth.IDeactivate):Promise<{success:true}>{return AuthProvider.deactivate({session:await AuthProvider.authenticate(a),body});}
 @core.TypedRoute.Post("user/logout") async logout(@Headers("authorization") a:string|undefined):Promise<{success:true}>{return AuthProvider.logout({session:await AuthProvider.authenticate(a)});}
 @core.TypedRoute.Post("user/logout-all") async logoutAll(@Headers("authorization") a:string|undefined):Promise<{success:true}>{return AuthProvider.logoutAll({session:await AuthProvider.authenticate(a)});}
 @core.TypedRoute.Post("user/recovery/request") async requestRecovery(@core.TypedBody() body:IAuth.IRecoveryRequest):Promise<{success:true}>{return AuthProvider.requestRecovery({body});}
 @core.TypedRoute.Post("user/recovery/complete") async completeRecovery(@core.TypedBody() body:IAuth.IRecoveryComplete):Promise<{success:true}>{return AuthProvider.completeRecovery({body});}
 @core.TypedRoute.Post("user/organization") async select(@Headers("authorization") a:string|undefined,@core.TypedBody() body:{membershipId:string}):Promise<IAuthorized>{return AuthProvider.selectOrganization({session:await AuthProvider.authenticate(a),membershipId:body.membershipId});}
 @core.TypedRoute.Post("invitation") async invite(@Headers("authorization") a:string|undefined,@core.TypedBody() body:IInvitation.ICreate):Promise<IInvitation>{return AuthProvider.issueInvitation({session:await AuthProvider.authenticate(a),body});}
 @core.TypedRoute.Post("invitation/accept") async accept(@core.TypedBody() body:IInvitation.IAccept):Promise<IInvitation.IAccepted>{return AuthProvider.acceptInvitation({body});}
}
