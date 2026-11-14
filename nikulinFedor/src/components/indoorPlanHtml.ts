export const indoorPlanHeight = 500;
export const indoorPlanError = 'Не удалось загрузить план 2ГИС.';
export const indoorPlanOrigin = 'https://floors-widget.api.2gis.ru';

export type FloorSelection = { level: number };

export function indoorPlanHtml(complexId: string) {
  const widgetId = JSON.stringify(complexId).replace(/</g, '\\u003c');

  return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="referrer" content="no-referrer">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' ${indoorPlanOrigin}; style-src 'unsafe-inline'; frame-src ${indoorPlanOrigin}; base-uri 'none'; form-action 'none'">
  <title>Поэтажный план 2ГИС</title>
  <style>
    html, body, #plan { width: 100%; height: 100%; margin: 0; overflow: hidden; }
    #plan iframe { display: block; border: 0; }
    #status {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: grid;
      place-items: center;
      padding: 16px;
      text-align: center;
      background: #f2f5f2;
      color: #303b34;
      font: 16px system-ui, sans-serif;
    }
    #status[hidden] { display: none; }
  </style>
</head>
<body>
  <div id="plan"></div>
  <div id="status" role="status">Загружаем план 2ГИС…</div>
  <script>
    const plan = document.getElementById('plan');
    const status = document.getElementById('status');
    const loader = document.createElement('script');
    let finished = false;
    let requestedFloor;
    let showFloor;
    const timeout = setTimeout(showError, 20000);

    window.showCampusFloor = (level) => {
      if (!Number.isInteger(level) || level < 1) return;
      requestedFloor = String(level);
      if (showFloor) showFloor(requestedFloor);
    };

    window.addEventListener('message', (event) => {
      if (window.parent === window || event.source !== window.parent) return;
      if (event.data?.type === 'campus:show-floor') window.showCampusFloor(event.data.level);
    });

    function showError() {
      if (finished) return;
      finished = true;
      clearTimeout(timeout);
      plan.textContent = '';
      status.textContent = ${JSON.stringify(indoorPlanError)};
    }

    loader.id = 'dg-floors-widget-loader';
    loader.src = '${indoorPlanOrigin}/loader.js';
    loader.onerror = showError;
    loader.onload = () => {
      if (finished) return;

      try {
        const widget = DG.FloorsWidget.init({
          container: plan,
          width: '100%',
          height: '100%',
          initData: {
            complexId: ${widgetId},
            options: { locale: 'ru_RU', initialFloor: requestedFloor ?? '1' },
          },
        });
        plan.querySelector('iframe').title = 'Интерактивный план этажей 2ГИС';
        widget.on('init', ({ floorList }) => {
          const levels = floorList.map(String);
          showFloor = (floor) => {
            if (levels.includes(floor)) widget.showFloor(floor);
          };
          finished = true;
          clearTimeout(timeout);
          status.hidden = true;
          if (requestedFloor) showFloor(requestedFloor);
        });
        widget.on('error', showError);
      } catch {
        showError();
      }
    };
    document.head.appendChild(loader);
  </script>
</body>
</html>`;
}
