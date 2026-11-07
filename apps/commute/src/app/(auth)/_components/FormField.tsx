import { Message } from '@konkuk-icteam-fe/design-system/ui';

type FormFieldProps = {
  // 칸 위에 보일 이름
  label: string;
  // 라벨을 누르면 초점이 갈 입력칸의 id
  htmlFor: string;
  // 칸 아래 오류 문구. 오류 말고 다른 안내도 함께 보여야 하는 칸은 넘기지 않고 children에 직접 둔다
  errorProps?: React.ComponentProps<typeof Message>;
  children: React.ReactNode;
};

// 로그인·회원가입 폼의 칸 하나. 라벨, 입력칸, 오류 문구를 같은 간격과 글꼴로 쌓는다
export default function FormField({ label, htmlFor, errorProps, children }: FormFieldProps) {
  return (
    <div className='flex flex-col gap-[0.8rem]'>
      <label htmlFor={htmlFor} className='font-14-bd text-black'>
        {label}
      </label>
      {/* 칸과 오류 문구 사이는 띄우지 않는다 (Message 자체가 2.4rem 높이라 이미 여백이 있다) */}
      <div className='flex flex-col'>
        {children}
        {errorProps && <Message {...errorProps} />}
      </div>
    </div>
  );
}
