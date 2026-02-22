import api from "./api";
import type { CreateMachineRequest, CreateMachineResponse, DeleteMachineResponse, ListMachinesResponse , getMachineResponse } from "@/types/index"


export const createMachine = async (data: CreateMachineRequest) => {
    console.log(data)
    const response = await api.post<CreateMachineResponse>('/api/machine', 
        data)
    console.log(response)

    return response.data;

}

export const listMachines = async () => {
    const response = await api.get<ListMachinesResponse>('/api/machine');
    return response.data;
}

export const getMachine = async (id: string) => {   
    const response = await api.get<getMachineResponse>(`/api/machine/${id}`);
    return response.data;
}

export const deleteMachine = async(id: string) => {
    const response = await api.delete<DeleteMachineResponse> (`/api/machine/${id}`);
    return response.data;
}