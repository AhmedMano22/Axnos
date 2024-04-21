export interface CountryInfo {
    id: string;
    name: string;
    dataType: string;
  }


  export interface University {
    universityId: string;
    name: string;
    countryId: string;
  }

  export interface Faculty {
    faculityId: string;
    name: string;
    universityId: string;
    countryId: string;
  }
  export interface Course {
    name: string;
    image: string | null;
    touter: {
      image: string;
      languages: string[];
      id: string;
      name: string;
      dataType: string;
  } | null;
    university: University;
    faculity: Faculty;
    country: CountryInfo;
    studentsCount: number;
    rate: number | string;
    reviewers: number;
    professorName: string;
    coursePrice: number;
  }
