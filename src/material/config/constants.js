import {PaymentProcess} from "../model/enums/PaymentProcess";
import {UserRole} from "../model/enums/UserRole";

export const API_BASE_URL = 'http://localhost:8095';

export const ACCESS_TOKEN = '';
export const TOKEN_TYPE = 'Bearer ';

export const PAYMENT_PROCESS = PaymentProcess.NO_PAYMENT_EXISTS;
export const CURRENT_USER_ROLE = UserRole.NULL

export const DEFAULT_SEARCH_OFFSET = 0;
export const DEFAULT_SEARCH_LIMIT = 8;
