// ENCRYPTION SERVICE
// Handles data encryption and decryption

export interface EncryptedData {
  iv: string;
  encrypted: string;
  authTag?: string;
}

class EncryptionService {
  private algorithm: string = 'AES-GCM';
  private keyLength: number = 256;
  private key: CryptoKey | null = null;
  
  async init(secretKey?: string): Promise<void> {
    if (!secretKey) {
      secretKey = process.env.ENCRYPTION_KEY || this.generateKey();
    }
    
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secretKey.padEnd(32, '0').slice(0, 32)),
      { name: this.algorithm },
      false,
      ['encrypt', 'decrypt']
    );
    
    this.key = keyMaterial;
  }
  
  async encrypt(data: string): Promise<EncryptedData> {
    if (!this.key) await this.init();
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(data);
    
    const encrypted = await crypto.subtle.encrypt(
      {
        name: this.algorithm,
        iv: iv
      },
      this.key!,
      encodedData
    );
    
    return {
      iv: this.arrayBufferToBase64(iv),
      encrypted: this.arrayBufferToBase64(encrypted)
    };
  }
  
  async decrypt(encryptedData: EncryptedData): Promise<string> {
    if (!this.key) await this.init();
    
    const iv = this.base64ToArrayBuffer(encryptedData.iv);
    const encrypted = this.base64ToArrayBuffer(encryptedData.encrypted);
    
    const decrypted = await crypto.subtle.decrypt(
      {
        name: this.algorithm,
        iv: iv
      },
      this.key!,
      encrypted
    );
    
    return new TextDecoder().decode(decrypted);
  }
  
  async hash(data: string, salt?: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const saltBuffer = salt ? encoder.encode(salt) : crypto.getRandomValues(new Uint8Array(16));
    
    const hashBuffer = await crypto.subtle.digest('SHA-256', new Uint8Array([...dataBuffer, ...saltBuffer]));
    
    return this.arrayBufferToBase64(hashBuffer);
  }
  
  async verifyHash(data: string, hash: string, salt?: string): Promise<boolean> {
    const computedHash = await this.hash(data, salt);
    return computedHash === hash;
  }
  
  generateKey(): string {
    const array = crypto.getRandomValues(new Uint8Array(32));
    return this.arrayBufferToBase64(array);
  }
  
  generateIV(): string {
    const array = crypto.getRandomValues(new Uint8Array(12));
    return this.arrayBufferToBase64(array);
  }
  
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
  
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
  
  async encryptObject<T>(obj: T): Promise<EncryptedData> {
    const jsonString = JSON.stringify(obj);
    return this.encrypt(jsonString);
  }
  
  async decryptObject<T>(encryptedData: EncryptedData): Promise<T> {
    const jsonString = await this.decrypt(encryptedData);
    return JSON.parse(jsonString);
  }
}

export const encryption = new EncryptionService();