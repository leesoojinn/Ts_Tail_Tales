import axios, { AxiosResponse } from "axios";

export interface AnimalShelter {
  RECEPT_DE: string;
  SHTER_NM: string;
  ServiceKey: string;
  PBLANC_IDNTFY_NO: string | undefined;
  response: any;
  SFETR_INFO: string;
  DISCVRY_PLC_INFO: string;
  SPECIES_NM: string;
  SEX_NM: string;
  IMAGE_COURS: any;
  STATE_NM: string;
  ABDM_IDNTFY_NO: string | undefined;
  SIGUN_NM: string;
  PBLANC_END_DE: string;
  isFavorite?: boolean;
}

const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = "https://openapi.gg.go.kr/AbdmAnimalProtect?";

export async function fetchAnimalData(): Promise<AnimalShelter[]> {
  const URL = `${BASE_URL}KEY=${API_KEY}&Type=json`;

  try {
    const response: AxiosResponse<any> = await axios.get(URL, {
      params: {
        serviceKey: API_KEY,
        numOfRows: 10,
        pageNo: 10,
      },
    });
    return response.data.AbdmAnimalProtect[1].row;
  } catch (error) {
    throw error;
  }
}

export function formatDate(dateString: string | undefined): string {
  if (!dateString || dateString.length < 8) {
    return "잘못된 날짜";
  }

  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);
  return `${year}-${month}-${day}`;
}

export const getShelterPets = async (shelter: string): Promise<AnimalShelter[]> => {
  try {
    const URL = `${BASE_URL}KEY=${API_KEY}&Type=json&SHTER_NM=${shelter}&STATE_NM=보호중`;

    const response: AxiosResponse<any> = await axios.get(URL);
    return response.data.AbdmAnimalProtect.row || [];
  } catch (err: any) {
    console.log(err.message);
    return [];
  }
};
