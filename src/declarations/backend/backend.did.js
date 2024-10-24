export const idlFactory = ({ IDL }) => {
  const User = IDL.Record({
    'id' : IDL.Principal,
    'name' : IDL.Text,
    'email' : IDL.Text,
  });
  const Result_1 = IDL.Variant({ 'ok' : User, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  return IDL.Service({
    'getUser' : IDL.Func([], [Result_1], []),
    'isAuthenticated' : IDL.Func([], [IDL.Bool], []),
    'logout' : IDL.Func([], [], []),
    'registerUser' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
