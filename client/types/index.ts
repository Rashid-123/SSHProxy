
//-------------------- AUTH -------------------------
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  register: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

export interface AuthRequest {
  token: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  message?: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

//----------------- Machine -----------------------

// Request types
export interface CreateMachineRequest {
  name: string;
  hostname: string;
  port?: number;
  username: string;
  privateKey: string;
  passphrase?: string;
  password: string;
}

// Response types
export interface MachineBasicInfo {
  id: string;
  name: string;
  hostname: string;
  port: number;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMachineResponse {
  status: 'success';
  data: {
    id: string;
    name: string;
    hostname: string;
  };
}

export interface ListMachinesResponse {
  status: 'success';
  data: MachineBasicInfo[];
}

export interface DeleteMachineResponse {
  status: 'success';
  message: string;
}

