export interface Organization {
  id: string;
  name: string;
  city: string;
  state: any;
  country: any;
  sector: string;
  type: string;
  other_type_desc: string;
  ihe_classification: string[];
  ug_full_time_enrollment: boolean;
  ug_part_time_enrollment: boolean;
  graduate_enrollment: boolean;
  is_active: boolean;
  created_by: string;
}
