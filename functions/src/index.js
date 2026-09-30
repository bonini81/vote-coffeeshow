import { setGlobalOptions } from 'firebase-functions/v2';
import { initializeApp } from 'firebase-admin/app';
import { submitVote } from './submitVote.js';

initializeApp();
setGlobalOptions({ region: 'us-central1', maxInstances: 10 });

export { submitVote };
