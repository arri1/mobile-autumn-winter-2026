const firstFloorMap = 'https://2gis.ru/yakutsk/firm/7037402698770815';
const sportsFacilities = 'https://www.s-vfu.ru/universitet/rukovodstvo-i-struktura/instituty/izfir/Внеучебная%20активность%20ИЗФиРА_compressed.pdf';
const scienceFair = 'https://ysf.lensky-kray.ru/en/';
const mathOlympiad = 'https://lensky-kray.ru/index.php?id=199&r=projectspages%2Fview';
const labAccreditation = 'https://labsearch.ru/test_labs/34037/';

// Floor 1 labels were checked manually against the map supplied by the user.
const firstFloor = [
  '126', '138', '140', '142', '144', '146', '148', '149',
  '150', '153', '155', '161', '193', '195', '197', '199',
];

export const kfenRooms: { number: string; floor: number; source: string }[] = [
  ...firstFloor.map((number) => ({ number, floor: 1, source: firstFloorMap })),
  { number: '263', floor: 2, source: 'https://nsdf.ru/events-2026/' },
  { number: '270', floor: 2, source: sportsFacilities },
  { number: '286', floor: 2, source: sportsFacilities },
  { number: '324', floor: 3, source: 'https://lensky-kray.ru/index.php?id=383&r=projectspages%2Fview' },
  { number: '355А', floor: 3, source: 'https://leader-id.ru/events/559652' },
  { number: '358', floor: 3, source: 'https://t.me/svfunews/12423' },
  { number: '358А', floor: 3, source: scienceFair },
  { number: '445', floor: 4, source: scienceFair },
  { number: '451', floor: 4, source: mathOlympiad },
  { number: '453', floor: 4, source: mathOlympiad },
  { number: '455', floor: 4, source: mathOlympiad },
  { number: '457', floor: 4, source: mathOlympiad },
  { number: '461', floor: 4, source: 'https://lensky-kray.ru/index.php?id=506&r=projectspages%2Fview' },
  // The institute confirms this room in its current contacts at https://opensvfu.ru/.
  { number: '532', floor: 5, source: 'https://yakutsk.gdeprof.ru/svfu-im-m-k-ammosova-open' },
  { number: '626', floor: 6, source: 'https://lensky-kray.ru/index.php?id=558&r=projectspages%2Fview' },
  { number: '707', floor: 7, source: labAccreditation },
  { number: '709', floor: 7, source: labAccreditation },
];
