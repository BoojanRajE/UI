import api from './index';

const getAllMetaDataByType = (data: any) => api.get(`/metadata/${data}`);

export { getAllMetaDataByType };
