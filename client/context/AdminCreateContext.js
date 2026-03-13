import { createContext, useContext, useMemo, useState } from 'react';

const AdminCreateContext = createContext({
  openCreateModal: () => {},
  setOpenCreateModal: () => {}
});

export function AdminCreateProvider({ children }) {
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const value = useMemo(
    () => ({ openCreateModal, setOpenCreateModal }),
    [openCreateModal]
  );

  return (
    <AdminCreateContext.Provider value={value}>
      {children}
    </AdminCreateContext.Provider>
  );
}

export function useAdminCreate() {
  return useContext(AdminCreateContext);
}
