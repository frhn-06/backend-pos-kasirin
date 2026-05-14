import crypto from 'crypto';
import { SECRET } from './env';

const encrypt = (isi: string) => {
    return crypto.pbkdf2Sync(isi, SECRET, 100, 64, 'sha512').toString("hex");
}

export default encrypt;