export type AcademicSetupTableItem = {
  radioButton?: HTMLInputElement;
  academicYear?: string;
  academicStatus?: string;
};

export type DesignationSetupTableItem = {
  selector?: HTMLInputElement;
  designation?: string;
};

export type ZoneSetupTableItem = {
  selector?: HTMLInputElement;
  zoneName?: string;
  zoneStatus?: string;
};

export type RegionSetupTableItem = {
  selector?: HTMLInputElement;
  regionName?: string;
  countryName?: string;
  regionStatus?: string;
};
