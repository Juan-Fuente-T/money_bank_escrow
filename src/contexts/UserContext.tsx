// // src/contexts/UserContext.tsx
// import React, { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction } from 'react';

// // interface UserContextType {
// interface UserContextProps{
//   user1: number;
//   setUser1: Dispatch<SetStateAction<number>>;
//   theOwnershipId: number;
//   setTheOwnershipId: Dispatch<SetStateAction<number>>;
// }

// // const UserContext = createContext<UserContextType | undefined>(undefined);
// const UserContext = createContext<UserContextProps>({
//   theOwnershipId: 0,
//   setTheOwnershipId: () => { },
//   user1: 0,
//   setUser1: function (value: React.SetStateAction<number>): void {
//     throw new Error('Function not implemented.');
//   }
// });

// export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [user1, setUser1] = useState<number>(0);
//   const [theOwnershipId, setTheOwnershipId] = useState<number>(0);
//   console.log("En context", theOwnershipId);

//   return (
//     <UserContext.Provider value={{ user1, setUser1, theOwnershipId, setTheOwnershipId }}>
//       {children}
//     </UserContext.Provider>
//   );
// };
// export const useUserContext = (): UserContextProps => {
//   const context = useContext(UserContext);
//   if (!context) {
//     throw new Error('useUserContext must be used within a UserProvider');
//   }
//   return context;
// };