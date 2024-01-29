if (process.env.NODE_ENV !== 'production') {
    const dotenv = require('dotenv');
    // Use dev dependency
    dotenv.config();
}
import {
    NetilionAsset,
    NetilionProduct,
    NetilionBatchResponseDocumentCategory
} from '../interfaces/Netilion';
import { OAUTH_TOKEN, OAUTH_REQUEST_BODY } from '../interfaces/Auth';
