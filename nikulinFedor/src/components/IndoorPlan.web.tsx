import { useEffect, useRef } from 'react';

import { indoorPlanHeight, indoorPlanHtml, type FloorSelection } from './indoorPlanHtml';

function showFloor(frame: HTMLIFrameElement | null, selection?: FloorSelection) {
  if (selection) {
    // The sandboxed srcDoc has an opaque origin. Its handler checks that the sender is its parent.
    frame?.contentWindow?.postMessage({ type: 'campus:show-floor', level: selection.level }, '*');
  }
}

export default function IndoorPlan({ complexId, floorSelection }: { complexId: string; floorSelection?: FloorSelection }) {
  const map = useRef<HTMLIFrameElement>(null);
  useEffect(() => { showFloor(map.current, floorSelection); }, [floorSelection]);

  return (
    <iframe
      ref={map}
      title="Поэтажный план 2ГИС"
      srcDoc={indoorPlanHtml(complexId)}
      onLoad={(event) => showFloor(event.currentTarget, floorSelection)}
      sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
      style={{ display: 'block', width: '100%', height: indoorPlanHeight, border: 0 }}
    />
  );
}
