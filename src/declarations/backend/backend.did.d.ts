import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : User } |
  { 'err' : string };
export interface User { 'id' : Principal, 'name' : string, 'email' : string }
export interface _SERVICE {
  'getUser' : ActorMethod<[], Result_1>,
  'isAuthenticated' : ActorMethod<[], boolean>,
  'logout' : ActorMethod<[], undefined>,
  'registerUser' : ActorMethod<[string, string], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
