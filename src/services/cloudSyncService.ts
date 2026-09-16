/**
 * Cloud Sync Service for The Garage SaaS (Firestore + Local-First)
 * Handles real-time multi-device synchronization across POS, Workshop,
 * Admin dashboard and Public Store Catalog.
 */

import { 
  getFirestoreDb, 
  isFirebaseConfigured, 
  getStoredFirebaseConfig 
} from '../lib/firebase';
import { MASTER_PRODUCTS } from '../data/allProducts';

export interface CloudSyncStatus {
  isConfigured: boolean;
  isOnline: boolean;
  projectId: string;
  lastSyncTime: string | null;
  syncedProductsCount: number;
}

const COLLECTIONS = {
  INVENTORY: 'thegarage_inventory',
  SALES: 'thegarage_sales',
  ORDERS: 'thegarage_service_orders',
  CUSTOMERS: 'thegarage_customers',
  ATTENDANCE: 'thegarage_attendance',
  LOGS: 'thegarage_audit_logs'
};

const SYNC_META_KEY = 'bicisaas_cloud_sync_meta';

export function getLocalSyncMeta(): { lastSyncTime: string | null; count: number } {
  if (typeof window === 'undefined') return { lastSyncTime: null, count: 0 };
  try {
    const raw = localStorage.getItem(SYNC_META_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { lastSyncTime: null, count: 0 };
}

export function updateLocalSyncMeta(countDelta: number = 0) {
  if (typeof window === 'undefined') return;
  try {
    const current = getLocalSyncMeta();
    const updated = {
      lastSyncTime: new Date().toISOString(),
      count: Math.max(0, (current.count || 0) + countDelta)
    };
    localStorage.setItem(SYNC_META_KEY, JSON.stringify(updated));
  } catch (e) {}
}

/**
 * Get current sync and connectivity status
 */
export function getSyncStatus(): CloudSyncStatus {
  const configured = isFirebaseConfigured();
  const cfg = getStoredFirebaseConfig();
  const meta = getLocalSyncMeta();

  return {
    isConfigured: configured,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    projectId: cfg.projectId || 'No vinculado',
    lastSyncTime: meta.lastSyncTime,
    syncedProductsCount: meta.count
  };
}

/**
 * Sync a single product update or creation to Cloud Firestore
 */
export async function syncProductToCloud(product: any): Promise<boolean> {
  if (!isFirebaseConfigured()) return false;
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    const { doc, setDoc } = await import('firebase/firestore');
    const docId = String(product.id || product.sku).replace(/[^a-zA-Z0-9_-]/g, '_');
    const docRef = doc(db, COLLECTIONS.INVENTORY, docId);

    await setDoc(docRef, {
      ...product,
      _updatedAt: new Date().toISOString(),
      _syncedFrom: 'POS / SaaS Client'
    }, { merge: true });

    updateLocalSyncMeta(0);
    return true;
  } catch (err) {
    console.warn('[CloudSync] Error syncing product to cloud:', err);
    return false;
  }
}

/**
 * Deduct product stock in Cloud Firestore (Called when sale occurs in POS)
 */
export async function syncStockReductionToCloud(sku: string, quantitySold: number = 1): Promise<boolean> {
  if (!isFirebaseConfigured()) return false;
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    const { doc, setDoc, increment } = await import('firebase/firestore');
    const docId = String(sku).replace(/[^a-zA-Z0-9_-]/g, '_');
    const docRef = doc(db, COLLECTIONS.INVENTORY, docId);

    await setDoc(docRef, {
      stock: increment(-quantitySold),
      _lastSoldAt: new Date().toISOString()
    }, { merge: true });

    return true;
  } catch (err) {
    console.warn('[CloudSync] Error deducting cloud stock:', err);
    return false;
  }
}

/**
 * Sync a POS sale ticket / register receipt to Cloud Firestore
 */
export async function syncSaleToCloud(saleRecord: any): Promise<boolean> {
  if (!isFirebaseConfigured()) return false;
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    const { doc, setDoc } = await import('firebase/firestore');
    const saleId = saleRecord.ticketId || ('sale_' + Date.now());
    const docRef = doc(db, COLLECTIONS.SALES, saleId);

    await setDoc(docRef, {
      ...saleRecord,
      _createdAt: new Date().toISOString()
    }, { merge: true });

    return true;
  } catch (err) {
    console.warn('[CloudSync] Error syncing sale to cloud:', err);
    return false;
  }
}

/**
 * Sync a workshop repair service order (CRM) to Cloud Firestore
 */
export async function syncServiceOrderToCloud(order: any): Promise<boolean> {
  if (!isFirebaseConfigured()) return false;
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    const { doc, setDoc } = await import('firebase/firestore');
    const orderId = order.id || ('order_' + Date.now());
    const docRef = doc(db, COLLECTIONS.ORDERS, String(orderId));

    await setDoc(docRef, {
      ...order,
      _updatedAt: new Date().toISOString()
    }, { merge: true });

    return true;
  } catch (err) {
    console.warn('[CloudSync] Error syncing service order:', err);
    return false;
  }
}

/**
 * Seed Firestore with the Master Catalog (43 products, categories, specs)
 * Uploads all products in batches with retry resilience
 */
export async function seedMasterCatalogToCloud(onProgress?: (current: number, total: number) => void): Promise<{ success: boolean; total: number; message: string }> {
  if (!isFirebaseConfigured()) {
    return {
      success: false,
      total: 0,
      message: 'Debes configurar primero tus credenciales de Google Firebase.'
    };
  }

  const db = getFirestoreDb();
  if (!db) {
    return {
      success: false,
      total: 0,
      message: 'No se pudo inicializar la base de datos Firestore.'
    };
  }

  try {
    const { doc, writeBatch } = await import('firebase/firestore');
    
    // Read local products or fallback to MASTER_PRODUCTS
    let prods = MASTER_PRODUCTS;
    if (typeof window !== 'undefined') {
      try {
        const local = localStorage.getItem('bicisaas_master_products');
        if (local) prods = JSON.parse(local);
      } catch (e) {}
    }

    const total = prods.length;
    let batch = writeBatch(db);
    let countInBatch = 0;
    let totalCommitted = 0;

    for (let i = 0; i < prods.length; i++) {
      const p = prods[i];
      const docId = String(p.id || p.sku).replace(/[^a-zA-Z0-9_-]/g, '_');
      const ref = doc(db, COLLECTIONS.INVENTORY, docId);

      batch.set(ref, {
        ...p,
        _syncedAt: new Date().toISOString(),
        _syncedFrom: 'Master Catalog Seeder'
      }, { merge: true });

      countInBatch++;
      totalCommitted++;

      if (countInBatch >= 20 || i === prods.length - 1) {
        await batch.commit();
        batch = writeBatch(db);
        countInBatch = 0;
        if (onProgress) onProgress(totalCommitted, total);
      }
    }

    // Save metadata
    if (typeof window !== 'undefined') {
      localStorage.setItem(SYNC_META_KEY, JSON.stringify({
        lastSyncTime: new Date().toISOString(),
        count: total
      }));
    }

    return {
      success: true,
      total,
      message: `Catálogo sincronizado: ${total} productos subidos con éxito a Google Cloud Firestore.`
    };
  } catch (err) {
    const msg = err && err.message ? err.message : 'Error en la sincronización';
    return {
      success: false,
      total: 0,
      message: 'Error al subir catálogo: ' + msg
    };
  }
}

/**
 * Real-time listener: subscribe to inventory updates across all devices
 */
export function listenToCloudInventory(callback: (products: any[]) => void): () => void {
  if (!isFirebaseConfigured()) return () => {};
  const db = getFirestoreDb();
  if (!db) return () => {};

  let unsubscribe = () => {};

  import('firebase/firestore').then(({ collection, onSnapshot }) => {
    try {
      const colRef = collection(db, COLLECTIONS.INVENTORY);
      unsubscribe = onSnapshot(colRef, (snapshot) => {
        const items = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
        if (items.length > 0) {
          callback(items);
        }
      }, (err) => {
        console.warn('[CloudSync] Listener snapshot error:', err);
      });
    } catch (e) {
      console.warn('[CloudSync] Failed to setup listener:', e);
    }
  });

  return () => {
    try { unsubscribe(); } catch (e) {}
  };
}
