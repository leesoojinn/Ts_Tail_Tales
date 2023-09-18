import { useEffect } from "react";
const { kakao } = window;

// window 객체에 kakao 속성 추가
declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoProps {
  lat: number;
  log: number;
  shelter: string;
  kind: string;
}

function Kakao({ lat, log, kind, shelter }: KakaoProps) {
  // 부드러운 줌인을 위한 함수
  function smoothZoom(map: any, level: number, offset = 0) {
    // 현재 줌 레벨 가져오기
    const currentLevel = map.getLevel();
    // 스텝 계산
    const step = Math.abs(level - currentLevel) / 10;

    function stepZoom() {
      // 목표 레벨까지 스텝마다 줌인 또는 줌아웃
      if (level > currentLevel && currentLevel + step < level) {
        map.setLevel(currentLevel + step);
        setTimeout(stepZoom, 80);
      } else if (level < currentLevel && currentLevel - step > level) {
        map.setLevel(currentLevel - step);
        setTimeout(stepZoom, 80);
      } else {
        map.setLevel(level);
      }
    }

    stepZoom();
  }
  useEffect(() => {
    const container = document.getElementById("map");
    if (container) {
      // 지도 컨테이너 크기 설정
      container.style.width = "100%";
      container.style.height = "400px";

      const options = {
        center: new window.kakao.maps.LatLng(lat, log), // 중심 좌표 설정
        level: 3, // 지도 초기 줌 레벨 설정
      };

      // Kakao 지도 객체 생성
      const map = new window.kakao.maps.Map(container, options);

      // 줌 컨트롤 추가
      const zoomControl = new window.kakao.maps.ZoomControl();
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

      // 품종에 따라 마커 이미지 설정
      let imageSrc;
      if (kind === "[개]") {
        imageSrc = "https://cdn-icons-png.flaticon.com/512/1623/1623792.png";
      } else if (kind === "[고양이]") {
        imageSrc = "https://cdn-icons-png.flaticon.com/512/2171/2171991.png";
      } else {
        imageSrc = "https://cdn-icons-png.flaticon.com/512/3196/3196017.png";
      }
      const imageSize = new window.kakao.maps.Size(50, 50);
      const imageOption = { offset: new window.kakao.maps.Point(27, 69) };

      const markerImage = new window.kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption
      );
      const markerPosition = new window.kakao.maps.LatLng(lat, log);

      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        image: markerImage,
      });
      marker.setMap(map);

      // 커스텀 오버레이 추가
      const content =
        '<div class="customoverlay">' +
        `    <span class="title">${shelter}</span>` +
        "</div>";
      const position = new kakao.maps.LatLng(lat, log);
      const customOverlay = new kakao.maps.CustomOverlay({
        map: map,
        position: position,
        content: content,
        xAnchor: 0.5,
        yAnchor: 0.91,
      });
    }
  });

  return <div id="map"></div>;
}

export default Kakao;
