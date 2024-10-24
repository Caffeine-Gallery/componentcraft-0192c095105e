import Bool "mo:base/Bool";
import Hash "mo:base/Hash";

import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Error "mo:base/Error";
import Result "mo:base/Result";
import Option "mo:base/Option";
import Debug "mo:base/Debug";

actor {
    type User = {
        id: Principal;
        name: Text;
        email: Text;
    };

    let users = HashMap.HashMap<Principal, User>(10, Principal.equal, Principal.hash);

    public shared(msg) func registerUser(name: Text, email: Text) : async Result.Result<(), Text> {
        let userId = msg.caller;
        
        switch (users.get(userId)) {
            case (?existingUser) {
                #err("User already registered")
            };
            case null {
                let newUser : User = {
                    id = userId;
                    name = name;
                    email = email;
                };
                users.put(userId, newUser);
                #ok(())
            };
        }
    };

    public shared(msg) func getUser() : async Result.Result<User, Text> {
        let userId = msg.caller;
        
        switch (users.get(userId)) {
            case (?user) {
                #ok(user)
            };
            case null {
                #err("User not found")
            };
        }
    };

    public shared(msg) func isAuthenticated() : async Bool {
        Option.isSome(users.get(msg.caller))
    };

    public shared(msg) func logout() : async () {
        users.delete(msg.caller);
    };
}
