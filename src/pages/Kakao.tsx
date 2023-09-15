import { useEffect } from "react";
const { kakao } = window;

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
  function smoothZoom(map: any, level: number, offset = 0) {
    const currentLevel = map.getLevel();
    const step = Math.abs(level - currentLevel) / 10;

    function stepZoom() {
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
      container.style.width = "100%";
      container.style.height = "400px";

      const options = {
        center: new window.kakao.maps.LatLng(lat, log),
        level: 3,
      };

      const map = new window.kakao.maps.Map(container, options);

      const zoomControl = new window.kakao.maps.ZoomControl();
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

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

      const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
      const markerPosition = new window.kakao.maps.LatLng(lat, log);

      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        image: markerImage,
      });
      marker.setMap(map);
      const content = '<div class="customoverlay">' + `    <span class="title">${shelter}</span>` + "</div>";
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
