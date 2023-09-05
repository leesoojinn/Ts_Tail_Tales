import axios from "axios";

// AnimalShelter 인터페이스를 정의
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

// 환경 변수에서 API 키를 가져옵니다.
const API_KEY = process.env.REACT_APP_API_KEY;

// API 요청을 보낼 기본 URL을 정의합니다.
const BASE_URL = "https://openapi.gg.go.kr/AbdmAnimalProtect?";

// 동물 보호소 데이터를 가져오는 비동기 함수를 정의합니다.
export async function fetchAnimalData() {
  // API 요청 URL을 생성합니다.
  const URL = `${BASE_URL}KEY=${API_KEY}&Type=json`;

  try {
    // axios를 사용하여 API 요청을 보냅니다.
    const response = await axios.get(URL, {
      params: {
        serviceKey: API_KEY,
        numOfRows: 10,
        pageNo: 10,
      },
    });
    // API 응답에서 필요한 데이터를 추출하고 반환합니다.
    return response.data.AbdmAnimalProtect[1].row;
  } catch (error) {
    // 오류가 발생하면 오류를 throw 합니다.
    throw error;
  }
}

// 날짜 문자열을 지정된 형식으로 변환하는 함수를 정의합니다.
export function formatDate(dateString: string) {
  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);
  return `${year}-${month}-${day}`;
}
