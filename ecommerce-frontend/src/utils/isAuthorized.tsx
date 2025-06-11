// src/utils/isAuthorized.ts
export function isSellerOrAdmin(user: any): user is { _id: string; role: 'seller' | 'admin' } {
  return user.role === 'seller' || user.role === 'admin';
}