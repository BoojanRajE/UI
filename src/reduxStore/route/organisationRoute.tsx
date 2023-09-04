import { Organization } from '../../pages/organisation/OrganizationForm';
import { PaginationProp } from '../../utils/globalInterface/GlobalInterfaces';
import api from './index';
const getSearchData = (data: string) =>  api.post('/organization/find', { query: data });
const getOrganizationName = () => api.get('/organization/name');
const getOrganisation = (id: string) => api.get(`/organization/${id}`);
const getOrganisations = (data: PaginationProp) =>  api.post('/organization/getRows', data);
const addOrganisation = (data: Organization) => api.post('/organization', data);
const addOrganisationSignUp = (data: Organization) => api.post('/organization/signup', data);
const editOrganisation = (data: Organization) =>  api.put(`/organization/${data.id}`, data);
const deleteOrganisation = (id: string) => //@ts-ignore 
api.delete(`/organization/${id}`);
export {
  addOrganisationSignUp,
  addOrganisation,
  getOrganisations,
  getOrganisation,
  getOrganizationName,
  editOrganisation,
  deleteOrganisation,
  getSearchData,
};