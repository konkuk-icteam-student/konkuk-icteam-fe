import { describe, expect, it } from 'vitest';
import { getSchoolEmailSuggestion } from './schoolEmail';

describe('getSchoolEmailSuggestion', () => {
  it('아이디만 입력하면 학교 메일을 후보로 보여 준다', () => {
    expect(getSchoolEmailSuggestion('gildong')).toBe('gildong@konkuk.ac.kr');
  });

  it('@ 뒤를 학교 메일 앞부분까지만 입력해도 나머지를 채운 후보를 보여 준다', () => {
    ['gildong@', 'gildong@ko', 'gildong@KONKUK.ac'].forEach((input) => {
      expect(getSchoolEmailSuggestion(input)).toBe('gildong@konkuk.ac.kr');
    });
  });

  it('학교 메일을 다 입력했으면 후보가 없다', () => {
    expect(getSchoolEmailSuggestion('gildong@konkuk.ac.kr')).toBeUndefined();
  });

  it('다른 도메인을 입력하면 후보가 없다', () => {
    expect(getSchoolEmailSuggestion('gildong@gmail.com')).toBeUndefined();
  });

  it('비어 있거나 아이디 없이 @부터 입력하면 후보가 없다', () => {
    ['', '   ', '@', '@konkuk'].forEach((input) => {
      expect(getSchoolEmailSuggestion(input)).toBeUndefined();
    });
  });
});
