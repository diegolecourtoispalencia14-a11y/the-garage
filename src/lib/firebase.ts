/**
 * Firebase Client & Cloud Firestore Connection Module
 * The Garage Bike Experts · BiciSaaS Enterprise
 * 
 * Provides resilient initialization with offline-first support and
 * runtime configuration management from the SaaS admin panel.
 */

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
  isCustom?: boolean;
}

const STORAGE_KEY = 'bicisaas_firebase_config';

export const DEFAULT_FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
  isCustom: false
};

export function getStoredFirebaseConfig(): FirebaseConfig {
  if (typeof window === 'undefined') return DEFAULT_FIREBASE_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.projectId) {
        return { ...DEFAULT_FIREBASE_CONFIG, ...parsed, isCustom: true };
      }
    }
  } catch (e) {
    console.warn('[Firebase] Error reading stored config:', e);
  }
  return DEFAULT_FIREBASE_CONFIG;
}

export function saveFirebaseConfig(config: Partial<FirebaseConfig>): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const current = getStoredFirebaseConfig();
    const updated: FirebaseConfig = {
      ...current,
      ...config,
      isCustom: Boolean(config.apiKey && config.projectId)
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (e) {
    console.error('[Firebase] Error saving config:', e);
    return false;
  }
}

export function isFirebaseConfigured(): boolean {
  const config = getStoredFirebaseConfig();
  return Boolean(config.apiKey && config.projectId && config.apiKey.length > 5);
}

let cachedApp: FirebaseApp | null = null;
let cachedDb: Firestore | null = null;
let cachedAuth: Auth | null = null;
let cachedStorage: FirebaseStorage | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === 'undefined') return null;
  if (!isFirebaseConfigured()) return null;

  try {
    if (cachedApp) return cachedApp;

    const existingApps = getApps();
    if (existingApps.length > 0) {
      cachedApp = existingApps[0];
      return cachedApp;
    }

    const config = getStoredFirebaseConfig();
    cachedApp = initializeApp(config);
    return cachedApp;
  } catch (err) {
    console.warn('[Firebase] Initialization error:', err);
    return null;
  }
}

export function getFirestoreDb(): Firestore | null {
  if (typeof window === 'undefined') return null;
  if (cachedDb) return cachedDb;

  const app = getFirebaseApp();
  if (!app) return null;

  try {
    cachedDb = getFirestore(app);
    return cachedDb;
  } catch (err) {
    console.warn('[Firebase] Firestore init error:', err);
    return null;
  }
}

export function getFirebaseAuth(): Auth | null {
  if (typeof window === 'undefined') return null;
  if (cachedAuth) return cachedAuth;

  const app = getFirebaseApp();
  if (!app) return null;

  try {
    cachedAuth = getAuth(app);
    return cachedAuth;
  } catch (err) {
    console.warn('[Firebase] Auth init error:', err);
    return null;
  }
}

export function getFirebaseStorage(): FirebaseStorage | null {
  if (typeof window === 'undefined') return null;
  if (cachedStorage) return cachedStorage;

  const app = getFirebaseApp();
  if (!app) return null;

  try {
    cachedStorage = getStorage(app);
    return cachedStorage;
  } catch (err) {
    console.warn('[Firebase] Storage init error:', err);
    return null;
  }
}

export async function testFirebaseConnection(): Promise<{ success: boolean; message: string; latencyMs?: number }> {
  if (!isFirebaseConfigured()) {
    return {
      success: false,
      message: 'Faltan credenciales (API Key o Project ID) en la configuración.'
    };
  }

  const startTime = Date.now();
  try {
    const db = getFirestoreDb();
    if (!db) {
      return { success: false, message: 'No se pudo inicializar Firestore SDK.' };
    }

    const { doc, getDoc, setDoc } = await import('firebase/firestore');
    const testRef = doc(db, '_connection_test', 'ping');
    
    await setDoc(testRef, {
      ping: true,
      lastCheck: new Date().toISOString(),
      platform: 'The Garage BiciSaaS POS'
    }, { merge: true });

    await getDoc(testRef);
    const latency = Date.now() - startTime;

    return {
      success: true,
      message: 'Conexión exitosa con Google Cloud Firestore (' + latency + 'ms).',
      latencyMs: latency
    };
  } catch (err) {
    const msg = err && err.message ? err.message : 'Error desconocido de enlace con Firebase';
    return {
      success: false,
      message: 'Error de enlace con Firebase: ' + msg
    };
  }
}
