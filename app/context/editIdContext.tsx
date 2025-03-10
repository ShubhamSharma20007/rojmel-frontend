import { createContext, useContext, useState } from "react";


interface Props{
    editingId:number | null;
    setEditingId: React.Dispatch<React.SetStateAction<number | null>>
}

export const EditIdContext = createContext<Props | null>(null);



export const EditIdContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [editId, setEditId] = useState<number | null>(null);

    return (
        <EditIdContext.Provider value={{editingId: editId, setEditingId: setEditId}}>
            {children}
        </EditIdContext.Provider>
    );
}


export const useEditContext = ()=>{
    const context = useContext(EditIdContext);
    if (!context) {
        throw new Error("useEditContext must be used within a EditIdContextProvider");
    }
    return context;
}