export type Role = 'USER' | 'ADMIN';

export type Status = 'PENDING' | 'APPROVED' | 'REJECTED' | 'FULFILLED' | 'BROKEN';

export type PoliticalParty = 'DEMOCRATIC' | 'REPUBLICAN' | 'INDEPENDENT' | 'OTHER';

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: Role;
}

export interface Promise {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  promiserName: string;
  description: string;
  party: PoliticalParty;
  articleLink: string;
  promisedDate: Date;
  imageUrl?: string | null;
  status: Status;
  userId: string;
  user: User;
}
