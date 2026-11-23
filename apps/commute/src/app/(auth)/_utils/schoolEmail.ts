const SCHOOL_EMAIL_DOMAIN = 'konkuk.ac.kr';

/**
 * 메일 칸에 입력한 글자로 자동완성할 학교 메일을 만듭니다.
 * @param input 메일 칸에 입력한 글자
 * @returns 자동완성할 학교 메일. 채울 것이 없으면 undefined
 * @example getSchoolEmailSuggestion('gildong'); // 'gildong@konkuk.ac.kr'
 */
export const getSchoolEmailSuggestion = (input: string) => {
  const [localPart, domainPart = ''] = input.trim().split('@');
  if (!localPart) return undefined;

  const typedDomain = domainPart.toLowerCase();
  const isTypingSchoolDomain =
    typedDomain !== SCHOOL_EMAIL_DOMAIN && SCHOOL_EMAIL_DOMAIN.startsWith(typedDomain);

  return isTypingSchoolDomain ? `${localPart}@${SCHOOL_EMAIL_DOMAIN}` : undefined;
};
