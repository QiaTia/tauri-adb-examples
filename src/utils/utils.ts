/** 延迟 */
export const sleep = (ms = 1e3) => new Promise((resolve) => setTimeout(resolve, ms));