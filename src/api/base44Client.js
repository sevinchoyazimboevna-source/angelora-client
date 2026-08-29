// Compatibility shim: the original Base44 UI imports this module in a few legacy pages.
// All network operations now go through the ANGELORA REST client.
export { api as base44 } from '@/api/restClient';
