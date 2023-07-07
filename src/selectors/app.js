export const selectCustomerTab = (state) => state.app.customerTab ?? 1;
export const selectMessages = (state) => state.app.messages;
export const selectSiteMessages = (state) => state.app.messages
    .filter(m => m.type === 'site' || m.type === 'version')
    .filter(m => m.start === null || (new Date(m.start).valueOf() < new Date().valueOf()))
    .filter(m => m.end === null || (new Date(m.end).valueOf() > new Date().valueOf()));
