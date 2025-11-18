import http from '../../api/http';
import { UserDTO } from '../../pages/staff';

export type ClientsType = Array<{ id: string; name?: string; displayName?: string;[k: string]: any }>;

export async function loadUsersAndClients(): Promise<{ users: UserDTO[]; clients: ClientsType }> {
  const users = (await http.get('/users')) as UserDTO[];
  const clients = (await http.get('/clients')) as ClientsType;
  return { users, clients };
}
