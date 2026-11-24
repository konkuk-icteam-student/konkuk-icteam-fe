/**
 * 누른 키가 Enter인지 봅니다. 한글 조합 중에 누른 Enter는 조합을 끝내는 키라 Enter로 보지 않습니다.
 * @param event 입력칸의 keydown 이벤트
 * @returns 조합 중이 아닌 Enter면 true
 * @example if (hasEnterKey(event)) submit();
 */
const hasEnterKey = (event: React.KeyboardEvent<HTMLInputElement>) =>
  event.key === 'Enter' && !event.nativeEvent.isComposing;

export default hasEnterKey;
