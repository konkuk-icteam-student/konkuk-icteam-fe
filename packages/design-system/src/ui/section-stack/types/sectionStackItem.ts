export type SectionStackItem = {
  id: string;
  // 탭에 표시되는 이름 (길면 말줄임)
  title: string;
  // 항목 본문
  content: React.ReactNode;
};
