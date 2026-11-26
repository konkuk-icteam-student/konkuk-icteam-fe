import Image from 'next/image';
import AdminProfileMenu from './AdminProfileMenu';

// 관리자 화면 맨 위 헤더. 왼쪽은 학교 로고와 서비스 이름, 오른쪽 끝은 내 정보 메뉴.
// 로고·이름은 그리기만 하므로 이 파일은 서버 컴포넌트로 두고, 눌러서 열고 닫는 내 정보 메뉴만 클라이언트 컴포넌트로 뗀다
export default function AdminHeader() {
  return (
    <header className='flex h-[6.6rem] items-center gap-[1.2rem]'>
      {/* 로고는 사진이 들어간 그림이라 아이콘이 아닌 이미지로 둔다 */}
      <Image src='/logo-ku.svg' alt='건국대학교' width={90} height={47} priority />
      <p className='title-20-bd whitespace-nowrap text-black'>건국대학교 출근부 시스템</p>
      <div className='ml-auto'>
        <AdminProfileMenu />
      </div>
    </header>
  );
}
